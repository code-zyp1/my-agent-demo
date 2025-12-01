"use client"

import { useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Code, Briefcase, Mail, User, Send, Square } from "lucide-react"
import { PixelAvatar } from "./pixel-avatar"

// Message type compatible with useChat format
interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  parts?: Array<{ type: string; text: string }>
}

interface ChatScreenProps {
  messages: Message[]
  isTyping: boolean
  onQuickAction: (text: string) => void
  input: string
  setInput: (value: string) => void
  onSend: () => void
  onStop: () => void
}

const quickActions = [
  { label: "Skills", query: "Tell me about your skills", icon: Code },
  { label: "Experience", query: "What is your experience?", icon: Briefcase },
  { label: "Contact", query: "How can I contact you?", icon: Mail },
  { label: "About", query: "Tell me about yourself", icon: User },
]

export function ChatScreen({ messages, isTyping, onQuickAction, input, setInput, onSend, onStop }: ChatScreenProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  // Debug logging
  useEffect(() => {
    console.log('[ChatScreen] Received messages:', messages)
  }, [messages])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isTyping])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      onSend()
    }
  }

  return (
    <div className="flex flex-col h-full bg-[#f0f4f0] font-mono relative">
      {/* Scanlines effect - Reduced opacity to 0.05 */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.02)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] z-10 pointer-events-none bg-[length:100%_2px,3px_100%] opacity-50" />

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide relative z-0" ref={scrollRef}>
        <AnimatePresence initial={false}>
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-2 ${message.role === "user" ? "flex-row-reverse" : ""}`}
            >
              {message.role === "assistant" && <PixelAvatar size="md" />}
              <div
                className={`max-w-[75%] px-4 py-3 rounded-lg leading-6 pixel-text ${message.role === "user"
                  ? "bg-[#00b894] text-white"
                  : "bg-white text-gray-800 border-2 border-gray-300"
                  }`}
                style={{
                  boxShadow: message.role === "user" ? "3px 3px 0 rgba(0,100,80,0.3)" : "3px 3px 0 rgba(0,0,0,0.1)",
                  fontSize: "14px",
                }}
              >
                {(() => {
                  // Extract content from message - handle both formats
                  let content = ''

                  if (typeof message.content === 'string' && message.content.length > 0) {
                    content = message.content
                  } else if (message.parts && message.parts.length > 0) {
                    // Handle parts array (e.g. from initialMessages or some API responses)
                    content = message.parts
                      .filter(p => p.type === 'text')
                      .map(p => p.text)
                      .join('')
                  }

                  // Fallback if still empty (shouldn't happen for valid messages)
                  if (!content && typeof message.content === 'string') {
                    content = message.content
                  }

                  // 直接显示内容，移除 TypewriterText 以避免闪烁和历史消息打字机效果
                  // useChat 的流式传输本身就是打 typewriter effect
                  return content
                })()}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* 只有当正在输入且最后一条消息不是 assistant 时才显示加载动画 */}
        {isTyping && messages[messages.length - 1]?.role !== 'assistant' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-2 items-center"
          >
            <PixelAvatar size="md" isAnimating />
            <div
              className="bg-white border-2 border-gray-300 rounded-lg px-4 py-3 flex gap-1.5 items-center"
              style={{ boxShadow: "3px 3px 0 rgba(0,0,0,0.1)" }}
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2.5 h-2.5 bg-[#00b894] rounded-sm"
                  animate={{
                    y: [0, -6, 0],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 0.6,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-3 bg-[#e0e4e0] border-t-2 border-[#c0c4c0] relative z-20">
        {/* Quick Actions */}
        <div className="flex gap-2 mb-3 overflow-x-auto pb-1 scrollbar-hide">
          {quickActions.map((action) => (
            <button
              key={action.label}
              onClick={() => onQuickAction(action.query)}
              disabled={isTyping}
              className="flex items-center gap-1 px-2 py-1 bg-[#2d3436] text-white text-[9px] leading-none rounded hover:bg-[#00b894] transition-all whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed pixel-text active:translate-y-0.5"
              style={{ boxShadow: "0 1px 0 rgba(0,0,0,0.2)" }}
            >
              <action.icon size={9} />
              {action.label}
            </button>
          ))}
        </div>

        <div className="relative flex items-center gap-2">
          <div className="absolute left-3 text-gray-400 pixel-text text-lg">{">"}</div>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isTyping ? "AI is typing..." : "Type message..."}
            disabled={isTyping}
            className="w-full pl-8 pr-12 py-3 bg-white border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#00b894] focus:ring-2 focus:ring-[#00b894]/20 pixel-text text-xs text-gray-900 placeholder-gray-400 disabled:bg-gray-100"
            style={{
              boxShadow: "inset 2px 2px 4px rgba(0,0,0,0.05)",
              fontFamily: "var(--font-zpix), var(--font-vt323), monospace",
            }}
          />
          <button
            onClick={isTyping ? onStop : onSend}
            disabled={!isTyping && !input.trim()}
            className={`absolute right-2 p-1.5 rounded transition-colors flex items-center justify-center ${isTyping
              ? "bg-[#ff5555] text-white hover:bg-[#ff4444] shadow-[0_2px_0_#c0392b] active:shadow-none active:translate-y-[2px]"
              : "text-gray-400 hover:text-[#00b894]"
              } disabled:text-gray-300`}
            style={isTyping ? { height: '28px', width: '28px' } : {}}
          >
            {isTyping ? <Square size={12} fill="currentColor" /> : <Send size={18} />}
          </button>
        </div>
      </div>
    </div>
  )
}
