import { streamText, convertToModelMessages, stepCountIs } from 'ai';
import { createDeepSeek } from '@ai-sdk/deepseek';
import { saveMessage } from '@/lib/services/message-service';
import { ALL_TOOLS } from '@/lib/ai/tools';
import { getContext } from '@/lib/ai/rag-service';
import { GET_SYSTEM_PROMPT } from '@/lib/ai/prompts';

// 1. 创建 DeepSeek Provider
const deepseek = createDeepSeek({
    apiKey: process.env.DEEPSEEK_API_KEY ?? '',
});

// 允许最长 30 秒的响应时间
export const maxDuration = 30;

export async function POST(request: Request) {
    try {
        const { messages } = await request.json() as { messages: any[] };

        // 提取最后一条用户消息
        const lastMessage = messages[messages.length - 1];

        // 提取用户文本内容（用于保存和 RAG 检索）
        // 支持纯文本和多模态消息结构
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
                await saveMessage('user', userContent);
            } catch (err) {
                console.error('Error saving user message:', err);
            }
        }

        // ========== RAG 检索逻辑 ==========
        // 根据用户问题获取相关上下文
        const contextInfo = await getContext(userContent);

        // ========== 动态构建 System Prompt ==========
        // 根据是否有上下文，切换不同的系统提示词
        const systemPrompt = GET_SYSTEM_PROMPT(contextInfo);

        if (contextInfo) {
            console.log('[RAG] ✅ contextInfo is valid, injecting into prompt');
        } else {
            console.log('[RAG] ❌ contextInfo is empty, using fallback prompt');
        }

        // 调用 streamText
        const result = streamText({
            model: deepseek('deepseek-chat'),
            messages: convertToModelMessages(messages),
            system: systemPrompt,

            // 工具定义
            tools: ALL_TOOLS,

            // 启用多步执行：允许模型在调用工具后继续生成回复 (最大 5 步)
            stopWhen: stepCountIs(5),

            // onFinish 回调：保存 AI 响应
            onFinish: async ({ text }: { text: string }) => {
                // console.log('[onFinish] Final text:', text);
                console.log('[onFinish] ');

                try {
                    // 只有当有文本内容时才保存
                    if (text && text.trim().length > 0) {
                        await saveMessage('assistant', text);
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
