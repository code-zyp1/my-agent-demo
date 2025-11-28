import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''
);

export async function DELETE() {
    try {
        // 使用 .neq('id', 0) 技巧来绕过 Supabase 的删除保护
        const { error } = await supabase
            .from('messages')
            .delete()
            .neq('id', 0);

        if (error) {
            console.error('Failed to clear messages:', error);
            return NextResponse.json(
                { error: 'Failed to clear messages' },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
