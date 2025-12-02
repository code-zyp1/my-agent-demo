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
│   ├── api/chat/             # API 路由层 (仅处理请求流程)
│   │   ├── route.ts          # 聊天主入口
│   │   └── clear/route.ts    # 清空对话入口
│   └── page.tsx              # 主页面
├── lib/                      # 核心逻辑层
│   ├── ai/                   # AI 相关逻辑
│   │   ├── prompts.ts        # System Prompt 管理
│   │   ├── rag-service.ts    # RAG 检索服务 (Embedding + Search)
│   │   └── tools.ts          # Function Calling 工具定义
│   ├── services/             # 业务服务层
│   │   └── message-service.ts # 数据库交互 (CRUD)
│   └── supabase.ts           # Supabase 客户端单例
├── components/               # UI 组件层
│   ├── chat-interface.tsx    # 聊天主界面
│   ├── chat-area.tsx         # 消息列表
│   ├── chat-input.tsx        # 输入区域
│   └── sidebar.tsx           # 侧边栏
```

## 架构说明

本项目采用了分层架构设计，以提高代码的可维护性和可扩展性：

1.  **API Layer (`app/api`)**: 负责处理 HTTP 请求，流程控制，以及连接 AI SDK 和业务服务。不包含具体的业务逻辑或数据库操作。
2.  **Service Layer (`lib/services`)**: 封装具体的业务逻辑和数据库交互（如消息的增删改查）。
3.  **AI Layer (`lib/ai`)**: 封装 AI 相关的核心逻辑，包括 RAG 检索流程、工具定义和提示词管理。
4.  **UI Layer (`components`)**: 负责前端展示和交互。

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
