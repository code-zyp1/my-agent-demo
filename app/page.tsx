import { ChatInterface } from "@/components/chat-interface"
import { createClient } from '@supabase/supabase-js'

// 初始化 Supabase 客户端
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''
)

export default async function Home() {
  // 查询历史消息，按时间升序排序
  const { data: messages, error } = await supabase
    .from('messages')
    .select('id, role, content, created_at')
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Failed to load messages:', error)
  }

  // 将 Supabase 数据映射成 UIMessage 格式
  const initialMessages = messages?.map((msg) => ({
    id: msg.id,
    role: msg.role as 'user' | 'assistant',
    parts: [
      {
        type: 'text' as const,
        text: msg.content,
      }
    ],
  })) || []

  return (
    <div className="dark h-screen w-full overflow-hidden">
      <ChatInterface initialMessages={initialMessages} />
    </div>
  )
}
