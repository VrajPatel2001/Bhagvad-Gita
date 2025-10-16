import { ACHIEVEMENT_DEFINITIONS } from '../achievements/definitions';
import { useProgressStore } from '../store/progressStore';

const AchievementBadges = () => {
  const unlockedAchievements = useProgressStore((state) => state.unlockedAchievements);
  const xp = useProgressStore((state) => state.xp);

  return (
    <div>
      <div className="section-title">
        <h2>Achievements</h2>
        <span className="small-label">Total XP: {xp}</span>
      </div>
      <div className="achievement-list">
        {ACHIEVEMENT_DEFINITIONS.map((achievement) => {
          const unlocked = unlockedAchievements.includes(achievement.id);
          return (
            <div
              key={achievement.id}
              className={`list-item ${unlocked ? 'completed' : ''}`}
              aria-live="polite"
            >
              <div>
                <strong>{achievement.title}</strong>
                <p className="helper-text" style={{ margin: '0.25rem 0 0' }}>
                  {achievement.description}
                </p>
              </div>
              <div>
                <div className={`badge ${unlocked ? 'unlocked' : 'locked'}`}>
                  {unlocked ? 'Unlocked' : 'Locked'}
                </div>
                <p className="small-label" style={{ marginTop: '0.4rem', textAlign: 'right' }}>
                  Reward: {achievement.xpReward} XP
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AchievementBadges;
