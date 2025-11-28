"use client"

import { useRef, useEffect } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { Bot, User } from "lucide-react"
import type { UIMessage } from "ai"
import ReactMarkdown from 'react-markdown'

interface ChatAreaProps {
  messages: UIMessage[]
}

export function ChatArea({ messages }: ChatAreaProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  if (messages.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center px-4 text-center overflow-auto">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <Bot className="h-8 w-8 text-muted-foreground" />
        </div>
        <h2 className="mb-2 text-2xl font-semibold">How can I help you today?</h2>
        <p className="max-w-md text-muted-foreground">
          Start a conversation by typing a message below. I'm here to assist with questions, ideas, or anything else
          you'd like to discuss.
        </p>
      </div>
    )
  }

  return (
    <ScrollArea className="flex-1 min-h-0">
      <div className="mx-auto max-w-3xl px-4 py-6">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn("mb-6 flex gap-4", message.role === "user" ? "justify-end" : "justify-start")}
          >
            {message.role === "assistant" && (
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
                <Bot className="h-5 w-5 text-muted-foreground" />
              </div>
            )}
            <div
              className={cn(
                "rounded-2xl px-4 py-3 text-sm leading-relaxed",
                message.role === "user"
                  ? "bg-primary text-primary-foreground max-w-[80%]"
                  : "bg-muted text-foreground max-w-[85%]",
              )}
            >
              {message.parts.map((part, index) => {
                if (part.type === 'text') {
                  if (message.role === 'user') {
                    return <span key={index}>{part.text}</span>
                  }
                  // AI messages with markdown + custom code block styling
                  return (
                    <article key={index} className="prose prose-sm dark:prose-invert break-words max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
                      <ReactMarkdown
                        components={{
                          p({ children }: any) {
                            return <div className="mb-2">{children}</div>
                          },
                          code({ inline, className, children, ...props }: any) {
                            const match = /language-(\w+)/.exec(className || '')
                            return !inline ? (
                              <div className="relative my-4 rounded-lg bg-zinc-900 overflow-hidden">
                                {match && (
                                  <div className="px-4 py-2 text-xs text-zinc-400 bg-zinc-800 border-b border-zinc-700">
                                    {match[1]}
                                  </div>
                                )}
                                <pre className="p-4 overflow-x-auto">
                                  <code className={cn("text-sm text-zinc-100", className)}>
                                    {children}
                                  </code>
                                </pre>
                              </div>
                            ) : (
                              <code className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-100 text-xs" {...props}>
                                {children}
                              </code>
                            )
                          },
                          pre({ children }: any) {
                            return <>{children}</>
                          }
                        }}
                      >
                        {part.text}
                      </ReactMarkdown>
                    </article>
                  )
                }

                if (part.type === 'tool-invocation') {
                  const toolInvocation = part.toolInvocation
                  return (
                    <div key={index} className="my-2 p-2 rounded bg-muted/50 text-xs font-mono border border-border">
                      <div className="flex items-center gap-2 text-muted-foreground mb-1">
                        <span className="w-3 h-3">🔧</span>
                        <span>Calling: {toolInvocation.toolName}</span>
                      </div>
                      <div className="overflow-x-auto whitespace-pre-wrap text-muted-foreground/80">
                        {JSON.stringify(toolInvocation.args, null, 2)}
                      </div>
                      {'result' in toolInvocation && (
                        <div className="mt-2 pt-2 border-t border-border/50">
                          <div className="text-green-600/80 dark:text-green-400/80 mb-1">Result:</div>
                          <div className="overflow-x-auto whitespace-pre-wrap text-muted-foreground/80">
                            {JSON.stringify(toolInvocation.result, null, 2)}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                }

                return null
              })}
            </div>
            {message.role === "user" && (
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary">
                <User className="h-5 w-5 text-primary-foreground" />
              </div>
            )}
          </div>
        ))}
        <div ref={scrollRef} />
      </div>
    </ScrollArea>
  )
}
