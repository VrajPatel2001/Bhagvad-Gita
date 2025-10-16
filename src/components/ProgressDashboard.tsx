import { selectOverview, useProgressStore } from '../store/progressStore';
import type { DifficultyLevel } from '../types/progress';

const difficultyLabels: Record<DifficultyLevel, string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
};

const ProgressDashboard = () => {
  const overview = useProgressStore(selectOverview);
  const setDifficulty = useProgressStore((state) => state.setDifficulty);
  const quizzes = useProgressStore((state) => state.quizScores);

  const totalAttempts = quizzes.reduce((total, quiz) => total + quiz.attempts, 0);

  return (
    <div>
      <div className="section-title">
        <h2>Progress Overview</h2>
        <div>
          <label className="small-label" htmlFor="difficulty-select">
            Preferred Difficulty
          </label>
          <select
            id="difficulty-select"
            value={overview.difficulty}
            className="select-field"
            onChange={(event) => setDifficulty(event.target.value as DifficultyLevel)}
          >
            {Object.entries(difficultyLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="metric-grid">
        <div className="metric-tile">
          <strong>Chapters Completed</strong>
          <span className="metric-value">{overview.chaptersReadCount}</span>
          <span className="small-label">Keep unlocking new chapters to earn XP.</span>
        </div>
        <div className="metric-tile">
          <strong>Quizzes Attempted</strong>
          <span className="metric-value">{totalAttempts}</span>
          <span className="small-label">Retrain your knowledge and boost your streak.</span>
        </div>
        <div className="metric-tile">
          <strong>Average Quiz Score</strong>
          <span className="metric-value">
            {overview.averageQuizScore !== null ? `${overview.averageQuizScore}%` : '–'}
          </span>
          <span className="small-label">Aim for 80%+ to unlock Quiz Whiz.</span>
        </div>
      </div>
    </div>
  );
};

export default ProgressDashboard;
