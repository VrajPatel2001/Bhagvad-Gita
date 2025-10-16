import { useMemo } from 'react';
import { useProgressStore } from '../store/progressStore';

const StreakCounter = () => {
  const streak = useProgressStore((state) => state.streak);
  const updateStreak = useProgressStore((state) => state.updateStreak);

  const alreadyLoggedToday = useMemo(() => {
    if (!streak.lastUpdated) {
      return false;
    }
    const last = new Date(streak.lastUpdated);
    const today = new Date();
    last.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    return last.getTime() === today.getTime();
  }, [streak.lastUpdated]);

  return (
    <div style={{ marginTop: '1.5rem' }}>
      <h3>Learning Streak</h3>
      <div className="streak">
        <div>
          <p className="small-label">Current streak</p>
          <span className="metric-value">{streak.current} days</span>
        </div>
        <div>
          <p className="small-label">Best streak</p>
          <span className="metric-value">{streak.longest} days</span>
        </div>
        <button
          className="primary-button"
          type="button"
          disabled={alreadyLoggedToday}
          onClick={() => updateStreak()}
        >
          {alreadyLoggedToday ? 'Logged Today' : `Log Today's Progress`}
        </button>
      </div>
    </div>
  );
};

export default StreakCounter;
