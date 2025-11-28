import { streamText, tool, convertToModelMessages, stepCountIs, embed } from 'ai';
import { createDeepSeek } from '@ai-sdk/deepseek';
import { createOpenAI } from '@ai-sdk/openai';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

// 1. 创建 DeepSeek Provider
const deepseek = createDeepSeek({
    apiKey: process.env.DEEPSEEK_API_KEY ?? '',
});

// 1.5. 创建智谱 AI Provider (用于 Embedding)
const zhipu = createOpenAI({
    apiKey: process.env.ZHIPU_API_KEY ?? '',
    baseURL: 'https://open.bigmodel.cn/api/paas/v4',
});

// 2. 初始化 Supabase 客户端
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''
);

// 允许最长 30 秒的响应时间
export const maxDuration = 30;

export async function POST(request: Request) {
    try {
        const { messages } = await request.json() as { messages: any[] };

        // 提取最后一条用户消息
        const lastMessage = messages[messages.length - 1];

        // 提取用户文本内容（用于保存和 RAG 检索）
        let userContent = '';
        if (lastMessage && lastMessage.role === 'user') {
            if (typeof lastMessage.content === 'string') {
                userContent = lastMessage.content;
            } else if (Array.isArray(lastMessage.parts)) {
                userContent = lastMessage.parts
                    .filter((part: { type: string; text?: string }) => part.type === 'text')
                    .map((part: { type: string; text?: string }) => part.text || '')
                    .join('');
            }
        }

        // 保存用户消息到数据库
        if (lastMessage && lastMessage.role === 'user') {
            try {
                const { error } = await supabase
                    .from('messages')
                    .insert({
                        role: 'user',
                        content: userContent,
                        created_at: new Date().toISOString(),
                    });

                if (error) {
                    console.error('Failed to save user message:', error);
                }
            } catch (err) {
                console.error('Error saving user message:', err);
            }
        }

        // ========== RAG 检索逻辑 ==========
        let contextInfo = '';

        if (userContent) {
            try {
                // 1. 使用智谱 AI 生成用户问题的 Embedding
                const { embedding } = await embed({
                    model: zhipu.embedding('embedding-3'),
                    value: userContent,
                });

                console.log('[RAG] Generated embedding for user query');

                // 2. 使用向量搜索查询相似文档
                const { data: documents, error: searchError } = await supabase.rpc('match_documents', {
                    query_embedding: embedding,
                    match_threshold: 0,
                    match_count: 5,
                });

                if (searchError) {
                    console.error('[RAG] Vector search error:', searchError);
                } else if (documents && documents.length > 0) {
                    console.log(`[RAG] Found ${documents.length} relevant documents`);

                    // 3. 拼接文档内容作为上下文
                    contextInfo = documents
                        .map((doc: any) => doc.content)
                        .filter((content: string) => content && content.trim())
                        .join('\n\n');

                    console.log('[RAG] Final contextInfo length:', contextInfo.length);
                } else {
                    console.log('[RAG] No relevant documents found');
                }
            } catch (err) {
                console.error('[RAG] Error during retrieval:', err);
            }
        }

        // ========== 动态构建 System Prompt ==========
        let systemPrompt = '你是一个拥有10年经验的资深工程师，性格毒舌但专业。回答问题时，请直接给出代码方案，并嘲讽一下过时的技术。';

        // RAG 注入状态（搜到简历时）
        if (contextInfo) {
            console.log('[RAG] ✅ contextInfo is valid, injecting into prompt');
            systemPrompt = `你是一个求职者，正在接受面试官的提问。

你的简历信息：
${contextInfo}

回答规则：
- 使用第一人称"我"来回答
- 只回答简历中有的内容
- 如果需要获取额外信息（如天气），直接调用工具，不要说"我来帮你查"等废话
- 工具调用后，必须基于结果生成完整的自然语言回复`;
        } else {
            console.log('[RAG] ❌ contextInfo is empty, using fallback prompt');
        }

        // 调用 streamText
        const result = streamText({
            model: deepseek('deepseek-chat'),
            messages: convertToModelMessages(messages),
            system: systemPrompt,

            // 工具定义
            tools: {
                getWeather: tool({
                    description: 'Get the current weather for a specific city',
                    inputSchema: z.object({
                        city: z.string().describe('The name of the city to get weather for'),
                    }),
                    execute: async ({ city }: { city: string }) => {
                        console.log(`[Tool Call] Getting weather for: ${city}`);

                        if (city.toLowerCase().includes('beijing') || city.toLowerCase().includes('北京')) {
                            return {
                                city,
                                temperature: '24°C',
                                condition: 'Sunny',
                                humidity: '45%',
                            };
                        } else if (city.toLowerCase().includes('shanghai') || city.toLowerCase().includes('上海')) {
                            return {
                                city,
                                temperature: '22°C',
                                condition: 'Partly Cloudy',
                                humidity: '60%',
                            };
                        } else {
                            return {
                                city,
                                temperature: '20°C',
                                condition: 'Cloudy',
                                humidity: '55%',
                            };
                        }
                    },
                }),
            },

            // 启用多步执行：允许模型在调用工具后继续生成回复
            stopWhen: stepCountIs(5),

            // onFinish 回调：保存 AI 响应
            onFinish: async ({ text }: { text: string }) => {
                console.log('[onFinish] Final text:', text);

                try {
                    // 只有当有文本内容时才保存
                    if (text && text.trim().length > 0) {
                        const { error } = await supabase
                            .from('messages')
                            .insert({
                                role: 'assistant',
                                content: text,
                                created_at: new Date().toISOString(),
                            });

                        if (error) {
                            console.error('Failed to save assistant message:', error);
                        }
                    }
                } catch (err) {
                    console.error('Error saving assistant message:', err);
                }
            },
        });

        // 返回 UI 消息流响应
        return result.toUIMessageStreamResponse();

    } catch (error) {
        console.error('API Error:', error);
        return new Response('Internal Server Error', { status: 500 });
    }
}
