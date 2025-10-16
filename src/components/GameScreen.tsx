import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  computeDifficulty,
  evaluateAnswer,
  generateQuestion,
  type FeedbackType,
  type FragmentChip,
  type GameMode,
  type GameQuestion,
  type PlayerResponse,
} from '../engine/gameEngine'
import { getModeMeta } from '../data/modes'
import { Hud } from './Hud'
import type { GameResult, GameHistoryEntry } from '../types/session'

interface GameScreenProps {
  config: { mode: GameMode; questionCount: number }
  onComplete: (result: GameResult) => void
  onExit: () => void
}

export const GameScreen = ({ config, onComplete, onExit }: GameScreenProps) => {
  const [questionIndex, setQuestionIndex] = useState(0)
  const [question, setQuestion] = useState<GameQuestion | null>(null)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [maxStreak, setMaxStreak] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [feedback, setFeedback] = useState<FeedbackType | null>(null)
  const [feedbackMessage, setFeedbackMessage] = useState('')
  const [isLocked, setIsLocked] = useState(false)
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null)
  const [selectedFragmentIds, setSelectedFragmentIds] = useState<string[]>([])

  const timerRef = useRef<number | null>(null)
  const usedVersesRef = useRef(new Set<string>())
  const historyRef = useRef<GameHistoryEntry[]>([])
  const resolvingRef = useRef(false)
  const isLockedRef = useRef(false)
  const timeRemainingRef = useRef(timeRemaining)

  useEffect(() => {
    timeRemainingRef.current = timeRemaining
  }, [timeRemaining])

  const loadQuestion = useCallback(
    (index: number, currentStreak: number) => {
      const difficulty = computeDifficulty(index, currentStreak)
      const nextQuestion = generateQuestion(config.mode, difficulty, usedVersesRef.current)
      setQuestion(nextQuestion)
      setTimeRemaining(nextQuestion.timeLimit)
      setFeedback(null)
      setFeedbackMessage('')
      setIsLocked(false)
      isLockedRef.current = false
      resolvingRef.current = false
      setSelectedOptionId(null)
      setSelectedFragmentIds([])
    },
    [config.mode],
  )

  useEffect(() => {
    loadQuestion(0, 0)
  }, [loadQuestion])

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const resolveQuestion = useCallback(
    (response: PlayerResponse, meta: { timedOut?: boolean }) => {
      if (!question || resolvingRef.current) return
      resolvingRef.current = true
      clearTimer()
      setIsLocked(true)
      isLockedRef.current = true

      const elapsedSeconds = question.timeLimit - timeRemainingRef.current
      const evaluation = evaluateAnswer(question, response, {
        streak,
        elapsedSeconds,
        timedOut: meta.timedOut,
      })

      const updatedScore = score + evaluation.scoreDelta
      const updatedMaxStreak = Math.max(maxStreak, evaluation.newStreak)
      const updatedCorrect = evaluation.isCorrect ? correctCount + 1 : correctCount

      setScore(updatedScore)
      setStreak(evaluation.newStreak)
      setMaxStreak(updatedMaxStreak)
      setCorrectCount(updatedCorrect)
      setFeedback(evaluation.feedback)
      setFeedbackMessage(evaluation.celebratoryMessage)

      const entry: GameHistoryEntry = {
        question,
        response: meta.timedOut ? null : response,
        isCorrect: evaluation.isCorrect,
        feedback: evaluation.feedback,
        scoreEarned: evaluation.scoreDelta,
        timeTaken: evaluation.timeTaken,
      }
      historyRef.current = [...historyRef.current, entry]

      const isLastQuestion = questionIndex + 1 >= config.questionCount
      const transitionDelay = evaluation.feedback === 'correct' ? 900 : 1100

      window.setTimeout(() => {
        if (isLastQuestion) {
          onComplete({
            mode: config.mode,
            totalScore: updatedScore,
            correctCount: updatedCorrect,
            questionCount: config.questionCount,
            maxStreak: updatedMaxStreak,
            history: historyRef.current,
          })
        } else {
          const nextIndex = questionIndex + 1
          setQuestionIndex(nextIndex)
          loadQuestion(nextIndex, evaluation.newStreak)
        }
      }, transitionDelay)
    },
    [
      clearTimer,
      config.mode,
      config.questionCount,
      correctCount,
      loadQuestion,
      maxStreak,
      onComplete,
      question,
      questionIndex,
      score,
      streak,
    ],
  )

  const handleTimeout = useCallback(() => {
    resolveQuestion(null, { timedOut: true })
  }, [resolveQuestion])

  useEffect(() => {
    if (!question) return
    clearTimer()
    const interval = window.setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          window.clearInterval(interval)
          handleTimeout()
          return 0
        }
        return prev - 1
      })
    }, 1000)
    timerRef.current = interval
    return () => window.clearInterval(interval)
  }, [question, handleTimeout])

  const handleOptionSelect = (optionId: string) => {
    if (isLockedRef.current || !question || question.mode === 'verse-fragments') return
    setSelectedOptionId(optionId)
    resolveQuestion(optionId, { timedOut: false })
  }

  const handleFragmentToggle = (fragmentId: string) => {
    if (isLockedRef.current) return
    setSelectedFragmentIds((prev) => {
      if (prev.includes(fragmentId)) {
        return prev.filter((id) => id !== fragmentId)
      }
      return [...prev, fragmentId]
    })
  }

  const arrangedFragments = useMemo<FragmentChip[]>(() => {
    if (!question || question.mode !== 'verse-fragments') return []
    return selectedFragmentIds
      .map((id) => question.fragments.find((chip) => chip.id === id))
      .filter((chip): chip is FragmentChip => Boolean(chip))
  }, [question, selectedFragmentIds])

  const canSubmitFragments = useMemo(() => {
    if (!question || question.mode !== 'verse-fragments') return false
    return arrangedFragments.length === question.fragments.length
  }, [arrangedFragments, question])

  const handleFragmentSubmit = () => {
    if (!question || question.mode !== 'verse-fragments' || !canSubmitFragments) return
    resolveQuestion(
      arrangedFragments.map((chip) => chip.value),
      { timedOut: false },
    )
  }

  const handleFragmentRemove = (fragmentId: string) => {
    if (isLockedRef.current) return
    setSelectedFragmentIds((prev) => prev.filter((id) => id !== fragmentId))
  }

  useEffect(() => () => clearTimer(), [])

  const modeLabel = useMemo(() => getModeMeta(config.mode)?.title ?? 'Gita Challenge', [config.mode])

  return (
    <div className="game-screen">
      {question && (
        <>
          <div className="game-screen__header">
            <Hud
              modeLabel={modeLabel}
              questionNumber={questionIndex + 1}
              questionCount={config.questionCount}
              score={score}
              streak={streak}
              maxStreak={maxStreak}
              timeRemaining={Math.max(timeRemaining, 0)}
            />
            <button type="button" className="ghost-button" onClick={onExit}>
              End run
            </button>
          </div>

          <div className={`question-card ${feedback ? `is-${feedback}` : ''}`}>
            <header>
              <p className="question-card__prompt">{question.prompt}</p>
              {question.mode === 'identify-verse' && <p className="question-card__hint">Focus on the source</p>}
              {question.mode === 'theme-match' && (
                <div className="theme-tag">
                  <span>Theme</span>
                  <strong>{question.theme}</strong>
                </div>
              )}
              {question.mode === 'verse-fragments' && (
                <p className="question-card__hint">Tap fragments to build the full verse</p>
              )}
            </header>

            <main>
              {question.mode === 'identify-verse' && (
                <div className="verse-display">
                  <blockquote>{question.displayVerse}</blockquote>
                </div>
              )}

              {question.mode !== 'verse-fragments' && (
                <div className="options-grid">
                  {question.options.map((option) => {
                    const isSelected = option.id === selectedOptionId
                    const isCorrect = feedback && option.id === question.correctOptionId
                    const isIncorrect =
                      feedback === 'incorrect' && selectedOptionId === option.id && option.id !== question.correctOptionId

                    return (
                      <button
                        key={option.id}
                        type="button"
                        className={`option ${isSelected ? 'is-selected' : ''} ${isCorrect ? 'is-correct' : ''} ${isIncorrect ? 'is-incorrect' : ''}`}
                        onClick={() => handleOptionSelect(option.id)}
                        disabled={isLocked}
                      >
                        <span className="option__label">{option.label}</span>
                        {option.helper && <span className="option__helper">{option.helper}</span>}
                      </button>
                    )
                  })}
                </div>
              )}

              {question.mode === 'verse-fragments' && (
                <div className="fragment-playground">
                  <div className="fragment-choices" aria-label="Available fragments">
                    {question.fragments.map((chip) => {
                      const isChosen = selectedFragmentIds.includes(chip.id)
                      return (
                        <button
                          key={chip.id}
                          type="button"
                          className={`fragment ${isChosen ? 'is-chosen' : ''}`}
                          onClick={() => handleFragmentToggle(chip.id)}
                          disabled={isLocked}
                        >
                          {chip.value}
                        </button>
                      )
                    })}
                  </div>
                  <div className="fragment-assembly" aria-label="Constructed verse">
                    {arrangedFragments.length === 0 ? (
                      <p className="fragment-placeholder">Select fragments to build the verse.</p>
                    ) : (
                      arrangedFragments.map((chip) => (
                        <button
                          key={chip.id}
                          type="button"
                          className="assembled-fragment"
                          onClick={() => handleFragmentRemove(chip.id)}
                          disabled={isLocked}
                        >
                          {chip.value}
                        </button>
                      ))
                    )}
                  </div>
                  <div className="fragment-actions">
                    <button type="button" className="ghost-button" onClick={() => setSelectedFragmentIds([])} disabled={isLocked}>
                      Reset
                    </button>
                    <button
                      type="button"
                      className="cta"
                      onClick={handleFragmentSubmit}
                      disabled={!canSubmitFragments || isLocked}
                    >
                      Lock my arrangement
                    </button>
                  </div>
                </div>
              )}
            </main>
          </div>

          {feedbackMessage && (
            <div className={`feedback-banner ${feedback ? `is-${feedback}` : ''}`}>{feedbackMessage}</div>
          )}
        </>
      )}
    </div>
  )
}

export default GameScreen
