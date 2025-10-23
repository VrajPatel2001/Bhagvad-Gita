import type { ReactNode } from "react";

export type GameDifficulty = "gentle" | "steady" | "intense";

export type GameModeId =
  | "quiz"
  | "chapter-match"
  | "translation-match"
  | "fill-blank"
  | "memory";

export interface GameLevel {
  id: string;
  label: string;
  description: string;
  difficulty: GameDifficulty;
  questionCount: number;
  /** How many answer options a single prompt should render */
  options?: number;
  /** Number of verse pairs to surface in memory style games */
  pairs?: number;
  /** Number of verse groups per round (used by matching games) */
  verseBatch?: number;
  /** Optional soft time guidance to show in the UI */
  timeLimitSeconds?: number;
}

export interface GameModeDefinition {
  id: GameModeId;
  name: string;
  tagline: string;
  description: string;
  icon: string;
  accentFrom: string;
  accentTo: string;
  focus: string;
  levels: GameLevel[];
}

export interface GameCatalogSection {
  title: string;
  description: string;
  modes: GameModeDefinition[];
}

export interface ModeCompletionSummary {
  score: number;
  total: number;
  accuracy: number;
  streak: number;
  bonus: number;
  timeElapsedMs?: number;
}

export interface GameShellProps {
  mode: GameModeDefinition;
  level: GameLevel;
  score: number;
  streak: number;
  accuracy: number;
  progress: {
    current: number;
    total: number;
  };
  status: "active" | "complete";
  onExit: () => void;
  onRestart?: () => void;
  summary?: ModeCompletionSummary;
  feedback?: ReactNode;
  children: ReactNode;
}

export interface ModeComponentProps {
  mode: GameModeDefinition;
  level: GameLevel;
  onExit: () => void;
  onRestart: () => void;
}
