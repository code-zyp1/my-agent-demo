"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Battery, Wifi } from "lucide-react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { ChatScreen } from "@/components/chat/chat-screen"
import { DPad } from "./d-pad"
import { ConsoleButton } from "./console-button"
import { ProfileModal } from "@/components/modals/profile-modal"

import { ConfirmModal } from "@/components/modals/confirm-modal"

export interface Message {
    id: string
    role: "user" | "assistant"
    content: string
}

interface HandheldConsoleProps {
    initialMessages?: Array<{
        id: string
        role: 'user' | 'assistant'
        parts: Array<{ type: 'text'; text: string }>
    }>
}

export function HandheldConsole({ initialMessages = [] }: HandheldConsoleProps) {
    const [input, setInput] = useState("")
    const [showProfile, setShowProfile] = useState(false)
    const [showResetConfirm, setShowResetConfirm] = useState(false)
    const [battery, setBattery] = useState(87)

    // Vercel AI SDK useChat hook
    const { messages, sendMessage, status, setMessages, stop } = useChat({
        transport: new DefaultChatTransport({
            api: "/api/chat",
        }),
        onError: (error: Error) => {
            console.error("Chat error:", error)
        },
    })

    // Debug logging
    useEffect(() => {
        console.log('[HandheldConsole] useChat messages:', messages)
        console.log('[HandheldConsole] useChat status:', status)
    }, [messages, status])

    // 初始化历史消息
    useEffect(() => {
        if (initialMessages.length > 0) {
            setMessages(initialMessages as any)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const isLoading = status === "submitted" || status === "streaming"

    const handleSend = async (messageText?: string) => {
        const text = messageText || input
        if (!text.trim() || isLoading) return

        setInput("")
        await sendMessage({ text })
        setBattery((prev) => Math.max(prev - 2, 10))
    }

    const handleResetClick = () => {
        setShowResetConfirm(true)
    }

    const confirmReset = async () => {
        try {
            const response = await fetch('/api/chat/clear', {
                method: 'DELETE',
            })

            if (!response.ok) {
                throw new Error('Failed to clear messages')
            }

            setMessages([])
            setBattery(100)
        } catch (error) {
            console.error('Failed to clear chat:', error)
            alert('清空对话失败，请重试')
        }
    }

    const SpeakerGrill = () => (
        <div className="flex flex-col gap-[3px]">
            {[...Array(8)].map((_, row) => (
                <div key={row} className="flex gap-[3px]">
                    {[...Array(3)].map((_, col) => (
                        <div key={col} className="w-[3px] h-[3px] rounded-full bg-[#5a6a5a]" />
                    ))}
                </div>
            ))}
        </div>
    )

    return (
        <>
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="relative w-[850px] h-[520px] flex-shrink-0 overflow-hidden"
            >
                <div
                    className="absolute inset-0 rounded-[3rem] p-1 overflow-hidden"
                    style={{
                        background: "linear-gradient(145deg, #c8f7dc 0%, #a8e6cf 50%, #7fd3a8 100%)",
                        boxShadow: `
              inset 0 2px 4px rgba(255,255,255,0.6),
              inset 0 -2px 4px rgba(0,0,0,0.15),
              0 8px 32px rgba(0,0,0,0.3),
              0 2px 8px rgba(0,0,0,0.2)
            `,
                    }}
                >
                    <div
                        className="absolute inset-0 rounded-[3rem] opacity-30 pointer-events-none"
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                        }}
                    />

                    <div
                        className="relative w-full h-full rounded-[2.5rem] p-4 overflow-hidden"
                        style={{
                            background: "linear-gradient(145deg, #fff8dc 0%, #ffeaa7 50%, #ffe082 100%)",
                            boxShadow: `
                inset 0 2px 4px rgba(255,255,255,0.8),
                inset 0 -2px 4px rgba(0,0,0,0.1)
              `,
                        }}
                    >
                        <div className="absolute top-6 left-8 flex items-center gap-2">
                            <div
                                className="w-2 h-2 rounded-full bg-[#00ff88]"
                                style={{
                                    boxShadow: "0 0 8px #00ff88, 0 0 16px #00ff88",
                                }}
                            />
                            <span className="pixel-text text-[6px] text-gray-600">POWER</span>
                        </div>

                        <div className="absolute top-6 right-8">
                            <span className="pixel-text text-[6px] text-gray-500">MODEL NO. V-0-2025</span>
                        </div>

                        {/* Status Bar */}
                        <div className="flex justify-center items-center mb-3 pt-2">
                            <div className="flex items-center gap-6 bg-[#2d3436]/10 px-4 py-1 rounded-full">
                                <div className="flex items-center gap-2">
                                    <motion.div
                                        className="w-2 h-2 rounded-full bg-[#00d084]"
                                        animate={{
                                            scale: [1, 1.3, 1],
                                            opacity: [1, 0.6, 1],
                                        }}
                                        transition={{
                                            duration: 1.5,
                                            repeat: Number.POSITIVE_INFINITY,
                                            ease: "easeInOut",
                                        }}
                                        style={{
                                            boxShadow: "0 0 6px #00d084",
                                        }}
                                    />
                                    <span className="pixel-text text-[8px] text-gray-700">PIXEL-BOT v1.0</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-1">
                                        <Wifi className="w-3 h-3 text-gray-700" />
                                        <div className="flex gap-0.5">
                                            {[1, 2, 3, 4].map((bar) => (
                                                <div
                                                    key={bar}
                                                    className={`w-1 rounded-sm ${bar <= 3 ? "bg-gray-700" : "bg-gray-400"}`}
                                                    style={{ height: `${bar * 2 + 2}px` }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Battery className="w-4 h-3 text-gray-700" />
                                        <span className="pixel-text text-[8px] text-gray-700">{battery}%</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Main layout: D-Pad | Screen | Buttons */}
                        <div className="flex items-center gap-4 h-[340px]">
                            <div className="flex flex-col items-center gap-4 w-24">
                                <SpeakerGrill />
                                <DPad onPress={() => { }} />
                                <span className="pixel-text text-[5px] text-gray-500">D-PAD</span>
                            </div>

                            <div className="flex-1 h-full flex flex-col overflow-hidden">
                                {/* Dark bezel */}
                                <div
                                    className="flex-1 rounded-xl p-2 overflow-hidden"
                                    style={{
                                        background: "linear-gradient(145deg, #3d3d3d 0%, #2a2a2a 50%, #1a1a1a 100%)",
                                        boxShadow: `
                      inset 0 4px 8px rgba(0,0,0,0.5),
                      0 2px 4px rgba(0,0,0,0.2)
                    `,
                                    }}
                                >
                                    {/* Inner screen with deep recess */}
                                    <div
                                        className="w-full h-full rounded-lg overflow-hidden flex flex-col"
                                        style={{
                                            background: "#e8e8e8",
                                        }}
                                    >
                                        <ChatScreen
                                            messages={messages as any}
                                            isTyping={isLoading}
                                            onQuickAction={handleSend}
                                            input={input}
                                            setInput={setInput}
                                            onSend={() => handleSend()}
                                            onStop={stop}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col items-center gap-4 w-24">
                                <SpeakerGrill />
                                <div className="relative h-28 w-20">
                                    <ConsoleButton
                                        variant="a"
                                        onClick={() => handleSend()}
                                        className="absolute right-0 top-0"
                                        disabled={isLoading || !input.trim()}
                                        label="SEND"
                                    />
                                    <ConsoleButton
                                        variant="b"
                                        onClick={handleResetClick}
                                        className="absolute left-0 bottom-0"
                                        label="RESET"
                                    />
                                </div>
                                <span className="pixel-text text-[5px] text-gray-500">ACTION</span>
                            </div>
                        </div>

                        <div className="mt-2 flex items-center justify-center px-8">
                            <div className="flex gap-6">
                                <ConsoleButton variant="rubber" onClick={handleResetClick} label="RESET" />
                                <ConsoleButton variant="rubber" onClick={() => setShowProfile(true)} label="PROFILE" />
                            </div>
                        </div>
                    </div>
                </div>

                <div
                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-4 h-32 rounded-l-full"
                    style={{
                        background: "linear-gradient(90deg, #7fd3a8 0%, #88d8b0 100%)",
                        boxShadow: "inset 2px 0 4px rgba(255,255,255,0.3)",
                    }}
                />
                <div
                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1 w-4 h-32 rounded-r-full"
                    style={{
                        background: "linear-gradient(-90deg, #7fd3a8 0%, #88d8b0 100%)",
                        boxShadow: "inset -2px 0 4px rgba(255,255,255,0.3)",
                    }}
                />
            </motion.div>

            <AnimatePresence>{showProfile && <ProfileModal onClose={() => setShowProfile(false)} />}</AnimatePresence>
            <AnimatePresence>
                {showResetConfirm && (
                    <ConfirmModal
                        isOpen={showResetConfirm}
                        onClose={() => setShowResetConfirm(false)}
                        onConfirm={confirmReset}
                        title="SYSTEM RESET"
                        message="Are you sure you want to clear all data? This action cannot be undone."
                    />
                )}
            </AnimatePresence>
        </>
    )
}
