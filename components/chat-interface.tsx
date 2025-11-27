
"use client"

import { useState } from "react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { Sidebar } from "@/components/sidebar"
import { ChatArea } from "@/components/chat-area"
import { ChatInput } from "@/components/chat-input"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"

export interface Conversation {
  id: string
  title: string
  // We won't store full messages here for now in this simple integration, 
  // or we could sync them. For now, we focus on the active chat session.
  // In a real app, you'd load these from a DB.
}

const initialConversations: Conversation[] = [
  { id: "1", title: "New Chat" },
]

export function ChatInterface() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations)
  const [activeConversation, setActiveConversation] = useState<string | null>("1")

  // Vercel AI SDK useChat hook
  const { messages, sendMessage, status, setMessages } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
    onError: (error: Error) => {
      console.error("Chat error:", error)
    },
  })

  const isLoading = status === "submitted" || status === "streaming"

  const handleNewChat = () => {
    // In a real app, this would create a new ID and clear the chat state
    const newId = Date.now().toString()
    const newConversation: Conversation = {
      id: newId,
      title: "New conversation",
    }
    setConversations([newConversation, ...conversations])
    setActiveConversation(newId)
    setMessages([]) // Clear current chat messages
  }

  const handleSelectConversation = (id: string) => {
    setActiveConversation(id)
    // In a real app, you would fetch the messages for this conversation here
    // For this demo, we just clear it if it's a different one, or keep it.
    // Since we don't have persistence, switching chats effectively clears the view 
    // unless we store it in local state.
    // For simplicity in this step:
    if (id !== activeConversation) {
      setMessages([])
    }
  }

  const handleDeleteConversation = (id: string) => {
    setConversations(conversations.filter((c) => c.id !== id))
    if (activeConversation === id) {
      setActiveConversation(null)
      setMessages([])
    }
  }

  const handleSendMessage = async (content: string) => {
    await sendMessage({ text: content })
  }

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Sidebar */}
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        conversations={conversations.map(c => ({ ...c, messages: [] }))} // Adapter for existing sidebar prop type if needed
        activeConversation={activeConversation}
        onNewChat={handleNewChat}
        onSelectConversation={handleSelectConversation}
        onDeleteConversation={handleDeleteConversation}
      />

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <header className="flex h-14 items-center gap-3 border-b border-border px-4">
          {!sidebarOpen && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(true)}
              className="text-muted-foreground hover:text-foreground"
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}
          <h1 className="text-lg font-semibold">AI Assistant</h1>
        </header>

        {/* Chat Area */}
        <ChatArea messages={messages} />

        {/* Input Area */}
        <ChatInput
          onSend={handleSendMessage}
          isLoading={isLoading}
        />
      </div>
    </div>
  )
}
