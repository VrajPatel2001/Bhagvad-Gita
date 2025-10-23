"use client";

import { cn } from "@/lib/utils";
import type { GameShellProps } from "@/lib/games/types";

const SCORE_CARD_BASE =
  "flex w-full flex-col gap-1 rounded-2xl border border-pearl-200/80 bg-white/80 px-4 py-3 text-left shadow-soft transition-all duration-300 sm:w-auto";

export function GameShell({
  mode,
  level,
  score,
  streak,
  accuracy,
  progress,
  status,
  onExit,
  onRestart,
  summary,
  feedback,
  children,
}: GameShellProps) {
  const progressPercent = progress.total === 0 ? 0 : Math.min(100, Math.round((progress.current / progress.total) * 100));
  const safeAccuracy = Number.isFinite(accuracy) ? accuracy : 0;
  const accuracyDisplay = Math.round(safeAccuracy * 100);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.35em] text-peacock-700">
            <button
              type="button"
              onClick={onExit}
              className="inline-flex items-center gap-2 rounded-full border border-pearl-300 bg-white/70 px-3 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.45em] text-peacock-800 shadow-soft transition hover:border-peacock-300 hover:text-peacock-600"
            >
              ← Back
            </button>
            <span>{level.label}</span>
          </div>
          <div>
            <p className="text-sm text-ink-500">{mode.focus}</p>
            <h2 className="font-serif text-fluid-display text-peacock-900">
              {mode.name}
            </h2>
            <p className="max-w-xl text-sm text-ink-600">{mode.tagline}</p>
          </div>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <div
            className={cn(
              SCORE_CARD_BASE,
              "sm:min-w-[8rem]",
              status === "complete" && "border-peacock-300 bg-peacock-50",
            )}
            data-state={status}
          >
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-ink-500">Score</span>
            <span className="font-serif text-2xl text-peacock-900">
              {score.toLocaleString()}
            </span>
          </div>
          <div className={cn(SCORE_CARD_BASE, "sm:min-w-[7.5rem]")}>
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-ink-500">Accuracy</span>
            <span className="font-serif text-2xl text-peacock-800">{accuracyDisplay}%</span>
          </div>
          <div className={cn(SCORE_CARD_BASE, "sm:min-w-[7rem]")}>
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-ink-500">Streak</span>
            <span className="font-serif text-2xl text-saffron-700">{streak}</span>
          </div>
        </div>
      </div>

      <div className="h-2 w-full overflow-hidden rounded-full bg-pearl-200/70">
        <div
          className="h-full rounded-full bg-gradient-to-r from-peacock-500 to-saffron-500 transition-all duration-500"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {feedback ? (
        <div className="animate-pop rounded-3xl border border-pearl-200 bg-white/90 p-4 text-sm text-peacock-900 shadow-soft">
          {feedback}
        </div>
      ) : null}

      <div
        className={cn(
          "relative overflow-hidden rounded-[1.75rem] border border-pearl-200 bg-white/90 p-6 shadow-soft transition-all duration-500",
          status === "complete" && "border-peacock-200 bg-peacock-50/60",
        )}
      >
        <div className="absolute -left-20 top-10 h-32 w-32 rounded-full bg-saffron-200/30 blur-3xl" aria-hidden />
        <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-peacock-200/40 blur-3xl" aria-hidden />
        <div className="relative space-y-5 text-ink-700">{children}</div>
      </div>

      {status === "complete" && summary ? (
        <div className="animate-pop space-y-4 rounded-3xl border border-peacock-200 bg-white/95 p-6 shadow-soft">
          <div>
            <h3 className="font-serif text-2xl text-peacock-900">Level complete</h3>
            <p className="text-sm text-ink-500">
              You completed this journey with an accuracy of {Math.round(summary.accuracy * 100)}% and a
              {" "}
              {summary.streak} question streak.
            </p>
          </div>
          <dl className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-peacock-900/90 p-4 text-sand-25">
              <dt className="text-xs uppercase tracking-[0.35em] text-sand-100/80">Total Score</dt>
              <dd className="font-serif text-3xl">{summary.score.toLocaleString()}</dd>
            </div>
            <div className="rounded-2xl bg-peacock-700/90 p-4 text-sand-25">
              <dt className="text-xs uppercase tracking-[0.35em] text-sand-100/80">Bonus</dt>
              <dd className="font-serif text-3xl">{summary.bonus.toLocaleString()}</dd>
            </div>
            <div className="rounded-2xl bg-saffron-600/90 p-4 text-sand-25">
              <dt className="text-xs uppercase tracking-[0.35em] text-sand-100/80">Total Prompts</dt>
              <dd className="font-serif text-3xl">{summary.total}</dd>
            </div>
          </dl>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => onRestart?.()}
              disabled={!onRestart}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-peacock-600 px-5 py-2 text-sm font-semibold text-sand-25 shadow-soft transition hover:bg-peacock-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              ↻ Replay level
            </button>
            <button
              type="button"
              onClick={onExit}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-pearl-300 bg-white/80 px-5 py-2 text-sm font-semibold text-peacock-800 transition hover:border-peacock-300 hover:text-peacock-600"
            >
              Browse catalog
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
