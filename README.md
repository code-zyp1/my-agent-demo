# AI Chat Assistant with RAG

基于 Next.js 构建的智能聊天助手，集成 RAG（检索增强生成）和 Function Calling 功能。

## 技术栈

- Next.js 15 (App Router)
- Vercel AI SDK
- Supabase (PostgreSQL + pgvector)
- shadcn/ui + Tailwind CSS

## 项目结构

```
├── app/
│   ├── api/chat/
│   │   ├── route.ts          # 聊天 API (RAG + Function Calling)
│   │   └── clear/route.ts    # 清空对话 API
│   └── page.tsx              # 主页面
├── components/
│   ├── chat-interface.tsx    # 聊天界面
│   ├── chat-area.tsx         # 消息显示
│   ├── chat-input.tsx        # 输入框
│   └── sidebar.tsx           # 侧边栏
```

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

创建 `.env.local` 文件：



## 主要功能

- RAG 检索增强生成（基于 Supabase 向量搜索）
- 多步 Function Calling（使用 `stopWhen(stepCountIs(5))`）
- 对话历史持久化
- 实时流式响应
