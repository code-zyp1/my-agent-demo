"use client"

import { motion, AnimatePresence } from "framer-motion"
import { AlertTriangle } from "lucide-react"
import { ConsoleButton } from "@/components/console/console-button"

interface ConfirmModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    title: string
    message: string
}

export function ConfirmModal({ isOpen, onClose, onConfirm, title, message }: ConfirmModalProps) {
    if (!isOpen) return null

    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="w-[300px] bg-[#e0e4e0] rounded-lg overflow-hidden shadow-2xl border-4 border-[#2d3436]"
            >
                {/* Header */}
                <div className="bg-[#ff5555] p-2 flex items-center gap-2 border-b-4 border-[#2d3436]">
                    <AlertTriangle className="text-white w-5 h-5" />
                    <span className="pixel-text text-white text-xs tracking-wider">{title}</span>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col items-center text-center gap-4">
                    <p className="pixel-text text-[#2d3436] text-[10px] leading-relaxed">
                        {message}
                    </p>

                    <div className="flex gap-4 mt-2">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-[#95a5a6] text-white pixel-text text-[10px] rounded border-b-4 border-[#7f8c8d] active:border-b-0 active:translate-y-1 hover:brightness-110 transition-all"
                        >
                            CANCEL
                        </button>
                        <button
                            onClick={() => {
                                onConfirm()
                                onClose()
                            }}
                            className="px-4 py-2 bg-[#ff5555] text-white pixel-text text-[10px] rounded border-b-4 border-[#c0392b] active:border-b-0 active:translate-y-1 hover:brightness-110 transition-all"
                        >
                            CONFIRM
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}
