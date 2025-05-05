"use client"

import { useState } from "react"
import { motion } from "framer-motion"

export default function MatchStats() {
  // Mock stats data
  const [stats] = useState({
    possession: { home: 58, away: 42 },
    shots: { home: 12, away: 8 },
    shotsOnTarget: { home: 5, away: 3 },
    corners: { home: 7, away: 4 },
    fouls: { home: 10, away: 14 },
    yellowCards: { home: 2, away: 3 },
    redCards: { home: 0, away: 1 },
    passes: { home: 423, away: 305 },
    passAccuracy: { home: 87, away: 79 },
  })

  // Team names
  const homeTeam = "Home Team"
  const awayTeam = "Away Team"

  return (
    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
      <h3 className="font-medium text-gray-900 dark:text-white mb-3">Match Stats</h3>

      <div className="space-y-4">
        {/* Possession */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="font-medium">{homeTeam}</span>
            <span>Possession</span>
            <span className="font-medium">{awayTeam}</span>
          </div>
          <div className="flex items-center">
            <span className="w-8 text-right text-sm">{stats.possession.home}%</span>
            <div className="flex-1 mx-2 h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-red-500"
                initial={{ width: 0 }}
                animate={{ width: `${stats.possession.home}%` }}
                transition={{ duration: 1 }}
              />
            </div>
            <span className="w-8 text-sm">{stats.possession.away}%</span>
          </div>
        </div>

        {/* Shots */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>{stats.shots.home}</span>
            <span>Shots</span>
            <span>{stats.shots.away}</span>
          </div>
          <div className="flex h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-red-500"
              initial={{ width: 0 }}
              animate={{ width: `${(stats.shots.home / (stats.shots.home + stats.shots.away)) * 100}%` }}
              transition={{ duration: 1 }}
            />
          </div>
        </div>

        {/* Shots on Target */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>{stats.shotsOnTarget.home}</span>
            <span>Shots on Target</span>
            <span>{stats.shotsOnTarget.away}</span>
          </div>
          <div className="flex h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-red-500"
              initial={{ width: 0 }}
              animate={{
                width: `${(stats.shotsOnTarget.home / (stats.shotsOnTarget.home + stats.shotsOnTarget.away)) * 100}%`,
              }}
              transition={{ duration: 1 }}
            />
          </div>
        </div>

        {/* Passes */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>{stats.passes.home}</span>
            <span>Passes</span>
            <span>{stats.passes.away}</span>
          </div>
          <div className="flex h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-red-500"
              initial={{ width: 0 }}
              animate={{ width: `${(stats.passes.home / (stats.passes.home + stats.passes.away)) * 100}%` }}
              transition={{ duration: 1 }}
            />
          </div>
        </div>

        {/* Pass Accuracy */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>{stats.passAccuracy.home}%</span>
            <span>Pass Accuracy</span>
            <span>{stats.passAccuracy.away}%</span>
          </div>
          <div className="flex h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-red-500"
              initial={{ width: 0 }}
              animate={{
                width: `${(stats.passAccuracy.home / (stats.passAccuracy.home + stats.passAccuracy.away)) * 100}%`,
              }}
              transition={{ duration: 1 }}
            />
          </div>
        </div>

        {/* Other stats in a grid */}
        <div className="grid grid-cols-3 gap-2 text-sm">
          <div className="text-center">{stats.corners.home}</div>
          <div className="text-center">Corners</div>
          <div className="text-center">{stats.corners.away}</div>

          <div className="text-center">{stats.fouls.home}</div>
          <div className="text-center">Fouls</div>
          <div className="text-center">{stats.fouls.away}</div>

          <div className="text-center">{stats.yellowCards.home}</div>
          <div className="text-center">Yellow Cards</div>
          <div className="text-center">{stats.yellowCards.away}</div>

          <div className="text-center">{stats.redCards.home}</div>
          <div className="text-center">Red Cards</div>
          <div className="text-center">{stats.redCards.away}</div>
        </div>
      </div>
    </div>
  )
}
