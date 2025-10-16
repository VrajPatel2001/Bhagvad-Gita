export interface ChapterDefinition {
  id: string;
  title: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedMinutes: number;
}

export interface QuizDefinition {
  quizId: string;
  title: string;
  relatedChapterId: string;
}

export const CHAPTERS: ChapterDefinition[] = [
  {
    id: 'chapter-intro-react',
    title: 'Getting Started with React',
    difficulty: 'beginner',
    estimatedMinutes: 25,
  },
  {
    id: 'chapter-state-hooks',
    title: 'State Management with Hooks',
    difficulty: 'beginner',
    estimatedMinutes: 30,
  },
  {
    id: 'chapter-routing',
    title: 'Client-side Routing Patterns',
    difficulty: 'intermediate',
    estimatedMinutes: 35,
  },
  {
    id: 'chapter-performance',
    title: 'Performance Optimisation Techniques',
    difficulty: 'intermediate',
    estimatedMinutes: 45,
  },
  {
    id: 'chapter-testing',
    title: 'Testing React Applications',
    difficulty: 'advanced',
    estimatedMinutes: 40,
  },
  {
    id: 'chapter-architecture',
    title: 'Architecting for Scale',
    difficulty: 'advanced',
    estimatedMinutes: 50,
  },
];

export const QUIZZES: QuizDefinition[] = [
  {
    quizId: 'quiz-intro-react',
    title: 'React Basics Quiz',
    relatedChapterId: 'chapter-intro-react',
  },
  {
    quizId: 'quiz-hooks',
    title: 'Hooks Mastery Quiz',
    relatedChapterId: 'chapter-state-hooks',
  },
  {
    quizId: 'quiz-routing',
    title: 'Routing Patterns Quiz',
    relatedChapterId: 'chapter-routing',
  },
];
