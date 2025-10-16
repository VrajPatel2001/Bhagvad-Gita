interface HudProps {
  questionNumber: number
  questionCount: number
  score: number
  streak: number
  maxStreak: number
  timeRemaining: number
  modeLabel: string
}

export const Hud = ({
  questionNumber,
  questionCount,
  score,
  streak,
  maxStreak,
  timeRemaining,
  modeLabel,
}: HudProps) => {
  const progress = Math.round((questionNumber / questionCount) * 100)
  const clampedTime = Math.max(timeRemaining, 0)
  return (
    <section className="hud" aria-live="polite">
      <div className="hud__left">
        <p className="hud__mode">{modeLabel}</p>
        <p className="hud__progress">
          Question {questionNumber} / {questionCount}
        </p>
        <div className="hud__bar">
          <div className="hud__bar-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>
      <div className="hud__center">
        <div className="hud__metric">
          <span className="label">Score</span>
          <span className="value">{score}</span>
        </div>
        <div className="hud__metric">
          <span className="label">Streak</span>
          <span className="value">{streak}</span>
        </div>
        <div className="hud__metric">
          <span className="label">Best</span>
          <span className="value">{maxStreak}</span>
        </div>
      </div>
      <div className={`hud__timer ${clampedTime <= 5 ? 'is-critical' : ''}`}>
        <span className="label">Time</span>
        <span className="value">{clampedTime}s</span>
      </div>
    </section>
  )
}

export default Hud
