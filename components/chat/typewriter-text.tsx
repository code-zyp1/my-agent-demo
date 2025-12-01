"use client"

import { useState, useEffect } from "react"

interface TypewriterTextProps {
  text: string
  speed?: number
}

export function TypewriterText({ text, speed = 20 }: TypewriterTextProps) {
  const [displayedText, setDisplayedText] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)

  // Safety check for undefined text
  const safeText = text || ""

  useEffect(() => {
    if (currentIndex < safeText.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + safeText[currentIndex])
        setCurrentIndex((prev) => prev + 1)
      }, speed)
      return () => clearTimeout(timeout)
    }
  }, [currentIndex, safeText, speed])

  useEffect(() => {
    setDisplayedText("")
    setCurrentIndex(0)
  }, [safeText])

  return (
    <span>
      {displayedText}
      {currentIndex < safeText.length && <span className="animate-pulse">▋</span>}
    </span>
  )
}
