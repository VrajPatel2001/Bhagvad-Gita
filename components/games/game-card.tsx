"use client";

import type { GameLevel, GameModeDefinition } from "@/lib/games/types";

interface GameCardProps {
  mode: GameModeDefinition;
  onSelect: (mode: GameModeDefinition, level: GameLevel) => void;
}

export function GameCard({ mode, onSelect }: GameCardProps) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-pearl-200 bg-white/85 p-6 shadow-soft transition hover:-translate-y-1 hover:border-peacock-200">
      <div className="absolute -right-20 top-10 h-40 w-40 rounded-full bg-peacock-200/30 blur-3xl transition group-hover:bg-peacock-200/50" aria-hidden />
      <div className="absolute -left-16 bottom-8 h-40 w-40 rounded-full bg-saffron-200/25 blur-3xl transition group-hover:bg-saffron-200/40" aria-hidden />
      <div className="relative flex flex-col gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-peacock-900/90 text-2xl text-sand-25 shadow-soft">
          {mode.icon}
        </span>
        <h3 className="font-serif text-fluid-heading text-peacock-900">{mode.name}</h3>
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-peacock-700">{mode.tagline}</p>
        <p className="text-sm text-ink-600">{mode.description}</p>
        <div className="mt-3 space-y-3">
          {mode.levels.map((level) => (
            <button
              key={level.id}
              type="button"
              onClick={() => onSelect(mode, level)}
              className="flex w-full flex-col gap-1 rounded-2xl border border-pearl-200 bg-white/80 px-4 py-3 text-left text-sm transition hover:border-peacock-200 hover:bg-peacock-50/80"
            >
              <span className="flex items-center justify-between text-sm font-semibold text-peacock-900">
                {level.label}
                <span className="text-xs uppercase tracking-[0.35em] text-saffron-600">{level.difficulty}</span>
              </span>
              <span className="text-xs text-ink-500">{level.description}</span>
            </button>
          ))}
        </div>
      </div>
    </article>
  );
}
