import { useMemo, useState } from 'react'
import type { GameMode } from '../engine/gameEngine'
import { getModeMeta, modeMeta } from '../data/modes'

interface LobbyScreenProps {
  onStart: (config: { mode: GameMode; questionCount: number }) => void
}

const QUESTION_PRESETS = [5, 8, 12]

export const LobbyScreen = ({ onStart }: LobbyScreenProps) => {
  const [selectedMode, setSelectedMode] = useState<GameMode>('identify-verse')
  const [questionCount, setQuestionCount] = useState<number>(QUESTION_PRESETS[1])

  const activeDescriptor = useMemo(() => getModeMeta(selectedMode) ?? modeMeta[0], [selectedMode])

  return (
    <div className="lobby-screen">
      <header className="lobby-hero">
        <span className="badge">Interactive Gita Practice</span>
        <h1>Discover, connect, and level up your Gita mastery.</h1>
        <p>
          Choose a game mode to explore the teachings through dynamic, replayable challenges. Earn
          streaks, race the timer, and watch your insight grow with every round.
        </p>
      </header>

      <section className="mode-grid" aria-label="Game modes">
        {modeMeta.map((mode) => {
          const isActive = mode.mode === selectedMode
          return (
            <button
              key={mode.mode}
              type="button"
              className={`mode-card ${isActive ? 'active' : ''}`}
              style={{ borderColor: isActive ? mode.accent : 'transparent' }}
              onClick={() => setSelectedMode(mode.mode)}
            >
              <div className="mode-card__top">
                <span className="mode-card__subtitle" style={{ color: mode.accent }}>
                  {mode.subtitle}
                </span>
                <h2>{mode.title}</h2>
              </div>
              <p className="mode-card__description">{mode.description}</p>
              <ul>
                {mode.highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
            </button>
          )
        })}
      </section>

      <section className="session-controls" aria-label="Session difficulty">
        <span className="section-label">Round length</span>
        <div className="toggle-group">
          {QUESTION_PRESETS.map((count) => {
            const active = count === questionCount
            return (
              <button
                key={count}
                type="button"
                className={`toggle ${active ? 'is-active' : ''}`}
                onClick={() => setQuestionCount(count)}
              >
                {count} questions
              </button>
            )
          })}
        </div>
      </section>

      <footer className="lobby-footer">
        <div className="descriptor">
          <p className="descriptor__title">{activeDescriptor.title}</p>
          <p className="descriptor__copy">{activeDescriptor.description}</p>
        </div>
        <button
          type="button"
          className="cta"
          onClick={() => onStart({ mode: selectedMode, questionCount })}
        >
          Enter the arena
        </button>
      </footer>
    </div>
  )
}

export default LobbyScreen
