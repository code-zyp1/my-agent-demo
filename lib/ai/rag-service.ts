import { embed } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { supabase } from '@/lib/supabase';

// Initialize Zhipu AI Provider (used for Embedding)
const zhipu = createOpenAI({
    apiKey: process.env.ZHIPU_API_KEY ?? '',
    baseURL: 'https://open.bigmodel.cn/api/paas/v4',
});

export async function getContext(query: string): Promise<string> {
    if (!query) return '';

    try {
        // 1. Generate embedding for the user query
        const { embedding } = await embed({
            model: zhipu.embedding('embedding-3'),
            value: query,
        });

        console.log('[RAG] Generated embedding for user query');

        // 2. Search for similar documents in Supabase
        const { data: documents, error: searchError } = await supabase.rpc('match_documents', {
            query_embedding: embedding,
            match_threshold: 0,
            match_count: 5,
        });

        if (searchError) {
            console.error('[RAG] Vector search error:', searchError);
            return '';
        }

        if (documents && documents.length > 0) {
            console.log(`[RAG] Found ${documents.length} relevant documents`);

            // 3. Format context from documents
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
