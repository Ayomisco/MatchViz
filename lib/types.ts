export interface PlayerPosition {
  id: string
  team: "home" | "away"
  number: number
  x: number
  y: number
}

export interface MatchEvent {
  id: string
  type: "Goal" | "Yellow Card" | "Red Card" | "Substitution" | "Foul" | "Other"
  time: number // in seconds
  description: string
  player?: string
  position?: { x: number; y: number }
}

export interface MatchDataPoint {
  time: number
  playerPositions: PlayerPosition[]
  ballPosition: { x: number; y: number }
}
