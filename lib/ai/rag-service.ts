import { embed } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { supabase } from '@/lib/supabase';

// 初始化智谱 AI Provider (用于生成 Embedding)
const zhipu = createOpenAI({
    apiKey: process.env.ZHIPU_API_KEY ?? '',
    baseURL: 'https://open.bigmodel.cn/api/paas/v4',
});

// 获取 RAG 上下文
// query: 用户的问题
export async function getContext(query: string): Promise<string> {
    if (!query) return '';

    try {
        // 1. 为用户问题生成 Embedding 向量
        const { embedding } = await embed({
            model: zhipu.embedding('embedding-3'),
            value: query,
        });

        console.log('[RAG] Generated embedding for user query');

        // 2. 在 Supabase 中搜索相似文档
        const { data: documents, error: searchError } = await supabase.rpc('match_documents', {
            query_embedding: embedding,
            match_threshold: 0, // 匹配阈值
            match_count: 5,     // 返回数量
        });

        if (searchError) {
            console.error('[RAG] Vector search error:', searchError);
            return '';
        }

        if (documents && documents.length > 0) {
            console.log(`[RAG] Found ${documents.length} relevant documents`);

            // 3. 格式化文档内容作为上下文
            const contextInfo = documents
                .map((doc: any) => doc.content)
                .filter((content: string) => content && content.trim())
                .join('\n\n');

            console.log('[RAG] Final contextInfo length:', contextInfo.length);
            return contextInfo;
        } else {
            console.log('[RAG] No relevant documents found');
            return '';
        }
    } catch (err) {
        console.error('[RAG] Error during retrieval:', err);
        return '';
    }
}
