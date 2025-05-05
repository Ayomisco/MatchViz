"use client"

import { useState, useEffect, useRef } from "react"

interface BallPosition {
  x: number
  y: number
}

export function useBallAnimation(
  actualBallPosition: BallPosition,
  isLive: boolean,
  isConnected: boolean,
): BallPosition {
  const [smoothBallPosition, setSmoothBallPosition] = useState<BallPosition>(actualBallPosition)
  const prevPositionRef = useRef<BallPosition>(actualBallPosition)
  const animationFrameRef = useRef<number | null>(null)

  useEffect(() => {
    if (!isLive || !isConnected) {
      // If not live or not connected, just use the actual position without animation
      setSmoothBallPosition(actualBallPosition)
      return
    }

    // Store the previous position for interpolation
    prevPositionRef.current = smoothBallPosition

    // Animation function using requestAnimationFrame for smooth movement
    const animate = () => {
      setSmoothBallPosition((current) => {
        // Interpolate between current position and target position
        // with easing for natural movement
        const ease = 0.1 // Lower = smoother but slower

        const dx = actualBallPosition.x - current.x
        const dy = actualBallPosition.y - current.y

        // If we're very close to the target, just snap to it
        if (Math.abs(dx) < 0.01 && Math.abs(dy) < 0.01) {
          return actualBallPosition
        }

        return {
          x: current.x + dx * ease,
          y: current.y + dy * ease,
        }
      })

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    // Start the animation
    animationFrameRef.current = requestAnimationFrame(animate)

    // Clean up
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [actualBallPosition, isLive, isConnected, smoothBallPosition])

  return smoothBallPosition
}
