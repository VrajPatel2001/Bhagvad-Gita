import { useMemo } from 'react'
import { getModeMeta } from '../data/modes'
import type { GameResult } from '../types/session'

interface ResultsScreenProps {
  result: GameResult
  onReplay: () => void
  onReturnToLobby: () => void
}

export const ResultsScreen = ({ result, onReplay, onReturnToLobby }: ResultsScreenProps) => {
  const { mode, totalScore, correctCount, questionCount, maxStreak, history } = result
  const accuracy = Math.round((correctCount / questionCount) * 100)
  const modeDescriptor = useMemo(() => getModeMeta(mode), [mode])

  const highlight = useMemo(() => {
    if (accuracy === 100) return 'Flawless victory! The wisdom flows effortlessly.'
    if (accuracy >= 80) return 'Brilliant performance—your study is shining through.'
    if (accuracy >= 60) return 'Solid round. A little more focus will ignite mastery.'
    return 'Every attempt plants a seed. Keep exploring with curiosity.'
  }, [accuracy])

  return (
    <div className="results-screen">
      <header className="results-header">
        <span className="badge">Round summary</span>
        <h1>{modeDescriptor?.title ?? 'Gita Session Complete'}</h1>
        <p>{highlight}</p>
      </header>

      <section className="results-metrics">
        <div className="metric">
          <span className="label">Score</span>
          <span className="value">{totalScore}</span>
        </div>
        <div className="metric">
          <span className="label">Accuracy</span>
          <span className="value">{accuracy}%</span>
        </div>
        <div className="metric">
          <span className="label">Correct</span>
          <span className="value">
            {correctCount}/{questionCount}
          </span>
        </div>
        <div className="metric">
          <span className="label">Best streak</span>
          <span className="value">{maxStreak}</span>
        </div>
      </section>

      <section className="results-history" aria-label="Question breakdown">
        <h2>Journey recap</h2>
        <ul>
          {history.map((entry, index) => {
            const questionNumber = index + 1
            const { question } = entry
            const isChoice = question.mode !== 'verse-fragments'

            let playerAnswerText = '—'
            let correctAnswerText = ''

            if (question.mode === 'verse-fragments') {
              correctAnswerText = question.verse.text
              if (Array.isArray(entry.response) && entry.response.length > 0) {
                playerAnswerText = entry.response.join(' ')
              }
            } else {
              const correctOption = question.options.find((option) => option.id === question.correctOptionId)
              const playerOption =
                typeof entry.response === 'string'
                  ? question.options.find((option) => option.id === entry.response)
                  : undefined

              if (question.mode === 'theme-match') {
                correctAnswerText = correctOption?.helper ?? correctOption?.label ?? ''
                playerAnswerText = playerOption?.helper ?? playerOption?.label ?? playerAnswerText
              } else {
                correctAnswerText = correctOption?.label ?? ''
                playerAnswerText = playerOption?.label ?? playerAnswerText
              }
            }

            if (!correctAnswerText) {
              correctAnswerText = `Chapter ${question.verse.chapter} • Verse ${question.verse.verse}`
            }

            const statusLabel = entry.isCorrect ? 'Correct' : entry.feedback === 'timeout' ? 'Timed out' : 'Missed'

            return (
              <li key={question.id} className={`history-card is-${entry.feedback}`}>
                <header>
                  <span className="question-number">Q{questionNumber}</span>
                  <span className="status">{statusLabel}</span>
                </header>
                <p className="history-question">{question.prompt}</p>
                <div className="history-detail">
                  <p className="history-heading">{isChoice ? 'Passage' : 'Completed verse'}</p>
                  <blockquote>{question.verse.text}</blockquote>
                </div>
                <div className="history-response-grid">
                  <div>
                    <p className="history-heading">Your answer</p>
                    <p className="history-answer">{playerAnswerText}</p>
                  </div>
                  <div>
                    <p className="history-heading">Correct insight</p>
                    <p className="history-answer">{correctAnswerText}</p>
                  </div>
                </div>
                <footer>
                  <p className="history-heading">Takeaway</p>
                  <p>{question.verse.takeaway}</p>
                  <p className="history-meta">
                    +{entry.scoreEarned} pts • {Math.round(entry.timeTaken)}s
                  </p>
                </footer>
              </li>
            )
          })}
        </ul>
      </section>

      <footer className="results-actions">
        <button type="button" className="cta" onClick={onReplay}>
          Play again
        </button>
        <button type="button" className="ghost-button" onClick={onReturnToLobby}>
          Change mode
        </button>
      </footer>
    </div>
  )
}

export default ResultsScreen
