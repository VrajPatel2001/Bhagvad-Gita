import { verseBank, type Verse } from '../data/verseBank'

export type DifficultyLevel = 1 | 2 | 3
export type GameMode = 'identify-verse' | 'theme-match' | 'verse-fragments'

export interface ChoiceOption {
  id: string
  label: string
  helper?: string
}

export interface FragmentChip {
  id: string
  value: string
}

interface QuestionBase<M extends GameMode> {
  id: string
  mode: M
  difficulty: DifficultyLevel
  prompt: string
  verse: Verse
  timeLimit: number
}

export interface IdentifyVerseQuestion extends QuestionBase<'identify-verse'> {
  displayVerse: string
  options: ChoiceOption[]
  correctOptionId: string
}

export interface ThemeMatchQuestion extends QuestionBase<'theme-match'> {
  theme: string
  options: ChoiceOption[]
  correctOptionId: string
}

export interface VerseFragmentsQuestion extends QuestionBase<'verse-fragments'> {
  fragments: FragmentChip[]
  correctAnswerText: string
}

export type GameQuestion = IdentifyVerseQuestion | ThemeMatchQuestion | VerseFragmentsQuestion

export type PlayerResponse = string | string[] | null

export type FeedbackType = 'correct' | 'incorrect' | 'timeout'

export interface EvaluationResult {
  isCorrect: boolean
  feedback: FeedbackType
  newStreak: number
  scoreDelta: number
  timeTaken: number
  correctAnswerLabel: string
  celebratoryMessage: string
}

const difficultyProfile = {
  1: { optionCount: 3, baseScore: 110, timeLimit: 45 },
  2: { optionCount: 4, baseScore: 140, timeLimit: 35 },
  3: { optionCount: 5, baseScore: 175, timeLimit: 25 },
} satisfies Record<DifficultyLevel, { optionCount: number; baseScore: number; timeLimit: number }>

const fragmentTimeProfile: Record<DifficultyLevel, number> = {
  1: 60,
  2: 50,
  3: 40,
}

const createId = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `id-${Math.random().toString(36).slice(2, 10)}-${Date.now()}`

