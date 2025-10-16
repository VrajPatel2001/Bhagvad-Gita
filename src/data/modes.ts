import type { GameMode } from '../engine/gameEngine'

export interface ModeMeta {
  mode: GameMode
  title: string
  subtitle: string
  description: string
  highlights: string[]
  accent: string
}

export const modeMeta: ModeMeta[] = [
  {
    mode: 'identify-verse',
    title: 'Verse Voyager',
    subtitle: 'Pinpoint the source',
    description: 'Read a teaching and name the exact chapter and verse before the clock winds down.',
    highlights: ['Multiple-choice strategy', 'Steadily intensifying timer', 'Build streaks for bonus points'],
    accent: '#ffb347',
  },
  {
    mode: 'theme-match',
    title: 'Theme Tracker',
    subtitle: 'Follow the thread',
    description: 'Match core Bhagavad Gita themes to the passages that embody them.',
    highlights: ['Spot nuanced teachings', 'Sharpen pattern recognition', 'Unlock synergy bonuses'],
    accent: '#9d84ff',
  },
  {
    mode: 'verse-fragments',
    title: 'Fragment Forge',
    subtitle: 'Rebuild the wisdom',
    description: 'Reassemble shuffled verse fragments and feel the insight click into place.',
    highlights: ['Tap-to-arrange gameplay', 'Mindful recollection', 'Extended timer for deep focus'],
    accent: '#5ed1b3',
  },
]

export const getModeMeta = (mode: GameMode) => modeMeta.find((entry) => entry.mode === mode)
