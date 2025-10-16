import { useState } from 'react';
import { QUIZZES } from '../data/course';
import { useProgressStore } from '../store/progressStore';

const QuizTracker = () => {
  const quizScores = useProgressStore((state) => state.quizScores);
  const recordQuizScore = useProgressStore((state) => state.recordQuizScore);
  const [scores, setScores] = useState<Record<string, string>>({});

  const handleSubmit = (quizId: string, title: string) => {
    const rawScore = scores[quizId];
    if (!rawScore) return;

    const parsed = Number(rawScore);
    if (Number.isNaN(parsed)) return;

    recordQuizScore({ quizId, title, score: parsed });
    setScores((prev) => ({ ...prev, [quizId]: '' }));
  };

  return (
    <div>
      <div className="section-title">
        <h2>Quizzes</h2>
      </div>
      <div className="quiz-list">
        {QUIZZES.map((quiz) => {
          const progress = quizScores.find((item) => item.quizId === quiz.quizId);
          return (
            <div key={quiz.quizId} className="list-item">
              <div>
                <strong>{quiz.title}</strong>
                <p className="helper-text" style={{ margin: '0.35rem 0 0' }}>
                  Linked to chapter: {quiz.relatedChapterId.replace(/chapter-/g, '').replace(/-/g, ' ')}
                </p>
                {progress ? (
                  <p className="small-label" style={{ marginTop: '0.45rem' }}>
                    Attempts: {progress.attempts} · Best: {progress.bestScore}% · Last: {progress.lastScore}%
                  </p>
                ) : (
                  <p className="small-label" style={{ marginTop: '0.45rem' }}>
                    No attempts yet. Log a score to start tracking.
                  </p>
                )}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', minWidth: '180px' }}>
                <input
                  type="number"
                  min={0}
                  max={100}
                  inputMode="numeric"
                  placeholder="Score %"
                  value={scores[quiz.quizId] ?? ''}
                  onChange={(event) =>
                    setScores((prev) => ({
                      ...prev,
                      [quiz.quizId]: event.target.value,
                    }))
                  }
                  className="select-field"
                />
                <button
                  className="primary-button"
                  type="button"
                  onClick={() => handleSubmit(quiz.quizId, quiz.title)}
                  disabled={!scores[quiz.quizId]}
                >
                  Record Score
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default QuizTracker;
