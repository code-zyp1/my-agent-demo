import { Experimental_Agent as Agent, tool, stepCountIs } from 'ai';
import { createDeepSeek } from '@ai-sdk/deepseek';
import { z } from 'zod';

// 1. 创建 DeepSeek Provider
const deepseek = createDeepSeek({
  apiKey: process.env.DEEPSEEK_API_KEY ?? '',
});

// 2. 创建 Agent 实例
const myAgent = new Agent({
  model: deepseek('deepseek-chat'),
  system: '你是一个拥有10年经验的资深工程师，性格毒舌但专业。回答问题时，请直接给出代码方案，并嘲讽一下过时的技术。',

  // 循环控制：允许多步工具调用
  stopWhen: stepCountIs(20),

  // 工具定义
  tools: {
    getWeather: tool({
      description: 'Get the current weather for a specific city',
      inputSchema: z.object({
        city: z.string().describe('The name of the city to get weather for'),
      }),
      execute: async ({ city }) => {
        // 模拟天气数据
        console.log(`[Tool Call] Getting weather for: ${city}`);

        // 根据城市返回不同的天气
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
});

// 允许最长 30 秒的响应时间
export const maxDuration = 30;

// 3. API 路由处理
export async function POST(request: Request) {
  try {
    const { messages } = await request.json();

    // 使用 Agent 的 respond() 方法
    return myAgent.respond({
      messages,
    });

  } catch (error) {
    console.error('API Error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}