import { supabase } from '../supabase';

export interface Message {
    id: number;
    role: 'user' | 'assistant';
    content: string;
    created_at: string;
}

// 获取最近的消息历史记录
// limit: 限制返回的消息数量，默认为 5 条
export async function getMessageHistory(limit: number = 5) {
    const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false }) // 按创建时间倒序排列
        .limit(limit);

    if (error) {
        console.error('Failed to fetch message history:', error);
        return [];
    }

    return data?.reverse() || [];
}

// 保存消息到数据库
// role: 消息发送者角色 ('user' 或 'assistant')
// content: 消息内容
export async function saveMessage(role: 'user' | 'assistant', content: string) {
    const { error } = await supabase
        .from('messages')
        .insert({
            role,
            content,
            created_at: new Date().toISOString(),
        });

    if (error) {
        console.error(`Failed to save ${role} message:`, error);
        throw error;
    }
}

// 清空所有消息
// 注意：这里使用了 .neq('id', 0) 技巧来绕过 Supabase 可能存在的全表删除保护
export async function clearAllMessages() {
    // Using .neq('id', 0) to bypass Supabase delete protection if needed,
    // or simply delete all rows if the policy allows.
    const { error } = await supabase
        .from('messages')
        .delete()
        .neq('id', 0);

    if (error) {
        console.error('Failed to clear messages:', error);
        throw error;
    }
}
