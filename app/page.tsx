import { HandheldConsole } from "@/components/console/handheld-console"
import { IsometricBackground } from "@/components/console/isometric-background"
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
    console.error('Failed to load messages:', {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    })
    // 即使加载失败，也返回空数组，不阻塞页面渲染
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
    <div className="dark h-screen w-full overflow-hidden flex items-center justify-center">
      <IsometricBackground />
      <div className="relative z-10">
        <HandheldConsole initialMessages={initialMessages} />
      </div>
    </div>
  )
}
