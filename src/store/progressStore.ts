import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { ACHIEVEMENT_DEFINITIONS, evaluateAchievements } from '../achievements/definitions';
import type {
  ChapterProgress,
  DifficultyLevel,
  NotificationPreferences,
  ProgressSnapshot,
  QuizScore,
  StreakInfo,
} from '../types/progress';

const FALLBACK_STORAGE: Storage = {
  getItem: () => null,
  setItem: () => undefined,
  removeItem: () => undefined,
  clear: () => undefined,
  key: () => null,
  get length() {
    return 0;
  },
};

const storageCreator = () => {
  if (typeof window !== 'undefined') {
    return window.localStorage;
  }
  return FALLBACK_STORAGE;
};

const midnightIso = (value: Date) => {
  const result = new Date(value);
  result.setHours(0, 0, 0, 0);
  return result.toISOString();
};

const defaultNotifications: NotificationPreferences = {
  remindersEnabled: false,
  reminderFrequency: 'off',
  reminderTime: '09:00',
  pushOptIn: false,
};

const baselineSnapshot: ProgressSnapshot = {
  chaptersRead: [],
  quizScores: [],
  streak: {
    current: 0,
    longest: 0,
    lastUpdated: null,
  },
  difficulty: 'beginner',
  xp: 0,
  unlockedAchievements: [],
};

const mergeAchievements = (snapshot: ProgressSnapshot): string[] => {
  const unlocked = evaluateAchievements(snapshot);
  unlocked.sort((a, b) => a.localeCompare(b));
  return unlocked;
};

const DAY_IN_MS = 24 * 60 * 60 * 1000;

const getDayDiff = (from: Date, to: Date) => {
  const fromMidnight = new Date(from);
  fromMidnight.setHours(0, 0, 0, 0);
  const toMidnight = new Date(to);
  toMidnight.setHours(0, 0, 0, 0);
  return Math.round((toMidnight.getTime() - fromMidnight.getTime()) / DAY_IN_MS);
};

