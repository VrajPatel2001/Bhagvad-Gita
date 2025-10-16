import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from 'react';

export type AppSection = 'home' | 'reader' | 'game';

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  focus: string;
  progress: number;
  nextChapter: string;
  type: 'reading' | 'practice';
}

export interface QuickAction {
  id: string;
  label: string;
  description: string;
  action: AppSection;
  targetLearningPathId?: string;
}

export interface UserProfile {
  name: string;
  streak: number;
  mantra: string;
}

interface AppStateValue {
  user: UserProfile;
  updateUser: (profile: Partial<UserProfile>) => void;
  activeSection: AppSection;
  setActiveSection: Dispatch<SetStateAction<AppSection>>;
  learningPaths: LearningPath[];
  updateLearningPathProgress: (pathId: string, progress: number) => void;
  selectedLearningPath: LearningPath;
  selectLearningPath: (pathId: string) => void;
  quickActions: QuickAction[];
}

const initialPaths: LearningPath[] = [
  {
    id: 'dharma-foundations',
    title: 'Foundations of Dharma',
    description:
      'Build a grounding in duties, discipline, and the balance Arjuna learns from Krishna in the early chapters.',
    focus: 'Chapters 1 – 4',
    progress: 0.62,
    nextChapter: 'Chapter 4 · Verse 13',
    type: 'reading',
  },
  {
    id: 'paths-of-yoga',
    title: 'Paths of Yoga',
    description:
      'Compare Karma, Bhakti, and Jnana yoga through scenarios that help you apply each path in daily life.',
    focus: 'Chapters 5 – 12',
    progress: 0.31,
    nextChapter: 'Chapter 7 · Verse 4',
    type: 'practice',
  },
  {
    id: 'inner-equanimity',
    title: 'Inner Equanimity',
    description:
      'Strengthen resilience with reflective prompts on detachment, surrender, and the witness mindset.',
    focus: 'Chapters 13 – 18',
    progress: 0.18,
    nextChapter: 'Chapter 14 · Verse 2',
    type: 'reading',
  },
];

const fallbackLearningPath: LearningPath = {
  id: 'choose-learning-path',
  title: 'Choose your next step',
  description: 'Select a learning path to continue exploring the Bhagavad Gita.',
  focus: 'Awaiting selection',
  progress: 0,
  nextChapter: 'Your next chapter awaits',
  type: 'reading',
};

const AppStateContext = createContext<AppStateValue | undefined>(undefined);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile>({
    name: 'Arjun',
    streak: 7,
    mantra: 'Steady in wisdom, steady in action.',
  });
  const [activeSection, setActiveSection] = useState<AppSection>('home');
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>(initialPaths);
  const [selectedLearningPathId, setSelectedLearningPathId] = useState<string>(
    initialPaths[0]?.id ?? ''
  );

  const updateUser = useCallback((profile: Partial<UserProfile>) => {
    setUser((previous) => ({ ...previous, ...profile }));
  }, []);

  const updateLearningPathProgress = useCallback(
    (pathId: string, progress: number) => {
      const safeProgress = Math.min(1, Math.max(0, progress));

      setLearningPaths((previous) =>
        previous.map((path) =>
          path.id === pathId ? { ...path, progress: safeProgress } : path
        )
      );
    },
    []
  );

  const selectLearningPath = useCallback((pathId: string) => {
    setSelectedLearningPathId(pathId);
  }, []);

  const selectedLearningPath = useMemo<LearningPath>(() => {
    return (
      learningPaths.find((path) => path.id === selectedLearningPathId) ??
      learningPaths[0] ??
      fallbackLearningPath
    );
  }, [learningPaths, selectedLearningPathId]);

  const quickActions = useMemo<QuickAction[]>(() => {
    return [
      {
        id: 'continue-reading',
        label: `Continue ${selectedLearningPath.nextChapter}`,
        description: `Return to ${selectedLearningPath.title} and pick up where you paused.`,
        action: 'reader',
        targetLearningPathId: selectedLearningPath.id,
      },
      {
        id: 'daily-scenario',
        label: 'Play today’s dharma scenario',
        description: 'Test your intuition with a fresh moral dilemma grounded in Krishna’s guidance.',
        action: 'game',
      },
      {
        id: 'reflection-log',
        label: 'Write a brief reflection',
        description: 'Capture an insight or mantra that resonated with you today.',
        action: 'home',
      },
    ];
  }, [selectedLearningPath]);

  const value = useMemo<AppStateValue>(
    () => ({
      user,
      updateUser,
      activeSection,
      setActiveSection,
      learningPaths,
      updateLearningPathProgress,
      selectedLearningPath,
      selectLearningPath,
      quickActions,
    }),
    [
      user,
      updateUser,
      activeSection,
      setActiveSection,
      learningPaths,
      updateLearningPathProgress,
      selectedLearningPath,
      selectLearningPath,
      quickActions,
    ]
  );

  return (
    <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(AppStateContext);

  if (!context) {
    throw new Error('useAppState must be used within an AppStateProvider.');
  }

  return context;
}
