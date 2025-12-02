# AI Agent Demo (Pixel Art Edition)

基于 Next.js 构建的智能聊天助手，集成 RAG（检索增强生成）、Function Calling 功能，并采用独特的**像素艺术（Pixel Art）**风格 UI。

## ✨ 特性

-   **🎨 像素艺术 UI**: 复古掌机风格界面，定制像素字体（Zpix），CRT 扫描线效果，以及像素风格的头像和图标。
-   **🧠 智能对话**: 集成 Vercel AI SDK，支持流式响应和多轮对话。
-   **📚 RAG 检索增强**: 基于 Supabase pgvector 实现知识库检索，让 AI 回答更准确。
-   **🛠️ Function Calling**: 支持多步工具调用（如查询天气、数据库操作等）。
-   **💾 数据库管理自动化**: 内置脚本用于数据库的初始化、重置和数据填充。

## 🛠️ 技术栈

-   **Framework**: Next.js 15 (App Router)
-   **AI SDK**: Vercel AI SDK
-   **Database**: Supabase (PostgreSQL + pgvector)
-   **UI**: Tailwind CSS + Framer Motion + shadcn/ui
-   **Fonts**: Zpix (像素字体), Geist, Press Start 2P

## 📂 项目结构

```
├── app/                  # Next.js 应用路由
├── components/           # UI 组件
│   ├── chat/             # 聊天相关组件 (PixelAvatar, etc.)
│   ├── modals/           # 模态框 (ProfileModal, etc.)
│   └── ui/               # 基础 UI 组件
├── lib/                  # 核心逻辑
│   ├── ai/               # AI 相关 (RAG, Tools, Prompts)
│   └── services/         # 业务服务
├── scripts/              # 数据库管理脚本
│   ├── db-manager.ts     # 数据库操作核心逻辑
│   ├── seed.ts           # 数据填充脚本
│   └── schema.sql        # 数据库 Schema
└── public/               # 静态资源 (字体, 图片)
```

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

复制 `.env.example` (如果存在) 或创建 `.env.local` 并填入以下内容：

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# AI Provider (e.g., OpenAI, DeepSeek)
OPENAI_API_KEY=your_api_key
```

### 3. 初始化数据库

本项目包含自动化的数据库管理脚本。

**首次设置 (重置数据库并填充数据):**

```bash
npm run db:setup
```

**仅重建 Schema (保留数据):**

```bash
npm run db:rebuild
```

**仅填充数据:**

```bash
npm run db:seed
```

### 4. 启动开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看效果。



## 📝 License

MIT
