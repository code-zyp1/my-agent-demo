// 运行命令: npx tsx test-embed.ts
import { createOpenAI } from '@ai-sdk/openai';
import { embed } from 'ai';
import dotenv from 'dotenv';

// 1. 强制加载环境变量
dotenv.config({ path: '.env.local' });

async function test() {
    console.log("🔍 正在诊断 API Key...");

    // 调试信息：看看读到了什么 Key
    const zhipuKey = process.env.ZHIPU_API_KEY;

    if (zhipuKey) {
        console.log(`✅ 成功读取 ZHIPU_API_KEY: ${zhipuKey.substring(0, 5)}...`);
    } else {
        console.error("❌ 致命错误：.env.local 里没有找到 ZHIPU_API_KEY！");
        console.log("当前环境变量里只有这些 Key:", Object.keys(process.env).filter(k => k.endsWith('_KEY')));
        return; // 没 Key 就别往下跑了
    }

    // 2. 配置智谱 AI
    const zhipu = createOpenAI({
        baseURL: 'https://open.bigmodel.cn/api/paas/v4',
        apiKey: zhipuKey,
        // 智谱有时候需要这个兼容头
        // compatibility: 'compatible',
    });

    try {
        console.log("🚀 正在发送测试请求给智谱...");

        // 3. 调用 embedding-3
        const { embedding } = await embed({
            model: zhipu.embedding('embedding-3'),
            value: '测试文本',
        });

        console.log("✅ 调用成功！");
        console.log(`📊 你的向量维度是: 【 ${embedding.length} 】`);

        // 4. 给出数据库修改建议
        if (embedding.length === 1536) {
            console.log("🎉 维度是 1536，Supabase 不用动！");
        } else {
            console.log(`⚠️ 维度是 ${embedding.length}。`);
            console.log("🛠️ 请去 Supabase SQL Editor 运行下面这行代码来修改表结构：");
            console.log(`\nALTER TABLE documents ALTER COLUMN embedding TYPE vector(${embedding.length});\n`);
            console.log("⚠️ 同时，你也需要重新运行 match_documents 函数的创建 SQL，把里面的 1536 也改成 " + embedding.length);
        }

    } catch (error) {
        console.error("❌ 调用失败:", error);
    }
}

test();