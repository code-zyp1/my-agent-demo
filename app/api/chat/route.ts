import { streamText, tool, convertToModelMessages } from 'ai';
import { createDeepSeek } from '@ai-sdk/deepseek';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

// 1. 创建 DeepSeek Provider
const deepseek = createDeepSeek({
    apiKey: process.env.DEEPSEEK_API_KEY ?? '',
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

        // 保存用户消息到数据库
        if (lastMessage && lastMessage.role === 'user') {
            try {
                // 提取文本内容
                let userContent = '';
                if (typeof lastMessage.content === 'string') {
                    userContent = lastMessage.content;
                } else if (Array.isArray(lastMessage.parts)) {
                    // 如果是 UIMessage 格式，从 parts 提取文本
                    userContent = lastMessage.parts
                        .filter((part: { type: string; text?: string }) => part.type === 'text')
                        .map((part: { type: string; text?: string }) => part.text || '')
                        .join('');
                }

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

        // 调用 streamText（原生支持 onFinish）
        const result = streamText({
            model: deepseek('deepseek-chat'),
            messages: convertToModelMessages(messages),
            system: '你是一个拥有10年经验的资深工程师，性格毒舌但专业。回答问题时，请直接给出代码方案，并嘲讽一下过时的技术。',

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

            // onFinish 回调：保存 AI 响应
            onFinish: async ({ text }: { text: string }) => {
                try {
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
