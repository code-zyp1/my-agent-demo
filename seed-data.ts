// 运行命令: npx tsx seed-data.ts
import { createClient } from '@supabase/supabase-js';
import { createOpenAI } from '@ai-sdk/openai';
import { embedMany } from 'ai';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

// 1. 你的简历数据 (切分成小段，每段是一个知识点)
// 🟢 请在这里填入你真实的简历信息，越详细越好
const myResume = [
    "姓名：张三，职位：高级前端工程师 (AI 方向)，经验：3年。",
    "技术栈：精通 React, Next.js, TypeScript, Tailwind CSS。",
    "AI 技能：熟悉 Vercel AI SDK, OpenAI API, Prompt Engineering。",
    "项目经验：开发过基于 RAG 的垂直领域问答助手，使用 Supabase 向量数据库。",
    "空窗期解释：最近 1.5 年我在进行全职的 AI 技术研究和独立开发，完成了从传统前端到 AI 全栈的转型。",
    "教育背景：本科学历，计算机科学与技术专业。",
    "个人优势：具备极强的工程化落地能力，能在 10 分钟内搭建商业级 AI 对话应用。",
];

async function seed() {
    console.log("🌱 开始注入简历数据...");

    // 初始化 Supabase
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // 初始化智谱 AI
    const zhipu = createOpenAI({
        baseURL: 'https://open.bigmodel.cn/api/paas/v4',
        apiKey: process.env.ZHIPU_API_KEY,
    });

    try {
        // 1. 将文本批量转换为向量 (2048维)
        console.log(`⏳ 正在计算 ${myResume.length} 条数据的向量...`);
        const { embeddings } = await embedMany({
            model: zhipu.embedding('embedding-3'),
            values: myResume,
        });

        console.log("✅ 向量计算完成，准备存入数据库...");

        // 2. 构造插入数据
        const records = myResume.map((content, i) => ({
            content: content,
            embedding: embeddings[i],
        }));

        // 3. 存入 Supabase
        const { error } = await supabase.from('documents').insert(records);

        if (error) {
            console.error("❌ 插入失败:", error);
        } else {
            console.log("🎉 简历数据注入成功！数据库里现在有知识了。");
        }

    } catch (err) {
        console.error("❌ 发生错误:", err);
    }
}

seed();