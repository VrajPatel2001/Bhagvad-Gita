"use client";

import { useMemo, useState } from "react";

import { GameCard } from "./game-card";
import type { GameLevel, GameModeDefinition, ModeComponentProps } from "@/lib/games/types";
import { GAME_CATALOG_SECTIONS } from "@/lib/games/catalog";
import type { GameModeId } from "@/lib/games/types";

import { ChapterMatchMode } from "./modes/chapter-match-mode";
import { FillBlankMode } from "./modes/fill-blank-mode";
import { MemoryMode } from "./modes/memory-mode";
import { QuizMode } from "./modes/quiz-mode";
import { TranslationMatchMode } from "./modes/translation-match-mode";

const MODE_COMPONENTS: Record<GameModeId, (props: ModeComponentProps) => JSX.Element> = {
  quiz: QuizMode,
  "chapter-match": ChapterMatchMode,
  "translation-match": TranslationMatchMode,
  "fill-blank": FillBlankMode,
  memory: MemoryMode,
};

export function GamesExperience() {
  const [activeMode, setActiveMode] = useState<GameModeDefinition | null>(null);
  const [activeLevel, setActiveLevel] = useState<GameLevel | null>(null);
  const [sessionIndex, setSessionIndex] = useState(0);

  const modeComponent = useMemo(() => {
    if (!activeMode) {
      return null;
    }

    return MODE_COMPONENTS[activeMode.id];
  }, [activeMode]);

  const handleSelectLevel = (mode: GameModeDefinition, level: GameLevel) => {
    setActiveMode(mode);
    setActiveLevel(level);
    setSessionIndex((value) => value + 1);
  };

  const handleExit = () => {
    setActiveMode(null);
    setActiveLevel(null);
  };

  if (activeMode && activeLevel && modeComponent) {
    const ModeComponent = modeComponent;
    return (
      <div className="space-y-8">
        <ModeComponent
          key={`${activeMode.id}-${activeLevel.id}-${sessionIndex}`}
          mode={activeMode}
          level={activeLevel}
          onExit={handleExit}
          onRestart={() => setSessionIndex((value) => value + 1)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <section className="relative overflow-hidden rounded-[2.25rem] border border-pearl-200 bg-gradient-to-br from-peacock-900 via-peacock-700 to-peacock-600 p-10 text-sand-25 shadow-soft">
        <div className="absolute -left-24 bottom-0 h-56 w-56 rounded-full bg-saffron-400/20 blur-3xl" aria-hidden />
        <div className="absolute -right-16 -top-10 h-52 w-52 rounded-full bg-lotus-200/30 blur-3xl" aria-hidden />
        <div className="relative grid gap-6 md:grid-cols-[1.4fr,1fr] md:items-center">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-sand-200/70">Playful study</p>
            <h1 className="font-serif text-4xl leading-tight text-white sm:text-5xl">
              Core educational games catalog
            </h1>
            <p className="max-w-xl text-sand-50/80">
              Explore five distinct practice modes rooted in the Bhagavad Gita. Each game adapts the text into interactive
              challenges that reinforce comprehension, recall, and meditative focus.
            </p>
            <p className="text-sm text-sand-100/80">
              Choose a level that matches your pace, track streaks and accuracy in real-time, and unlock vibrant feedback as you
              progress.
            </p>
          </div>
          <div className="space-y-4 rounded-3xl bg-white/10 p-6 backdrop-blur">
            <h2 className="text-lg font-semibold text-sand-25">Included experiences</h2>
            <ul className="space-y-2 text-sm text-sand-100/85">
              <li>🧠 Wisdom Quiz · Multiple-choice trivia drawn from translations</li>
              <li>🧭 Verse to Chapter · Match verses to their narrative home</li>
              <li>🔗 Translation Alignment · Connect Sanskrit, Hindi, and English lines</li>
              <li>✍️ Fill the Wisdom · Restore missing words in key verses</li>
              <li>🪷 Memory Pairs · Pair transliterations with translations</li>
            </ul>
          </div>
        </div>
      </section>

      {GAME_CATALOG_SECTIONS.map((section) => (
        <section key={section.title} className="space-y-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="font-serif text-3xl text-peacock-900 sm:text-4xl">{section.title}</h2>
              <p className="text-sm text-ink-600">{section.description}</p>
            </div>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            {section.modes.map((mode) => (
              <GameCard key={mode.id} mode={mode} onSelect={handleSelectLevel} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
