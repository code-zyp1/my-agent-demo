import { supabase } from '../supabase';

export interface Message {
    id: number;
    role: 'user' | 'assistant';
    content: string;
    created_at: string;
}

export async function getMessageHistory(limit: number = 5) {
    const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

    if (error) {
        console.error('Failed to fetch message history:', error);
        return [];
    }

    return data?.reverse() || [];
}

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
