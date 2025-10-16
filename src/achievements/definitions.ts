import type { ProgressSnapshot } from '../types/progress';

export interface AchievementDefinition {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  criteria: (snapshot: ProgressSnapshot) => boolean;
}

export const ACHIEVEMENT_DEFINITIONS: AchievementDefinition[] = [
  {
    id: 'first-steps',
    title: 'First Steps',
    description: 'Complete your first chapter to get started.',
    xpReward: 50,
    criteria: (snapshot) => snapshot.chaptersRead.length >= 1,
  },
  {
    id: 'consistent-learner',
    title: 'Consistent Learner',
    description: 'Maintain a 3-day learning streak.',
    xpReward: 80,
    criteria: (snapshot) => snapshot.streak.current >= 3,
  },
  {
    id: 'streak-champion',
    title: 'Streak Champion',
    description: 'Reach a 7-day streak.',
    xpReward: 120,
    criteria: (snapshot) => snapshot.streak.current >= 7,
  },
  {
    id: 'quiz-whiz',
    title: 'Quiz Whiz',
    description: 'Score at least 80% on any quiz.',
    xpReward: 90,
    criteria: (snapshot) => snapshot.quizScores.some((quiz) => quiz.bestScore >= 80),
  },
  {
    id: 'perfectionist',
    title: 'Perfectionist',
    description: 'Ace a quiz with a perfect score.',
    xpReward: 150,
    criteria: (snapshot) => snapshot.quizScores.some((quiz) => quiz.bestScore === 100),
  },
  {
    id: 'chapter-completionist',
    title: 'Chapter Completionist',
    description: 'Complete five chapters.',
    xpReward: 130,
    criteria: (snapshot) => snapshot.chaptersRead.length >= 5,
  },
  {
    id: 'level-up',
    title: 'Level Up',
    description: 'Accumulate 500 XP from your studies.',
    xpReward: 200,
    criteria: (snapshot) => snapshot.xp >= 500,
  },
];

export const evaluateAchievements = (snapshot: ProgressSnapshot): string[] => {
  const unlocked = new Set(snapshot.unlockedAchievements);

  for (const achievement of ACHIEVEMENT_DEFINITIONS) {
    if (!unlocked.has(achievement.id) && achievement.criteria(snapshot)) {
      unlocked.add(achievement.id);
    }
  }

  return Array.from(unlocked);
};
