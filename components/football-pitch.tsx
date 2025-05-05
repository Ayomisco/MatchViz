"use client"

import { motion } from "framer-motion"
import type { PlayerPosition } from "@/lib/types"

interface FootballPitchProps {
  playerPositions: PlayerPosition[]
  ballPosition: { x: number; y: number }
}

export default function FootballPitch({ playerPositions, ballPosition }: FootballPitchProps) {
  // SVG viewBox dimensions (standard football pitch ratio)
  const pitchWidth = 105
  const pitchHeight = 68

  // Team colors
  const homeTeamColor = "#ff0000"
  const awayTeamColor = "#0000ff"

  return (
    <div className="w-full aspect-[105/68] relative">
      <svg viewBox={`0 0 ${pitchWidth} ${pitchHeight}`} className="w-full h-full">
        {/* Pitch background */}
        <rect x="0" y="0" width={pitchWidth} height={pitchHeight} fill="#2e8b57" stroke="#ffffff" strokeWidth="0.2" />

        {/* Center line */}
        <line x1={pitchWidth / 2} y1="0" x2={pitchWidth / 2} y2={pitchHeight} stroke="#ffffff" strokeWidth="0.2" />

        {/* Center circle */}
        <circle cx={pitchWidth / 2} cy={pitchHeight / 2} r="9.15" fill="none" stroke="#ffffff" strokeWidth="0.2" />
        <circle cx={pitchWidth / 2} cy={pitchHeight / 2} r="0.5" fill="#ffffff" />

        {/* Penalty areas */}
        {/* Home team (left) */}
        <rect
          x="0"
          y={(pitchHeight - 40.32) / 2}
          width="16.5"
          height="40.32"
          fill="none"
          stroke="#ffffff"
          strokeWidth="0.2"
        />
        <rect
          x="0"
          y={(pitchHeight - 18.32) / 2}
          width="5.5"
          height="18.32"
          fill="none"
          stroke="#ffffff"
          strokeWidth="0.2"
        />
        <circle
          cx="11"
          cy={pitchHeight / 2}
          r="9.15"
          fill="none"
          stroke="#ffffff"
          strokeWidth="0.2"
          strokeDasharray="0.5,0.5"
        />
        <circle cx="11" cy={pitchHeight / 2} r="0.5" fill="#ffffff" />

        {/* Away team (right) */}
        <rect
          x={pitchWidth - 16.5}
          y={(pitchHeight - 40.32) / 2}
          width="16.5"
          height="40.32"
          fill="none"
          stroke="#ffffff"
          strokeWidth="0.2"
        />
        <rect
          x={pitchWidth - 5.5}
          y={(pitchHeight - 18.32) / 2}
          width="5.5"
          height="18.32"
          fill="none"
          stroke="#ffffff"
          strokeWidth="0.2"
        />
        <circle
          cx={pitchWidth - 11}
          cy={pitchHeight / 2}
          r="9.15"
          fill="none"
          stroke="#ffffff"
          strokeWidth="0.2"
          strokeDasharray="0.5,0.5"
        />
        <circle cx={pitchWidth - 11} cy={pitchHeight / 2} r="0.5" fill="#ffffff" />

        {/* Corner arcs */}
        <path d="M 0,0 A 1,1 0 0 1 1,1" fill="none" stroke="#ffffff" strokeWidth="0.2" />
        <path d="M 105,0 A 1,1 0 0 0 104,1" fill="none" stroke="#ffffff" strokeWidth="0.2" />
        <path d="M 0,68 A 1,1 0 0 0 1,67" fill="none" stroke="#ffffff" strokeWidth="0.2" />
        <path d="M 105,68 A 1,1 0 0 1 104,67" fill="none" stroke="#ffffff" strokeWidth="0.2" />

        {/* Goal lines */}
        <rect x="-0.5" y={(pitchHeight - 7.32) / 2} width="0.5" height="7.32" fill="#ffffff" />
        <rect x={pitchWidth} y={(pitchHeight - 7.32) / 2} width="0.5" height="7.32" fill="#ffffff" />

        {/* Players */}
        {playerPositions.map((player) => (
          <motion.g
            key={player.id}
            initial={{ x: player.x, y: player.y }}
            animate={{ x: player.x, y: player.y }}
            transition={{ type: "spring", damping: 20 }}
          >
            <motion.circle
              r="1.2"
              fill={player.team === "home" ? homeTeamColor : awayTeamColor}
              stroke="#ffffff"
              strokeWidth="0.2"
            />
            <motion.text textAnchor="middle" dy="0.3" fontSize="0.8" fill="#ffffff">
              {player.number}
            </motion.text>
          </motion.g>
        ))}

        {/* Ball with more fluid animation */}
        <motion.circle
          cx={ballPosition.x}
          cy={ballPosition.y}
          r="0.8"
          fill="#ffffff"
          stroke="#000000"
          strokeWidth="0.1"
          initial={false}
          animate={{ cx: ballPosition.x, cy: ballPosition.y }}
          transition={{
            type: "spring",
            damping: 15,
            stiffness: 100,
            restDelta: 0.001,
            velocity: 1,
          }}
        />
      </svg>
    </div>
  )
}
