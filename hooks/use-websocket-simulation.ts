"use client"

import { useState, useEffect, useRef } from "react"
import type { PlayerPosition, MatchEvent, MatchDataPoint } from "@/lib/types"

// Initial player positions
const initialPlayerPositions: PlayerPosition[] = [
  // Home team (11 players)
  { id: "h1", team: "home", number: 1, x: 5, y: 34 }, // Goalkeeper
  { id: "h2", team: "home", number: 2, x: 15, y: 17 }, // Defenders
  { id: "h3", team: "home", number: 3, x: 15, y: 34 },
  { id: "h4", team: "home", number: 4, x: 15, y: 51 },
  { id: "h5", team: "home", number: 5, x: 25, y: 25 }, // Midfielders
  { id: "h6", team: "home", number: 6, x: 25, y: 42 },
  { id: "h7", team: "home", number: 7, x: 35, y: 17 },
  { id: "h8", team: "home", number: 8, x: 35, y: 34 },
  { id: "h9", team: "home", number: 9, x: 35, y: 51 },
  { id: "h10", team: "home", number: 10, x: 45, y: 25 }, // Forwards
  { id: "h11", team: "home", number: 11, x: 45, y: 42 },

  // Away team (11 players)
  { id: "a1", team: "away", number: 1, x: 100, y: 34 }, // Goalkeeper
  { id: "a2", team: "away", number: 2, x: 90, y: 17 }, // Defenders
  { id: "a3", team: "away", number: 3, x: 90, y: 34 },
  { id: "a4", team: "away", number: 4, x: 90, y: 51 },
  { id: "a5", team: "away", number: 5, x: 80, y: 25 }, // Midfielders
  { id: "a6", team: "away", number: 6, x: 80, y: 42 },
  { id: "a7", team: "away", number: 7, x: 70, y: 17 },
  { id: "a8", team: "away", number: 8, x: 70, y: 34 },
  { id: "a9", team: "away", number: 9, x: 70, y: 51 },
  { id: "a10", team: "away", number: 10, x: 60, y: 25 }, // Forwards
  { id: "a11", team: "away", number: 11, x: 60, y: 42 },
]

// Initial ball position
const initialBallPosition = { x: 52.5, y: 34 }

// Predefined match events
const predefinedEvents: Omit<MatchEvent, "id">[] = [
  {
    type: "Goal",
    time: 12 * 60 + 35, // 12:35
    description: "Amazing strike from outside the box by Player 10!",
    position: { x: 85, y: 34 },
  },
  {
    type: "Yellow Card",
    time: 23 * 60 + 12, // 23:12
    description: "Reckless tackle by Player 6",
    position: { x: 45, y: 40 },
  },
  {
    type: "Substitution",
    time: 45 * 60 + 0, // 45:00
    description: "Player 7 replaced by Player 14 due to injury",
  },
  {
    type: "Goal",
    time: 52 * 60 + 20, // 52:20
    description: "Header from a corner by Player 5!",
    position: { x: 92, y: 25 },
  },
  {
    type: "Red Card",
    time: 67 * 60 + 45, // 67:45
    description: "Violent conduct by Player 3",
    position: { x: 60, y: 30 },
  },
  {
    type: "Foul",
    time: 75 * 60 + 33, // 75:33
    description: "Free kick awarded after foul on Player 11",
    position: { x: 70, y: 45 },
  },
  {
    type: "Goal",
    time: 88 * 60 + 12, // 88:12
    description: "Last minute equalizer by Player 9!",
    position: { x: 88, y: 34 },
  },
]

