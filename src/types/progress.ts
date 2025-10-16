export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

export interface ChapterProgress {
  id: string;
  title: string;
  completedAt: string;
  difficulty: DifficultyLevel;
}

export interface QuizScore {
  quizId: string;
  title: string;
  lastScore: number;
  bestScore: number;
  attempts: number;
  lastAttemptAt: string | null;
}

export interface StreakInfo {
  current: number;
  longest: number;
  lastUpdated: string | null;
}

export type ReminderFrequency = 'daily' | 'weekly' | 'weekdays' | 'off';

export interface NotificationPreferences {
  remindersEnabled: boolean;
  reminderFrequency: ReminderFrequency;
  reminderTime: string;
  pushOptIn: boolean;
}

export interface ProgressSnapshot {
  chaptersRead: ChapterProgress[];
  quizScores: QuizScore[];
  streak: StreakInfo;
  difficulty: DifficultyLevel;
  xp: number;
  unlockedAchievements: string[];
}
