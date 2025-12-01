"use client"

import { motion } from "framer-motion"

interface PixelAvatarProps {
  isAnimating?: boolean
  size?: "sm" | "md" | "lg"
}

export function PixelAvatar({ isAnimating, size = "sm" }: PixelAvatarProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  }

  return (
    <motion.div
      animate={isAnimating ? { scale: [1, 1.1, 1] } : {}}
      transition={{ duration: 0.5, repeat: isAnimating ? Number.POSITIVE_INFINITY : 0 }}
      className={`${sizeClasses[size]} flex-shrink-0`}
    >
      <svg viewBox="0 0 16 16" className="w-full h-full" style={{ imageRendering: "pixelated" }}>
        {/* Background */}
        <rect x="4" y="2" width="8" height="8" fill="#ffeaa7" />

        {/* Hair */}
        <rect x="4" y="1" width="8" height="2" fill="#2d3436" />
        <rect x="3" y="2" width="1" height="2" fill="#2d3436" />
        <rect x="12" y="2" width="1" height="2" fill="#2d3436" />

        {/* Face */}
        <rect x="4" y="3" width="8" height="6" fill="#fdcb6e" />

        {/* Eyes */}
        <rect x="5" y="4" width="2" height="2" fill="#2d3436" />
        <rect x="9" y="4" width="2" height="2" fill="#2d3436" />
        <rect x="5" y="4" width="1" height="1" fill="#fff" />
        <rect x="9" y="4" width="1" height="1" fill="#fff" />

        {/* Mouth */}
        <rect x="6" y="7" width="4" height="1" fill="#e17055" />

        {/* Body */}
        <rect x="3" y="10" width="10" height="5" fill="#00b894" />
        <rect x="2" y="11" width="2" height="4" fill="#00b894" />
        <rect x="12" y="11" width="2" height="4" fill="#00b894" />

        {/* Collar detail */}
        <rect x="6" y="10" width="4" height="1" fill="#00cec9" />
      </svg>
    </motion.div>
  )
}
