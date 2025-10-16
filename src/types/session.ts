import type {
  FeedbackType,
  GameMode,
  GameQuestion,
  PlayerResponse,
} from '../engine/gameEngine'

export interface GameHistoryEntry {
  question: GameQuestion
  response: PlayerResponse
  isCorrect: boolean
  feedback: FeedbackType
  scoreEarned: number
  timeTaken: number
}

export interface GameResult {
  mode: GameMode
  totalScore: number
  correctCount: number
  questionCount: number
  maxStreak: number
  history: GameHistoryEntry[]
}
