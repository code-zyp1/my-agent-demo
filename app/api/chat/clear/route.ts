import { NextResponse } from 'next/server';
import { clearAllMessages } from '@/lib/services/message-service';

export async function DELETE() {
    try {
        // 调用服务层清空所有消息
        await clearAllMessages();
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
