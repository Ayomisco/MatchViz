"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import FootballPitch from "./football-pitch"
import TimelineSlider from "./timeline-slider"
import EventOverlay from "./event-overlay"
import { useWebSocketSimulation } from "@/hooks/use-websocket-simulation"
import type { MatchEvent, PlayerPosition } from "@/lib/types"
import MatchStats from "./match-stats"
import { useIsMobile } from "@/hooks/use-mobile"
import { useBallAnimation } from "@/hooks/use-ball-animation"

export default function MatchDashboard() {
  const isMobile = useIsMobile()
  const [isLive, setIsLive] = useState(true)
  const [currentTime, setCurrentTime] = useState(0)
  const [replayMode, setReplayMode] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<MatchEvent | null>(null)

  const { playerPositions, ballPosition, matchEvents, matchTime, matchData, isConnected } =
    useWebSocketSimulation(isLive)

  // When scrubbing timeline, find positions at that time
  const [displayPositions, setDisplayPositions] = useState<PlayerPosition[]>(playerPositions)
  const [displayBallPosition, setDisplayBallPosition] = useState(ballPosition)

  useEffect(() => {
    if (isLive || replayMode) {
      setDisplayPositions(playerPositions)
      setDisplayBallPosition(ballPosition)
      setCurrentTime(matchTime)
    } else if (matchData.length > 0) {
      // Find closest data point to current scrubbed time
      const closestDataPoint = matchData.reduce((prev, curr) => {
        return Math.abs(curr.time - currentTime) < Math.abs(prev.time - currentTime) ? curr : prev
      })

      setDisplayPositions(closestDataPoint.playerPositions)
      setDisplayBallPosition(closestDataPoint.ballPosition)
    }
  }, [isLive, replayMode, playerPositions, ballPosition, matchTime, currentTime, matchData])

  // Handle timeline scrubbing
  const handleTimelineChange = (time: number) => {
    if (isLive) setIsLive(false)
    setCurrentTime(time)
    setReplayMode(false)
  }

  // Handle replay of a specific event
  const handleReplayEvent = (event: MatchEvent) => {
    setIsLive(false)
    setReplayMode(true)
    setSelectedEvent(event)
    setCurrentTime(event.time)
  }

  // Get smoothly animated ball position
  const smoothBallPosition = useBallAnimation(ballPosition, isLive, isConnected)

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <div className="flex items-center">
          <div className="flex items-center space-x-2">
            <div className={`h-2 w-2 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`}></div>
            <span className="font-medium text-gray-700 dark:text-gray-300">
              {isConnected ? "Live" : "Disconnected"}
            </span>
          </div>
          <div className="ml-4 text-gray-600 dark:text-gray-400">
            {Math.floor(currentTime / 60)}:{(currentTime % 60).toString().padStart(2, "0")}
          </div>
        </div>
        <button
          onClick={() => setIsLive(!isLive)}
          className={`px-3 py-1 rounded text-sm font-medium ${
            isLive
              ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
              : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
          }`}
        >
          {isLive ? "Exit Live Mode" : "Go Live"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-4">
        <div className="lg:col-span-2">
          <div className="relative bg-green-800 rounded-lg overflow-hidden">
            <FootballPitch
              playerPositions={displayPositions}
              ballPosition={isLive ? smoothBallPosition : displayBallPosition}
            />

            <AnimatePresence>
              {selectedEvent && <EventOverlay event={selectedEvent} onClose={() => setSelectedEvent(null)} />}
            </AnimatePresence>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h3 className="font-medium text-gray-900 dark:text-white mb-3">Match Events</h3>
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {matchEvents.map((event) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-2 rounded-md cursor-pointer ${
                    selectedEvent?.id === event.id
                      ? "bg-blue-100 dark:bg-blue-900"
                      : "bg-gray-100 dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500"
                  }`}
                  onClick={() => handleReplayEvent(event)}
                >
                  <div className="flex justify-between">
                    <span className="font-medium text-sm">{event.type}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {Math.floor(event.time / 60)}:{(event.time % 60).toString().padStart(2, "0")}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">{event.description}</p>
                </motion.div>
              ))}
              {matchEvents.length === 0 && <p className="text-sm text-gray-500 dark:text-gray-400">No events yet</p>}
            </div>
          </div>

          <MatchStats />
        </div>
      </div>

      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <TimelineSlider
          currentTime={currentTime}
          maxTime={90 * 60} // 90 minutes in seconds
          events={matchEvents}
          onChange={handleTimelineChange}
          isLive={isLive}
        />
      </div>
    </div>
  )
}
