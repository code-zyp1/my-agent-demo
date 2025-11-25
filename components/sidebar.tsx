"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { PanelLeftClose, Plus, MessageSquare, Trash2 } from "lucide-react"
import type { Conversation } from "@/components/chat-interface"

interface SidebarProps {
  open: boolean
  onClose: () => void
  conversations: Conversation[]
  activeConversation: string | null
  onNewChat: () => void
  onSelectConversation: (id: string) => void
  onDeleteConversation: (id: string) => void
}

export function Sidebar({
  open,
  onClose,
  conversations,
  activeConversation,
  onNewChat,
  onSelectConversation,
  onDeleteConversation,
}: SidebarProps) {
  return (
    <aside
      className={cn(
        "flex h-full flex-col border-r border-border bg-sidebar transition-all duration-300",
        open ? "w-64" : "w-0 overflow-hidden",
      )}
    >
      {/* Sidebar Header */}
      <div className="flex h-14 items-center justify-between px-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="text-sidebar-foreground hover:bg-sidebar-accent"
        >
          <PanelLeftClose className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onNewChat}
          className="text-sidebar-foreground hover:bg-sidebar-accent"
        >
          <Plus className="h-5 w-5" />
        </Button>
      </div>

      {/* New Chat Button */}
      <div className="px-3 pb-2">
        <Button
          variant="outline"
          className="w-full justify-start gap-2 border-sidebar-border bg-sidebar-accent text-sidebar-foreground hover:bg-sidebar-accent/80"
          onClick={onNewChat}
        >
          <Plus className="h-4 w-4" />
          New chat
        </Button>
      </div>

      {/* Conversation List */}
      <ScrollArea className="flex-1 px-3">
        <div className="space-y-1 pb-4">
          {conversations.map((conversation) => (
            <div
              key={conversation.id}
              className={cn(
                "group flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors cursor-pointer",
                activeConversation === conversation.id
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50",
              )}
              onClick={() => onSelectConversation(conversation.id)}
            >
              <div className="flex items-center gap-2 truncate">
                <MessageSquare className="h-4 w-4 shrink-0" />
                <span className="truncate">{conversation.title}</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive-foreground"
                onClick={(e) => {
                  e.stopPropagation()
                  onDeleteConversation(conversation.id)
                }}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Sidebar Footer */}
      <div className="border-t border-sidebar-border p-3">
        <div className="flex items-center gap-3 rounded-lg px-2 py-2 text-sm text-sidebar-foreground">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sidebar-accent text-sidebar-accent-foreground">
            U
          </div>
          <span className="truncate">User</span>
        </div>
      </div>
    </aside>
  )
}
