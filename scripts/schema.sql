-- ============================================
-- 数据库初始化脚本
-- ============================================

-- 启用 pgvector 扩展（用于向量搜索）
CREATE EXTENSION IF NOT EXISTS vector;

-- ============================================
-- 清理所有现有表（重建模式）
-- ============================================
-- 注意：这会删除 public schema 下的所有表，包括遗留的废弃表
-- 如果需要保留某些表，请不要使用 rebuild，而是手动修改表结构
DROP SCHEMA IF EXISTS public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;

-- 重新启用 pgvector（因为 schema 被重建了）
CREATE EXTENSION IF NOT EXISTS vector;

-- ============================================
-- 1. documents 表（存储 RAG 知识库）
-- ============================================

CREATE TABLE documents (
    id BIGSERIAL PRIMARY KEY,
    content TEXT NOT NULL,                      -- 文档内容
    embedding vector(2048),                     -- 向量 (智谱 embedding-3 是 2048 维)
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 注意：由于智谱 AI embedding-3 的向量维度是 2048，
-- 超过了 pgvector 索引的 2000 维限制，因此暂不创建索引。
-- 对于小数据量（<10万条），线性扫描的性能已经足够。
-- 如需索引，可以考虑：
--   1. 换用 OpenAI 的 1536 维模型
--   2. 升级 pgvector 到支持更高维度的版本

-- ============================================
-- 2. messages 表（存储聊天记录）
-- ============================================

CREATE TABLE messages (
    id BIGSERIAL PRIMARY KEY,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant')), -- 角色限制
    content TEXT NOT NULL,                                     -- 消息内容
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 3. match_documents 函数（向量相似度搜索）
-- ============================================
CREATE OR REPLACE FUNCTION match_documents(
    query_embedding vector(2048),
    match_threshold float DEFAULT 0,
    match_count int DEFAULT 5
)
RETURNS TABLE (
    id bigint,
    content text,
    similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        documents.id,
        documents.content,
        1 - (documents.embedding <=> query_embedding) AS similarity
    FROM documents
    WHERE 1 - (documents.embedding <=> query_embedding) > match_threshold
    ORDER BY documents.embedding <=> query_embedding
    LIMIT match_count;
END;
$$;

-- ============================================
-- 4. 权限配置
-- ============================================
-- 授予所有表的完整权限给 postgres 和 anon 角色
-- 这样 Supabase 客户端（使用 anon key）才能操作表
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO postgres, anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres, anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO postgres, anon, authenticated;

-- 授予现有表的权限
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO postgres, anon, authenticated;
