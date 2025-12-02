// scripts/seed.ts
// 种子数据注入脚本
import { createClient } from '@supabase/supabase-js';
import { createOpenAI } from '@ai-sdk/openai';
import { embedMany } from 'ai';
import dotenv from 'dotenv';

// 加载环境变量
dotenv.config({ path: '.env.local' });

// 简历数据（可以根据需要修改）
const myResume = [
    "姓名：测试名字，职位：高级前端工程师 (AI 方向)，经验：3年。",
    "技术栈：精通 React, Next.js, TypeScript, Tailwind CSS。",
    "AI 技能：熟悉 Vercel AI SDK, OpenAI API, Prompt Engineering。",
    "项目经验：开发过基于 RAG 的垂直领域问答助手，使用 Supabase 向量数据库。",
    "空窗期解释：最近 1.5 年我在进行全职的 AI 技术研究和独立开发，完成了从传统前端到 AI 全栈的转型。",
    "教育背景：本科学历，计算机科学与技术专业。",
    "个人优势：具备极强的工程化落地能力，能在 10 分钟内搭建商业级 AI 对话应用。",
];

export async function seed() {
    console.log("🌱 开始注入种子数据...");

    // 1. 初始化 Supabase
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // 2. 初始化智谱 AI
    const zhipu = createOpenAI({
        baseURL: 'https://open.bigmodel.cn/api/paas/v4',
        apiKey: process.env.ZHIPU_API_KEY!,
    });

    try {
        // 3. 批量计算向量
        console.log(`⏳ 正在计算 ${myResume.length} 条数据的向量...`);
        const { embeddings } = await embedMany({
            model: zhipu.embedding('embedding-3'),
            values: myResume,
        });

        console.log("✅ 向量计算完成");

        // 4. 构造插入数据
        const records = myResume.map((content, i) => ({
            content: content,
            embedding: embeddings[i],
        }));

        // 5. 插入到 documents 表
        const { error } = await supabase.from('documents').insert(records);

        if (error) {
            console.error("❌ 插入失败:", error);
            throw error;
        }

        console.log("🎉 种子数据注入成功！");
    } catch (err) {
        console.error("❌ 发生错误:", err);
        throw err;
    }
}

// 如果直接运行此文件，则执行 seed
if (require.main === module) {
    seed()
        .then(() => process.exit(0))
        .catch((err) => {
            console.error(err);
            process.exit(1);
        });
}
