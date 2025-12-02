import { NextResponse } from 'next/server';
import { clearAllMessages } from '@/lib/services/message-service';

export async function DELETE() {
    try {
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
