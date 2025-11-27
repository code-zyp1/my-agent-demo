import { createDeepSeek } from '@ai-sdk/deepseek';
import { streamText, convertToModelMessages } from 'ai';

// 1. 显式创建 DeepSeek Provider 实例
// 这样你可以明确看到 API Key 是如何传入的，而不是依赖隐式环境变量
const deepseek = createDeepSeek({
  apiKey: process.env.DEEPSEEK_API_KEY ?? '', 
});

// 允许最长 30 秒的响应时间
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    // 获取前端传来的 JSON 数据
    const { messages } = await req.json();

    // 2. 调用模型
    const result = streamText({
      model: deepseek('deepseek-chat'), // 如果想用 R1，改成 'deepseek-reasoner'
      messages: convertToModelMessages(messages), // 必选：将 UI 消息转换为核心模型消息
    });

    // 3. 返回 UI 消息流响应 (官方最新推荐写法)
    // 这将返回 'application/x-vercel-ai-data-stream' 格式的数据
    return result.toUIMessageStreamResponse();

  } catch (error) {
    console.error('API Error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}