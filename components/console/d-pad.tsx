"use client"

import { motion } from "framer-motion"

interface DPadProps {
  onPress: (direction: "up" | "down" | "left" | "right") => void
}

export function DPad({ onPress }: DPadProps) {
  return (
    <div className="relative w-20 h-20">
      {/* D-Pad base/shadow */}
      <div
        className="absolute inset-0 rounded-lg"
        style={{
          background: "linear-gradient(145deg, #4a4a4a 0%, #2a2a2a 100%)",
          boxShadow: "0 4px 8px rgba(0,0,0,0.4)",
        }}
      />

      {/* Vertical bar */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="absolute top-0 left-1/2 -translate-x-1/2 w-7 h-full rounded-sm cursor-pointer"
        style={{
          background: "linear-gradient(90deg, #3d3d3d 0%, #5a5a5a 30%, #5a5a5a 70%, #3d3d3d 100%)",
          boxShadow: `
            inset 0 2px 4px rgba(255,255,255,0.1),
            inset 0 -2px 4px rgba(0,0,0,0.3)
          `,
        }}
      >
        {/* Up arrow indicator */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2">
          <div
            className="w-0 h-0"
            style={{
              borderLeft: "5px solid transparent",
              borderRight: "5px solid transparent",
              borderBottom: "6px solid #888",
            }}
          />
        </div>
        {/* Down arrow indicator */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
          <div
            className="w-0 h-0"
            style={{
              borderLeft: "5px solid transparent",
              borderRight: "5px solid transparent",
              borderTop: "6px solid #888",
            }}
          />
        </div>
      </motion.div>

      {/* Horizontal bar */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-7 rounded-sm cursor-pointer"
        style={{
          background: "linear-gradient(180deg, #3d3d3d 0%, #5a5a5a 30%, #5a5a5a 70%, #3d3d3d 100%)",
          boxShadow: `
            inset 2px 0 4px rgba(255,255,255,0.1),
            inset -2px 0 4px rgba(0,0,0,0.3)
          `,
        }}
      >
        {/* Left arrow indicator */}
        <div className="absolute left-2 top-1/2 -translate-y-1/2">
          <div
            className="w-0 h-0"
            style={{
              borderTop: "5px solid transparent",
              borderBottom: "5px solid transparent",
              borderRight: "6px solid #888",
            }}
          />
        </div>
        {/* Right arrow indicator */}
        <div className="absolute right-2 top-1/2 -translate-y-1/2">
          <div
            className="w-0 h-0"
            style={{
              borderTop: "5px solid transparent",
              borderBottom: "5px solid transparent",
              borderLeft: "6px solid #888",
            }}
          />
        </div>
      </motion.div>

      {/* Center circle */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 rounded-full"
        style={{
          background: "linear-gradient(145deg, #4a4a4a 0%, #3a3a3a 100%)",
          boxShadow: "inset 0 1px 2px rgba(0,0,0,0.5)",
        }}
      />
    </div>
  )
}
