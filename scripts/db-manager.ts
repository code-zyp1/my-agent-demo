// scripts/db-manager.ts
// 数据库管理脚本（使用 postgres 库实现完全自动化）
import postgres from 'postgres';
import { readFileSync } from 'fs';
import { join } from 'path';
import dotenv from 'dotenv';
import { seed } from './seed';

// 加载环境变量
dotenv.config({ path: '.env.local' });

// PostgreSQL 直连客户端（用于所有数据库操作）
const sql = postgres(process.env.DATABASE_URL!, {
    ssl: 'require', // Supabase 需要 SSL
});

/**
 * 执行 schema.sql（自动建表）
 */
async function executeSchema() {
    console.log("📄 读取 schema.sql...");
    const schemaPath = join(__dirname, 'schema.sql');
    const schema = readFileSync(schemaPath, 'utf-8');

    console.log("⚙️ 执行数据库初始化脚本...");

    try {
        // 使用 postgres 库执行原始 SQL
        await sql.unsafe(schema);
        console.log("✅ 数据库表结构创建成功！");
    } catch (error) {
        console.error("❌ 执行 schema.sql 失败:", error);
        throw error;
    }
}

/**
 * 清空所有表数据（使用 postgres 客户端）
 */
async function clearData() {
    console.log("🗑️ 清空表数据...");

    try {
        // 使用 TRUNCATE 命令清空表（比 DELETE 更快且重置序列）
        await sql`TRUNCATE TABLE messages RESTART IDENTITY CASCADE`;
        console.log("✅ messages 表已清空");

        await sql`TRUNCATE TABLE documents RESTART IDENTITY CASCADE`;
        console.log("✅ documents 表已清空");
    } catch (error) {
        console.error("❌ 清空数据失败:", error);
        throw error;
    }
}

/**
 * 主函数
 */
async function main() {
    const command = process.argv[2];

    // 检查 DATABASE_URL
    if (!process.env.DATABASE_URL) {
        console.error("❌ 错误：未找到 DATABASE_URL 环境变量！");
        console.log("请在 .env.local 中添加：");
        console.log("DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@[HOST]:[PORT]/postgres");
        console.log("\n您可以在 Supabase Dashboard → Project Settings → Database → Connection String 中找到");
        process.exit(1);
    }

    try {
        switch (command) {
            case 'setup':
                console.log("🚀 数据库完整初始化（建表 + 种子数据）...");
                await executeSchema();
                await seed();
                console.log("✅ 数据库初始化完成！");
                break;

            case 'rebuild':
                console.log("🔄 重建数据库（删表 + 建表 + 种子数据）...");
                console.log("⚠️ 警告：此操作将删除所有表和数据！");
                await executeSchema(); // schema.sql 中已包含 DROP TABLE
                await seed();
                console.log("✅ 数据库重建完成！");
                break;

            case 'reset':
                console.log("🔄 重置数据（仅清空数据，不改表结构）...");
                await clearData();
                console.log("✅ 数据已清空，表结构保留");
                break;

            case 'seed':
                console.log("🌱 注入种子数据...");
                await seed();
                console.log("✅ 种子数据注入完成！");
                break;

            case 'clear':
                console.log("🗑️ 清空所有数据...");
                await clearData();
                console.log("✅ 数据清空完成！");
                break;

            default:
                console.log("数据库管理命令：");
                console.log("  npm run db:setup    - 🚀 首次初始化（建表 + 种子数据）");
                console.log("  npm run db:rebuild  - 🔄 完全重建（删表 + 建表 + 种子数据）");
                console.log("  npm run db:reset    - 🗑️ 重置数据（清空数据，保留表结构）");
                console.log("  npm run db:seed     - 🌱 注入种子数据");
                console.log("  npm run db:clear    - 🗑️ 清空所有数据");
                process.exit(1);
        }
    } catch (error) {
        console.error("❌ 执行失败:", error);
        process.exit(1);
    } finally {
        // 关闭数据库连接
        await sql.end();
    }
}

main();