export function useWebSocketSimulation(isLive = true) {
  const [playerPositions, setPlayerPositions] = useState<PlayerPosition[]>(initialPlayerPositions)
  const [ballPosition, setBallPosition] = useState(initialBallPosition)
  const [matchEvents, setMatchEvents] = useState<MatchEvent[]>([])
  const [matchTime, setMatchTime] = useState(0) // in seconds
  const [isConnected, setIsConnected] = useState(true)
  const [matchData, setMatchData] = useState<MatchDataPoint[]>([])

  // Store the last update time to simulate realistic movement
  const lastUpdateRef = useRef(Date.now())

  // Simulate WebSocket connection
  useEffect(() => {
    if (!isLive) return

    // Simulate connection status
    const connectionInterval = setInterval(() => {
      // 98% chance to stay connected, 2% chance to disconnect
      if (Math.random() > 0.98) {
        setIsConnected(false)
        // Reconnect after 2-5 seconds
        setTimeout(() => setIsConnected(true), 2000 + Math.random() * 3000)
      } else {
        setIsConnected(true)
      }
    }, 10000)

    return () => {
      clearInterval(connectionInterval)
    }
  }, [isLive])

  // Simulate match time progression
  useEffect(() => {
    if (!isLive || !isConnected) return

    const timeInterval = setInterval(() => {
      setMatchTime((prev) => {
        // Cap at 90 minutes (5400 seconds)
        return Math.min(prev + 1, 5400)
      })
    }, 1000)

    return () => {
      clearInterval(timeInterval)
    }
  }, [isLive, isConnected])

  // Simulate player and ball movement
  useEffect(() => {
    if (!isLive || !isConnected) return

    const movementInterval = setInterval(() => {
      const now = Date.now()
      const deltaTime = (now - lastUpdateRef.current) / 1000 // in seconds
      lastUpdateRef.current = now

      // Update player positions with some randomness
      setPlayerPositions((prevPositions) => {
        return prevPositions.map((player) => {
          // Random movement vector
          const dx = (Math.random() - 0.5) * 2 * deltaTime * 5
          const dy = (Math.random() - 0.5) * 2 * deltaTime * 5

          // Calculate new position
          let newX = player.x + dx
          let newY = player.y + dy

          // Keep players within bounds
          newX = Math.max(2, Math.min(103, newX))
          newY = Math.max(2, Math.min(66, newY))

          // Keep goalkeepers near their goals
          if (player.number === 1) {
            if (player.team === "home") {
              newX = Math.max(2, Math.min(10, newX))
            } else {
              newX = Math.max(95, Math.min(103, newX))
            }
            newY = Math.max(25, Math.min(43, newY))
          }

          return {
            ...player,
            x: newX,
            y: newY,
          }
        })
      })

      // Update ball position with more natural movement
      setBallPosition((prev) => {
        // Create more continuous and natural ball movement
        // Use a combination of inertia and attraction to players

        // Find the closest player to the ball
        const closestPlayer = playerPositions.reduce(
          (closest, player) => {
            const distToBall = Math.sqrt(Math.pow(player.x - prev.x, 2) + Math.pow(player.y - prev.y, 2))
            const distToClosest = closest
              ? Math.sqrt(Math.pow(closest.x - prev.x, 2) + Math.pow(closest.y - prev.y, 2))
              : Number.POSITIVE_INFINITY

            return distToBall < distToClosest ? player : closest
          },
          null as PlayerPosition | null,
        )

        // Ball has some attraction to the closest player
        let dx = 0
        let dy = 0

        if (closestPlayer) {
          // Vector from ball to closest player
          const toPlayerX = closestPlayer.x - prev.x
          const toPlayerY = closestPlayer.y - prev.y
          const distToPlayer = Math.sqrt(toPlayerX * toPlayerX + toPlayerY * toPlayerY)

          // If player is close enough, ball moves toward them with some randomness
          if (distToPlayer < 15) {
            // Normalize and scale
            dx = (toPlayerX / distToPlayer) * deltaTime * 8 * Math.random()
            dy = (toPlayerY / distToPlayer) * deltaTime * 8 * Math.random()
          } else {
            // Random movement with inertia
            dx = (Math.random() - 0.5) * 2 * deltaTime * 10
            dy = (Math.random() - 0.5) * 2 * deltaTime * 10
          }
        } else {
          // Random movement with inertia
          dx = (Math.random() - 0.5) * 2 * deltaTime * 10
          dy = (Math.random() - 0.5) * 2 * deltaTime * 10
        }

        // Calculate new position
        let newX = prev.x + dx
        let newY = prev.y + dy

        // Keep ball within bounds
        newX = Math.max(1, Math.min(104, newX))
        newY = Math.max(1, Math.min(67, newY))

        return { x: newX, y: newY }
      })

      // Store match data point
      setMatchData((prev) => {
        const newDataPoint: MatchDataPoint = {
          time: matchTime,
          playerPositions: playerPositions,
          ballPosition: ballPosition,
        }

        // Keep last 1000 data points (about 16 minutes at 1 update per second)
        const newData = [...prev, newDataPoint]
        if (newData.length > 1000) {
          return newData.slice(newData.length - 1000)
        }
        return newData
      })
    }, 100)

    return () => {
      clearInterval(movementInterval)
    }
  }, [isLive, isConnected, playerPositions, ballPosition, matchTime])

  // Simulate match events
  useEffect(() => {
    if (!isLive || !isConnected) return

    // Check for predefined events
    const checkEvents = () => {
      predefinedEvents.forEach((event) => {
        if (matchTime >= event.time && !matchEvents.some((e) => e.time === event.time && e.type === event.type)) {
          // Add this event if it hasn't been added yet
          const newEvent: MatchEvent = {
            ...event,
            id: `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          }

          setMatchEvents((prev) => [...prev, newEvent])
        }
      })
    }

    // Check for events every second
    const eventInterval = setInterval(checkEvents, 1000)

    return () => {
      clearInterval(eventInterval)
    }
  }, [isLive, isConnected, matchTime, matchEvents])

  return {
    playerPositions,
    ballPosition,
    matchEvents,
    matchTime,
    matchData,
    isConnected,
  }
}