const shuffle = <T,>(input: T[]): T[] => {
  const result = [...input]
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

const pickVerse = (used: Set<string>) => {
  const pool = verseBank.filter((verse) => !used.has(verse.id))
  if (pool.length === 0) {
    used.clear()
    pool.push(...verseBank)
  }
  const verse = pool[Math.floor(Math.random() * pool.length)]
  used.add(verse.id)
  return verse
}

const formatChapterAndVerse = (verse: Verse) => `Chapter ${verse.chapter} • Verse ${verse.verse}`

const normalizeText = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const splitVerseIntoFragments = (text: string, difficulty: DifficultyLevel): string[] => {
  const cleaned = text.replace(/[“”]/g, '"').replace(/\s+/g, ' ').trim()
  const words = cleaned.split(' ')

  const targetFragments = difficulty === 1 ? 4 : difficulty === 2 ? 5 : Math.min(7, Math.max(5, Math.ceil(words.length / 2)))
  const fragmentSize = Math.max(1, Math.floor(words.length / targetFragments))

  const fragments: string[] = []
  for (let i = 0; i < words.length; i += fragmentSize) {
    const chunk = words.slice(i, i + fragmentSize).join(' ')
    fragments.push(chunk)
  }

  if (fragments.length < 3) {
    return words
  }

  return fragments.map((fragment) => fragment.trim()).filter((fragment) => fragment.length > 0)
}

const buildIdentifyVerseQuestion = (
  difficulty: DifficultyLevel,
  usedVerses: Set<string>,
): IdentifyVerseQuestion => {
  const verse = pickVerse(usedVerses)
  const profile = difficultyProfile[difficulty]

  const distractors = shuffle(verseBank.filter((entry) => entry.id !== verse.id)).slice(
    0,
    profile.optionCount - 1,
  )

  const options: ChoiceOption[] = shuffle([
    { id: verse.id, label: formatChapterAndVerse(verse) },
    ...distractors.map((entry) => ({ id: entry.id, label: formatChapterAndVerse(entry) })),
  ])

  return {
    id: createId(),
    mode: 'identify-verse',
    difficulty,
    prompt: 'Identify the chapter and verse for this teaching.',
    verse,
    displayVerse: verse.text,
    options,
    correctOptionId: verse.id,
    timeLimit: profile.timeLimit,
  }
}

const buildThemeMatchQuestion = (
  difficulty: DifficultyLevel,
  usedVerses: Set<string>,
): ThemeMatchQuestion => {
  const verse = pickVerse(usedVerses)
  const profile = difficultyProfile[difficulty]

  const distractors = shuffle(
    verseBank.filter((entry) => entry.id !== verse.id && entry.theme !== verse.theme),
  ).slice(0, profile.optionCount - 1)

  const options: ChoiceOption[] = shuffle([
    { id: verse.id, label: verse.text, helper: formatChapterAndVerse(verse) },
    ...distractors.map((entry) => ({ id: entry.id, label: entry.text, helper: formatChapterAndVerse(entry) })),
  ])

  const promptBase =
    difficulty === 1
      ? 'Choose the verse that best fits this theme.'
      : 'Match the theme with the most aligned verse passage.'

  return {
    id: createId(),
    mode: 'theme-match',
    difficulty,
    prompt: promptBase,
    verse,
    theme: verse.theme,
    options,
    correctOptionId: verse.id,
    timeLimit: profile.timeLimit + 5,
  }
}

const buildVerseFragmentsQuestion = (
  difficulty: DifficultyLevel,
  usedVerses: Set<string>,
): VerseFragmentsQuestion => {
  const verse = pickVerse(usedVerses)
  const fragments = splitVerseIntoFragments(verse.text, difficulty)
  const fragmentChips: FragmentChip[] = shuffle(
    fragments.map((value, index) => ({ id: `${verse.id}-${index}`, value })),
  )

  return {
    id: createId(),
    mode: 'verse-fragments',
    difficulty,
    prompt: 'Reassemble the verse by tapping the fragments in the correct order.',
    verse,
    fragments: fragmentChips,
    correctAnswerText: verse.text,
    timeLimit: fragmentTimeProfile[difficulty],
  }
}

export const generateQuestion = (
  mode: GameMode,
  difficulty: DifficultyLevel,
  usedVerses: Set<string>,
): GameQuestion => {
  switch (mode) {
    case 'identify-verse':
      return buildIdentifyVerseQuestion(difficulty, usedVerses)
    case 'theme-match':
      return buildThemeMatchQuestion(difficulty, usedVerses)
    case 'verse-fragments':
      return buildVerseFragmentsQuestion(difficulty, usedVerses)
    default:
      return buildIdentifyVerseQuestion(difficulty, usedVerses)
  }
}

export const computeDifficulty = (questionIndex: number, streak: number): DifficultyLevel => {
  const streakBoost = streak >= 4 ? 1 : 0
  const progressive = Math.floor(questionIndex / 3)
  const raw = 1 + streakBoost + progressive
  if (raw >= 3) return 3
  if (raw <= 1) return 1
  return 2
}

interface EvaluateOptions {
  streak: number
  elapsedSeconds?: number
  timedOut?: boolean
}

export const evaluateAnswer = (
  question: GameQuestion,
  rawResponse: PlayerResponse,
  options: EvaluateOptions,
): EvaluationResult => {
  const { streak, elapsedSeconds = question.timeLimit, timedOut = false } = options
  const timeTaken = Math.min(elapsedSeconds, question.timeLimit)

  let isCorrect = false
  if (!timedOut && rawResponse !== null) {
    if (question.mode === 'verse-fragments') {
      const responseFragments = Array.isArray(rawResponse) ? rawResponse : []
      const assembled = responseFragments.join(' ')
      isCorrect = normalizeText(assembled) === normalizeText(question.correctAnswerText)
    } else {
      const choiceId = typeof rawResponse === 'string' ? rawResponse : ''
      isCorrect = choiceId === question.correctOptionId
    }
  }

  const feedback: FeedbackType = timedOut ? 'timeout' : isCorrect ? 'correct' : 'incorrect'
  const newStreak = isCorrect ? streak + 1 : 0

  const profile = difficultyProfile[question.difficulty]
  const difficultyMultiplier = 1 + (question.difficulty - 1) * 0.35
  const timeBonus = isCorrect ? Math.max(0, Math.round((question.timeLimit - timeTaken) * 5)) : 0
  const streakBonus = isCorrect ? streak * 12 : 0
  const baseScore = question.mode === 'verse-fragments' ? profile.baseScore + 25 : profile.baseScore
  const scoreDelta = isCorrect ? Math.round(baseScore * difficultyMultiplier + streakBonus + timeBonus) : 0

  return {
    isCorrect,
    feedback,
    newStreak,
    scoreDelta,
    timeTaken,
    correctAnswerLabel:
      question.mode === 'identify-verse'
        ? `${formatChapterAndVerse(question.verse)} — ${question.verse.text}`
        : question.mode === 'theme-match'
          ? `${question.verse.text} (${formatChapterAndVerse(question.verse)})`
          : question.correctAnswerText,
    celebratoryMessage: isCorrect
      ? question.verse.takeaway
      : timedOut
        ? 'Time slipped away—steady the breath and try again.'
        : `Remember: ${question.verse.takeaway}`,
  }
}
