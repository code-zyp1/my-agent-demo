"use client"

import { motion } from "framer-motion"

interface ConsoleButtonProps {
  variant: "a" | "b" | "select" | "start" | "rubber"
  onClick: () => void
  label?: string
  className?: string
  disabled?: boolean
}

export function ConsoleButton({ variant, onClick, label, className = "", disabled }: ConsoleButtonProps) {
  const styles = {
    a: {
      size: "w-14 h-14",
      bg: "linear-gradient(145deg, #2ecc71 0%, #27ae60 40%, #1e8449 100%)",
      shadow: `
        0 4px 0 #1a6b3a,
        0 6px 12px rgba(0,0,0,0.4),
        inset 0 2px 4px rgba(255,255,255,0.4),
        inset 0 -2px 4px rgba(0,0,0,0.2)
      `,
      pressedShadow: `
        0 1px 0 #1a6b3a,
        0 2px 4px rgba(0,0,0,0.3),
        inset 0 2px 6px rgba(0,0,0,0.3)
      `,
      text: "A",
      textColor: "text-white",
    },
    b: {
      size: "w-12 h-12",
      bg: "linear-gradient(145deg, #e74c3c 0%, #c0392b 40%, #96281b 100%)",
      shadow: `
        0 4px 0 #7b1a10,
        0 6px 12px rgba(0,0,0,0.4),
        inset 0 2px 4px rgba(255,255,255,0.3),
        inset 0 -2px 4px rgba(0,0,0,0.2)
      `,
      pressedShadow: `
        0 1px 0 #7b1a10,
        0 2px 4px rgba(0,0,0,0.3),
        inset 0 2px 6px rgba(0,0,0,0.3)
      `,
      text: "B",
      textColor: "text-white",
    },
    select: {
      size: "w-16 h-6",
      bg: "linear-gradient(180deg, #6b6b6b 0%, #4a4a4a 50%, #3a3a3a 100%)",
      shadow: `
        0 2px 0 #2a2a2a,
        0 3px 6px rgba(0,0,0,0.3),
        inset 0 1px 2px rgba(255,255,255,0.2)
      `,
      pressedShadow: `
        0 0 0 #2a2a2a,
        0 1px 2px rgba(0,0,0,0.2),
        inset 0 1px 3px rgba(0,0,0,0.3)
      `,
      text: label || "SELECT",
      textColor: "text-gray-200",
    },
    start: {
      size: "w-16 h-6",
      bg: "linear-gradient(180deg, #6b6b6b 0%, #4a4a4a 50%, #3a3a3a 100%)",
      shadow: `
        0 2px 0 #2a2a2a,
        0 3px 6px rgba(0,0,0,0.3),
        inset 0 1px 2px rgba(255,255,255,0.2)
      `,
      pressedShadow: `
        0 0 0 #2a2a2a,
        0 1px 2px rgba(0,0,0,0.2),
        inset 0 1px 3px rgba(0,0,0,0.3)
      `,
      text: label || "START",
      textColor: "text-gray-200",
    },
    rubber: {
      size: "w-20 h-7",
      bg: "linear-gradient(180deg, #7a7a7a 0%, #5a5a5a 30%, #4a4a4a 70%, #3a3a3a 100%)",
      shadow: `
        0 3px 0 #2a2a2a,
        0 4px 8px rgba(0,0,0,0.35),
        inset 0 1px 1px rgba(255,255,255,0.15),
        inset 0 -1px 2px rgba(0,0,0,0.2)
      `,
      pressedShadow: `
        0 1px 0 #2a2a2a,
        0 1px 3px rgba(0,0,0,0.25),
        inset 0 2px 4px rgba(0,0,0,0.35)
      `,
      text: label || "",
      textColor: "text-gray-300",
    },
  }

  const style = styles[variant]
  const isRound = variant === "a" || variant === "b"
  const isRubber = variant === "rubber"

  return (
    <motion.button
      whileHover={disabled ? {} : { scale: 1.02 }}
      whileTap={
        disabled
          ? {}
          : {
              scale: 0.98,
              y: isRubber ? 2 : 3,
            }
      }
      onClick={onClick}
      disabled={disabled}
      className={`
        ${style.size} 
        ${isRound ? "rounded-full" : "rounded-full"}
        ${style.textColor}
        pixel-text
        ${isRound ? "text-lg" : "text-[7px]"}
        font-bold
        flex items-center justify-center
        transition-all duration-75
        ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}
        ${isRubber ? "tracking-wider" : ""}
        ${className}
      `}
      style={{
        background: style.bg,
        boxShadow: disabled ? style.pressedShadow : style.shadow,
        textShadow: isRound ? "0 1px 2px rgba(0,0,0,0.3)" : undefined,
        transform: isRubber ? "perspective(100px) rotateX(5deg)" : undefined,
      }}
    >
      {style.text}
    </motion.button>
  )
}
