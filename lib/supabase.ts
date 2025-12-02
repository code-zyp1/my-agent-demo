import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// 创建 Supabase 客户端单例
// 使用环境变量中的 URL 和匿名 Key 进行初始化
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
