// scripts/test-connection.ts
// 测试数据库连接（增强版，支持 SSL 诊断）
import postgres from 'postgres';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function testConnection() {
    console.log("🔍 开始测试数据库连接...\n");

    if (!process.env.DATABASE_URL) {
        console.error("❌ 错误：未找到 DATABASE_URL 环境变量！");
        process.exit(1);
    }

    console.log("✅ 找到 DATABASE_URL");
    console.log(`📝 连接字符串: ${process.env.DATABASE_URL.replace(/:[^:@]+@/, ':****@')}\n`);

    // 尝试不同的 SSL 配置
    const sslConfigs = [
        { name: "SSL (require)", ssl: 'require' },
        { name: "SSL (prefer)", ssl: 'prefer' },
        { name: "SSL (自定义)", ssl: { rejectUnauthorized: false } },
    ];

    for (const config of sslConfigs) {
        console.log(`⏳ 尝试方式：${config.name}...`);

        try {
            const sql = postgres(process.env.DATABASE_URL!, {
                ssl: config.ssl as any,
                max: 1,
                connect_timeout: 10,
            });

            const result = await sql`SELECT version()`;

            console.log(`✅ 连接成功！（使用 ${config.name}）`);
            console.log(`📊 PostgreSQL 版本: ${result[0].version}\n`);

            const tables = await sql`
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = 'public'
                ORDER BY table_name
            `;

            if (tables.length > 0) {
                console.log("📋 现有的表：");
                tables.forEach((table: any) => console.log(`   - ${table.table_name}`));
            } else {
                console.log("📋 数据库中暂无表（运行 db:setup 即可创建）");
            }

            await sql.end();
            console.log("\n✅ 测试完成！");

            if (config.name !== "SSL (require)") {
                console.log(`\n💡 提示：请修改 db-manager.ts 第 20 行，改为：`);
                console.log(`   ssl: ${JSON.stringify(config.ssl)},`);
            }

            process.exit(0);

        } catch (error: any) {
            console.error(`❌ ${config.name} 失败: ${error.message}\n`);
        }
    }

    console.error("❌ 所有连接方式均失败！");
    console.log("\n可能的原因：");
    console.log("1. 密码错误");
    console.log("2. 网络/防火墙问题");
    console.log("3. Supabase 项目暂停");
    process.exit(1);
}

testConnection();
