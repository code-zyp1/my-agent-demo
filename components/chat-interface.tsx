"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { ChatArea } from "@/components/chat-area"
import { ChatInput } from "@/components/chat-input"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"

export interface Message {
  id: string
  role: "user" | "assistant"
  content: string
}

export interface Conversation {
  id: string
  title: string
  messages: Message[]
}

const initialConversations: Conversation[] = [
  { id: "1", title: "Getting started with React", messages: [] },
  { id: "2", title: "Building a REST API", messages: [] },
  { id: "3", title: "Understanding TypeScript", messages: [] },
]

export function ChatInterface() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations)
  const [activeConversation, setActiveConversation] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])

  const handleNewChat = () => {
    const newConversation: Conversation = {
      id: Date.now().toString(),
      title: "New conversation",
      messages: [],
    }
    setConversations([newConversation, ...conversations])
    setActiveConversation(newConversation.id)
    setMessages([])
  }

  const handleSelectConversation = (id: string) => {
    setActiveConversation(id)
    const conversation = conversations.find((c) => c.id === id)
    setMessages(conversation?.messages || [])
  }

  const handleSendMessage = (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
    }

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content:
        "This is a demo response. In a real application, this would be connected to an AI backend to generate meaningful responses based on your input.",
    }

    setMessages([...messages, userMessage, assistantMessage])
  }

  const handleDeleteConversation = (id: string) => {
    setConversations(conversations.filter((c) => c.id !== id))
    if (activeConversation === id) {
      setActiveConversation(null)
      setMessages([])
    }
  }

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Sidebar */}
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        conversations={conversations}
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
        <ChatInput onSend={handleSendMessage} />
      </div>
    </div>
  )
}
