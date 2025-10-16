import type { HTMLAttributes } from 'react';
import { classNames } from '../../lib/classNames';
import { Typography } from './Typography';

export interface ProgressIndicatorProps extends HTMLAttributes<HTMLDivElement> {
  label: string;
  value: number;
  helperText?: string;
  tone?: 'accent' | 'success' | 'neutral';
}

export function ProgressIndicator({
  label,
  value,
  helperText,
  tone = 'accent',
  className,
  ...rest
}: ProgressIndicatorProps) {
  const safeValue = Math.max(0, Math.min(1, value));
  const percentage = Math.round(safeValue * 100);

  return (
    <div className={classNames('progress', `progress--${tone}`, className)} {...rest}>
      <div className="progress__header">
        <Typography variant="label" className="progress__label">
          {label}
        </Typography>
        <span className="progress__value" aria-live="polite">
          {percentage}%
        </span>
      </div>
      {helperText ? (
        <Typography variant="detail" className="progress__helper">
          {helperText}
        </Typography>
      ) : null}
      <div
        className="progress__track"
        role="progressbar"
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
      >
        <span className="progress__fill" style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}
