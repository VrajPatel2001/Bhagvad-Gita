import { useMemo } from 'react';
import { useProgressStore } from '../store/progressStore';

const computeLevelProgress = (xp: number) => {
  let level = 1;
  let xpThreshold = 300;
  let remaining = xp;

  while (remaining >= xpThreshold) {
    remaining -= xpThreshold;
    level += 1;
    xpThreshold += 150;
  }

  const progress = xpThreshold === 0 ? 0 : Math.min(1, remaining / xpThreshold);

  return {
    level,
    xpThreshold,
    xpIntoLevel: remaining,
    progress,
  };
};

const XPProgress = () => {
  const xp = useProgressStore((state) => state.xp);

  const { level, xpThreshold, xpIntoLevel, progress } = useMemo(() => computeLevelProgress(xp), [xp]);

  return (
    <div style={{ marginTop: '1.5rem' }}>
      <h3>Experience Progress</h3>
      <p className="small-label" style={{ marginBottom: '0.4rem' }}>
        Level {level} · {xpIntoLevel} / {xpThreshold} XP to next level
      </p>
      <div className="xp-bar" aria-valuemin={0} aria-valuemax={xpThreshold} aria-valuenow={xpIntoLevel} role="progressbar">
        <div className="xp-bar-fill" style={{ width: `${Math.round(progress * 100)}%` }} />
      </div>
    </div>
  );
};

export default XPProgress;
