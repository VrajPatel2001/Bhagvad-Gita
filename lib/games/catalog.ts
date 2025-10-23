import type { GameCatalogSection, GameModeDefinition, GameModeId } from "./types";

export const GAME_MODES: GameModeDefinition[] = [
  {
    id: "quiz",
    name: "Wisdom Quiz",
    tagline: "Test your recall of the Gita's key teachings.",
    description:
      "Answer multiple-choice prompts drawn from translations and chapter insights to strengthen recall and comprehension.",
    icon: "🧠",
    accentFrom: "from-lotus-100",
    accentTo: "to-peacock-100",
    focus: "Verse comprehension",
    levels: [
      {
        id: "quiz-gentle",
        label: "Gentle Start",
        description: "Five reflective prompts with focused options.",
        difficulty: "gentle",
        questionCount: 5,
        options: 3,
        timeLimitSeconds: 180,
      },
      {
        id: "quiz-steady",
        label: "Steady Flow",
        description: "Eight questions spanning chapters one through twelve.",
        difficulty: "steady",
        questionCount: 8,
        options: 4,
        timeLimitSeconds: 210,
      },
      {
        id: "quiz-intense",
        label: "Deep Immersion",
        description: "Twelve prompts with nuanced answer choices across the full text.",
        difficulty: "intense",
        questionCount: 12,
        options: 5,
        timeLimitSeconds: 260,
      },
    ],
  },
  {
    id: "chapter-match",
    name: "Verse to Chapter",
    tagline: "Identify where each teaching resides.",
    description:
      "Match verse excerpts to their home chapters to sharpen your sense of the Gita's narrative arc.",
    icon: "🧭",
    accentFrom: "from-peacock-50",
    accentTo: "to-saffron-200",
    focus: "Context recognition",
    levels: [
      {
        id: "chapter-gentle",
        label: "Guided Recognition",
        description: "Six verses with nearby chapters as options.",
        difficulty: "gentle",
        questionCount: 6,
        options: 4,
      },
      {
        id: "chapter-steady",
        label: "Steady Mapping",
        description: "Nine excerpts weaving early and middle teachings.",
        difficulty: "steady",
        questionCount: 9,
        options: 5,
      },
      {
        id: "chapter-intense",
        label: "Scholar's Challenge",
        description: "Twelve verses crossing the entire narrative.",
        difficulty: "intense",
        questionCount: 12,
        options: 6,
      },
    ],
  },
  {
    id: "translation-match",
    name: "Translation Alignment",
    tagline: "Link each translation to its language.",
    description:
      "Connect Sanskrit, Hindi, and English renderings to appreciate language nuance and translator voice.",
    icon: "🔗",
    accentFrom: "from-peacock-200",
    accentTo: "to-lotus-100",
    focus: "Language fluency",
    levels: [
      {
        id: "translation-gentle",
        label: "Single Verse Set",
        description: "Match three translations for one verse at a time.",
        difficulty: "gentle",
        questionCount: 3,
        verseBatch: 1,
      },
      {
        id: "translation-steady",
        label: "Dual Verse Flow",
        description: "Two verses per round introduce subtle differences.",
        difficulty: "steady",
        questionCount: 4,
        verseBatch: 2,
      },
      {
        id: "translation-intense",
        label: "Scholarly Bridge",
        description: "Five challenging rounds blending nuanced vocabulary.",
        difficulty: "intense",
        questionCount: 5,
        verseBatch: 2,
      },
    ],
  },
  {
    id: "fill-blank",
    name: "Fill the Wisdom",
    tagline: "Restore key words within poignant verses.",
    description:
      "Complete pivotal phrases by identifying missing words from English translations.",
    icon: "✍️",
    accentFrom: "from-saffron-200",
    accentTo: "to-peacock-200",
    focus: "Vocabulary recall",
    levels: [
      {
        id: "blank-gentle",
        label: "Highlighted Support",
        description: "Six verses with guiding choices to rebuild.",
        difficulty: "gentle",
        questionCount: 6,
        options: 3,
      },
      {
        id: "blank-steady",
        label: "Flowing Lines",
        description: "Eight verses with nuanced vocabulary shifts.",
        difficulty: "steady",
        questionCount: 8,
        options: 4,
      },
      {
        id: "blank-intense",
        label: "Immersive Recall",
        description: "Ten verses with richer distractors and phrasing.",
        difficulty: "intense",
        questionCount: 10,
        options: 5,
      },
    ],
  },
  {
    id: "memory",
    name: "Memory Pairs",
    tagline: "Pair teachings across language and form.",
    description:
      "Flip cards to connect transliterations with their companion translations and consolidate memory.",
    icon: "🪷",
    accentFrom: "from-peacock-700",
    accentTo: "to-saffron-500",
    focus: "Spatial recall",
    levels: [
      {
        id: "memory-gentle",
        label: "Three Pair Bloom",
        description: "Match three calming pairs with ample time.",
        difficulty: "gentle",
        questionCount: 3,
        pairs: 3,
      },
      {
        id: "memory-steady",
        label: "Six Pair Garden",
        description: "Six pairs spanning pivotal teachings.",
        difficulty: "steady",
        questionCount: 6,
        pairs: 6,
      },
      {
        id: "memory-intense",
        label: "Eight Pair Constellation",
        description: "Eight pairs blending early and late insights.",
        difficulty: "intense",
        questionCount: 8,
        pairs: 8,
      },
    ],
  },
];

export const GAME_MODE_MAP: Record<GameModeId, GameModeDefinition> = GAME_MODES.reduce(
  (acc, mode) => {
    acc[mode.id] = mode;
    return acc;
  },
  {} as Record<GameModeId, GameModeDefinition>,
);

export const GAME_CATALOG_SECTIONS: GameCatalogSection[] = [
  {
    title: "Recall & Insight",
    description:
      "Strengthen understanding of translated teachings and deepen vocabulary memory.",
    modes: [GAME_MODE_MAP.quiz, GAME_MODE_MAP["fill-blank"]],
  },
  {
    title: "Connections & Context",
    description: "Link verses to their chapters, languages, and cross-lingual pairs.",
    modes: [
      GAME_MODE_MAP["chapter-match"],
      GAME_MODE_MAP["translation-match"],
      GAME_MODE_MAP.memory,
    ],
  },
];
