"use client"

import { motion } from "framer-motion"
import type { MatchEvent } from "@/lib/types"
import { X } from "lucide-react"

interface EventOverlayProps {
  event: MatchEvent
  onClose: () => void
}

export default function EventOverlay({ event, onClose }: EventOverlayProps) {
  // Different animations based on event type
  const getAnimationVariants = () => {
    switch (event.type) {
      case "Goal":
        return {
          initial: { scale: 0, opacity: 0 },
          animate: {
            scale: [0, 1.5, 1],
            opacity: [0, 1, 1],
            transition: { duration: 1.5 },
          },
          exit: { scale: 0, opacity: 0 },
        }
      case "Yellow Card":
      case "Red Card":
        return {
          initial: { y: -50, opacity: 0 },
          animate: { y: 0, opacity: 1 },
          exit: { y: 50, opacity: 0 },
        }
      case "Substitution":
        return {
          initial: { x: -50, opacity: 0 },
          animate: { x: 0, opacity: 1 },
          exit: { x: 50, opacity: 0 },
        }
      default:
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
        }
    }
  }

  // Get background color based on event type
  const getBackgroundColor = () => {
    switch (event.type) {
      case "Goal":
        return "bg-green-500"
      case "Yellow Card":
        return "bg-yellow-500"
      case "Red Card":
        return "bg-red-500"
      case "Substitution":
        return "bg-blue-500"
      case "Foul":
        return "bg-orange-500"
      default:
        return "bg-gray-500"
    }
  }

  // Get icon based on event type
  const getIcon = () => {
    switch (event.type) {
      case "Goal":
        return "⚽"
      case "Yellow Card":
        return "🟨"
      case "Red Card":
        return "🟥"
      case "Substitution":
        return "🔄"
      case "Foul":
        return "🥊"
      default:
        return "📝"
    }
  }

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center z-10"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={{
        initial: { backgroundColor: "rgba(0, 0, 0, 0)" },
        animate: { backgroundColor: "rgba(0, 0, 0, 0.7)" },
        exit: { backgroundColor: "rgba(0, 0, 0, 0)" },
      }}
    >
      <motion.div
        className={`relative p-6 rounded-lg shadow-lg max-w-md text-white ${getBackgroundColor()}`}
        variants={getAnimationVariants()}
      >
        <button onClick={onClose} className="absolute top-2 right-2 text-white hover:text-gray-200">
          <X size={20} />
        </button>

        <div className="flex items-center mb-4">
          <span className="text-4xl mr-4">{getIcon()}</span>
          <div>
            <h3 className="text-xl font-bold">{event.type}</h3>
            <p className="text-sm opacity-80">
              {Math.floor(event.time / 60)}:{(event.time % 60).toString().padStart(2, "0")}
            </p>
          </div>
        </div>

        <p className="text-lg">{event.description}</p>

        {event.type === "Goal" && (
          <motion.div
            className="mt-4 text-center text-3xl font-bold"
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.2, 1] }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            GOAL!
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  )
}