interface ProgressState extends ProgressSnapshot {
  notifications: NotificationPreferences;
  markChapterComplete: (chapter: { id: string; title: string; difficulty: DifficultyLevel }) => void;
  recordQuizScore: (payload: { quizId: string; title: string; score: number }) => void;
  updateStreak: (date?: Date) => void;
  resetProgress: () => void;
  setDifficulty: (difficulty: DifficultyLevel) => void;
  updateNotifications: (preferences: Partial<NotificationPreferences>) => void;
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set) => ({
      ...baselineSnapshot,
      notifications: defaultNotifications,
      markChapterComplete: ({ id, title, difficulty }) => {
        set((state) => {
          const alreadyCompleted = state.chaptersRead.some((entry) => entry.id === id);

          if (alreadyCompleted) {
            if (difficulty && state.difficulty !== difficulty) {
              return { ...state, difficulty };
            }
            return state;
          }

          const chapter: ChapterProgress = {
            id,
            title,
            completedAt: new Date().toISOString(),
            difficulty: difficulty ?? state.difficulty,
          };

          const updatedChapters = [...state.chaptersRead, chapter];
          const updatedXp = state.xp + 50;
          const snapshot: ProgressSnapshot = {
            chaptersRead: updatedChapters,
            quizScores: state.quizScores,
            streak: state.streak,
            difficulty: difficulty ?? state.difficulty,
            xp: updatedXp,
            unlockedAchievements: state.unlockedAchievements,
          };

          return {
            ...state,
            chaptersRead: updatedChapters,
            difficulty: difficulty ?? state.difficulty,
            xp: updatedXp,
            unlockedAchievements: mergeAchievements(snapshot),
          };
        });
      },
      recordQuizScore: ({ quizId, title, score }) => {
        const sanitizedScore = Math.max(0, Math.min(100, Math.round(score)));
        set((state) => {
          const existingIndex = state.quizScores.findIndex((quiz) => quiz.quizId === quizId);
          const timeStamp = new Date().toISOString();
          let updatedXp = state.xp + Math.max(5, Math.round(sanitizedScore / 4));
          let updatedQuizzes: QuizScore[];

          if (existingIndex === -1) {
            updatedQuizzes = [
              ...state.quizScores,
              {
                quizId,
                title,
                lastScore: sanitizedScore,
                bestScore: sanitizedScore,
                attempts: 1,
                lastAttemptAt: timeStamp,
              },
            ];
          } else {
            updatedQuizzes = state.quizScores.map((quiz, index) => {
              if (index !== existingIndex) {
                return quiz;
              }

              const bestScore = Math.max(quiz.bestScore, sanitizedScore);
              if (bestScore > quiz.bestScore) {
                updatedXp += 15;
              }

              return {
                ...quiz,
                lastScore: sanitizedScore,
                bestScore,
                attempts: quiz.attempts + 1,
                lastAttemptAt: timeStamp,
              };
            });
          }

          const snapshot: ProgressSnapshot = {
            chaptersRead: state.chaptersRead,
            quizScores: updatedQuizzes,
            streak: state.streak,
            difficulty: state.difficulty,
            xp: updatedXp,
            unlockedAchievements: state.unlockedAchievements,
          };

          return {
            ...state,
            quizScores: updatedQuizzes,
            xp: updatedXp,
            unlockedAchievements: mergeAchievements(snapshot),
          };
        });
      },
      updateStreak: (date) => {
        set((state) => {
          const today = date ? new Date(date) : new Date();
          const last = state.streak.lastUpdated ? new Date(state.streak.lastUpdated) : null;

          if (last) {
            const diff = getDayDiff(last, today);

            if (diff <= 0) {
              return state;
            }

            const current = diff === 1 ? state.streak.current + 1 : 1;
            const longest = Math.max(state.streak.longest, current);
            const updatedStreak: StreakInfo = {
              current,
              longest,
              lastUpdated: midnightIso(today),
            };

            const updatedXp = state.xp + 15;
            const snapshot: ProgressSnapshot = {
              chaptersRead: state.chaptersRead,
              quizScores: state.quizScores,
              streak: updatedStreak,
              difficulty: state.difficulty,
              xp: updatedXp,
              unlockedAchievements: state.unlockedAchievements,
            };

            return {
              ...state,
              streak: updatedStreak,
              xp: updatedXp,
              unlockedAchievements: mergeAchievements(snapshot),
            };
          }

          const initialStreak: StreakInfo = {
            current: 1,
            longest: 1,
            lastUpdated: midnightIso(today),
          };
          const snapshot: ProgressSnapshot = {
            chaptersRead: state.chaptersRead,
            quizScores: state.quizScores,
            streak: initialStreak,
            difficulty: state.difficulty,
            xp: state.xp + 15,
            unlockedAchievements: state.unlockedAchievements,
          };

          return {
            ...state,
            streak: initialStreak,
            xp: snapshot.xp,
            unlockedAchievements: mergeAchievements(snapshot),
          };
        });
      },
      resetProgress: () => {
        set(() => ({
          ...baselineSnapshot,
          notifications: defaultNotifications,
        }));
      },
      setDifficulty: (difficulty) => {
        set((state) => {
          if (state.difficulty === difficulty) {
            return state;
          }

          return {
            ...state,
            difficulty,
          };
        });
      },
      updateNotifications: (preferences) => {
        set((state) => ({
          ...state,
          notifications: {
            ...state.notifications,
            ...preferences,
          },
        }));
      },
    }),
    {
      name: 'learning-progression-store',
      storage: createJSONStorage(storageCreator),
      partialize: (state) => ({
        chaptersRead: state.chaptersRead,
        quizScores: state.quizScores,
        streak: state.streak,
        difficulty: state.difficulty,
        xp: state.xp,
        unlockedAchievements: state.unlockedAchievements,
        notifications: state.notifications,
      }),
      version: 1,
      migrate: (persistedState: unknown) => {
        if (!persistedState || typeof persistedState !== 'object') {
          return {
            ...baselineSnapshot,
            notifications: defaultNotifications,
          } satisfies ProgressState;
        }

        const state = persistedState as Partial<ProgressState>;
        return {
          ...baselineSnapshot,
          ...state,
          notifications: {
            ...defaultNotifications,
            ...(state.notifications ?? {}),
          },
          unlockedAchievements: mergeAchievements({
            chaptersRead: state.chaptersRead ?? baselineSnapshot.chaptersRead,
            quizScores: state.quizScores ?? baselineSnapshot.quizScores,
            streak: state.streak ?? baselineSnapshot.streak,
            difficulty: state.difficulty ?? baselineSnapshot.difficulty,
            xp: state.xp ?? baselineSnapshot.xp,
            unlockedAchievements: state.unlockedAchievements ?? baselineSnapshot.unlockedAchievements,
          }),
        } as ProgressState;
      },
    },
  ),
);

export const selectOverview = (state: ProgressState) => ({
  chaptersReadCount: state.chaptersRead.length,
  quizzesTaken: state.quizScores.length,
  averageQuizScore:
    state.quizScores.length > 0
      ? Math.round(
          state.quizScores.reduce((total, quiz) => total + quiz.lastScore, 0) / state.quizScores.length,
        )
      : null,
  difficulty: state.difficulty,
});

export const getAchievementStatus = (state: ProgressState) =>
  ACHIEVEMENT_DEFINITIONS.map((achievement) => ({
    ...achievement,
    unlocked: state.unlockedAchievements.includes(achievement.id),
  }));
