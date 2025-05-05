"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import type { MatchEvent } from "@/lib/types"
import { useIsMobile } from "@/hooks/use-mobile"

interface TimelineSliderProps {
  currentTime: number
  maxTime: number
  events: MatchEvent[]
  onChange: (time: number) => void
  isLive: boolean
}

export default function TimelineSlider({ currentTime, maxTime, events, onChange, isLive }: TimelineSliderProps) {
  const sliderRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const isMobile = useIsMobile()

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${minutes}:${secs.toString().padStart(2, "0")}`
  }

  // Calculate percentage for positioning
  const getPercentage = (time: number) => (time / maxTime) * 100

  // Handle click on timeline
  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!sliderRef.current || isLive) return

    const rect = sliderRef.current.getBoundingClientRect()
    const clickPosition = e.clientX - rect.left
    const percentage = clickPosition / rect.width
    const newTime = Math.floor(percentage * maxTime)

    onChange(Math.max(0, Math.min(newTime, maxTime)))
  }

  // Handle touch/mouse events for dragging
  useEffect(() => {
    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging || !sliderRef.current || isLive) return

      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX

      const rect = sliderRef.current.getBoundingClientRect()
      const position = clientX - rect.left
      const percentage = position / rect.width
      const newTime = Math.floor(percentage * maxTime)

      onChange(Math.max(0, Math.min(newTime, maxTime)))
      e.preventDefault()
    }

    const handleUp = () => {
      setIsDragging(false)
    }

    if (isDragging) {
      window.addEventListener("mousemove", handleMove)
      window.addEventListener("touchmove", handleMove, { passive: false })
      window.addEventListener("mouseup", handleUp)
      window.addEventListener("touchend", handleUp)
    }

    return () => {
      window.removeEventListener("mousemove", handleMove)
      window.removeEventListener("touchmove", handleMove)
      window.removeEventListener("mouseup", handleUp)
      window.removeEventListener("touchend", handleUp)
    }
  }, [isDragging, maxTime, onChange, isLive])

  return (
    <div className="w-full">
      <div
        ref={sliderRef}
        className={`relative h-8 bg-gray-200 dark:bg-gray-700 rounded-full cursor-pointer ${isLive ? "opacity-50 cursor-not-allowed" : ""}`}
        onClick={handleTimelineClick}
      >
        {/* Timeline progress */}
        <div
          className="absolute h-full bg-blue-500 dark:bg-blue-600 rounded-full"
          style={{ width: `${getPercentage(currentTime)}%` }}
        />

        {/* Event markers */}
        {events.map((event) => (
          <div
            key={event.id}
            className="absolute top-0 w-1 h-full bg-red-500"
            style={{ left: `${getPercentage(event.time)}%` }}
            title={`${event.type} - ${formatTime(event.time)}`}
          />
        ))}

        {/* Draggable handle */}
        {!isLive && (
          <motion.div
            className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white dark:bg-gray-200 rounded-full shadow-md cursor-grab active:cursor-grabbing"
            style={{ left: `calc(${getPercentage(currentTime)}% - 8px)` }}
            onMouseDown={() => setIsDragging(true)}
            onTouchStart={() => setIsDragging(true)}
            whileTap={{ scale: 1.2 }}
          />
        )}

        {/* Time markers */}
        <div className="absolute top-full mt-2 w-full flex justify-between text-xs text-gray-600 dark:text-gray-400">
          <span>0:00</span>
          <span>45:00</span>
          <span>90:00</span>
        </div>
      </div>

      <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
        {isMobile ? "Tap and drag to scrub through match timeline" : "Click and drag to scrub through match timeline"}
      </div>
    </div>
  )
}
