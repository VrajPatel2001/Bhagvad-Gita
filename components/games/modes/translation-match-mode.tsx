"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import type { ModeComponentProps } from "@/lib/games/types";
import { GameShell } from "../game-shell";
import { pickRandomVerses, shuffle, trimWhitespace } from "@/lib/games/data";
import type { GitaLanguage, GitaVerse } from "@/data/gita/types";

interface TranslationCard {
  id: string;
  verse: GitaVerse;
  language: GitaLanguage;
  text: string;
  translator: string;
  reference: string;
}

interface TranslationRound {
  id: string;
  translations: TranslationCard[];
  targets: Array<{
    id: string;
    label: string;
    language: GitaLanguage;
  }>;
}

const LANGUAGE_LABEL: Record<GitaLanguage, string> = {
  sanskrit: "Sanskrit",
  hindi: "Hindi",
  english: "English",
};

function createRoundId(index: number): string {
  return `translation-round-${index}`;
}

function formatReference(verse: GitaVerse): string {
  return `BG ${verse.chapter}.${verse.number}`;
}

function buildRounds(level: { questionCount: number; verseBatch?: number }): TranslationRound[] {
  const rounds: TranslationRound[] = [];
  const used = new Set<string>();
  const batchSize = Math.max(1, level.verseBatch ?? 1);

  for (let roundIndex = 0; roundIndex < level.questionCount; roundIndex += 1) {
    const verses = pickRandomVerses(batchSize, { excludeIds: used });
    verses.forEach((verse) => used.add(verse.id));
    const translations: TranslationCard[] = versesToCards(verses);
    const targets = translations.map((card) => ({
      id: card.id,
      label: `${LANGUAGE_LABEL[card.language]} · ${card.reference}`,
      language: card.language,
    }));

    rounds.push({
      id: createRoundId(roundIndex),
      translations: shuffle(translations),
      targets: shuffle(targets),
    });
  }

  return rounds;
}

function versesToCards(verses: GitaVerse[]): TranslationCard[] {
  return verses.flatMap((verse) => {
    const reference = formatReference(verse);
    return (Object.keys(verse.text) as GitaLanguage[]).map((language) => ({
      id: `${verse.id}-${language}`,
      verse,
      language,
      text: trimWhitespace(verse.text[language]),
      translator: verse.translators[language],
      reference,
    }));
  });
}

export function TranslationMatchMode({ mode, level, onExit, onRestart }: ModeComponentProps) {
  const rounds = useMemo(() => buildRounds(level), [level]);
  const [roundIndex, setRoundIndex] = useState(0);
  const [activeCardId, setActiveCardId] = useState<string | null>(null);
  const [solved, setSolved] = useState<Set<string>>(new Set());
  const [attempts, setAttempts] = useState(0);
  const [correctMatches, setCorrectMatches] = useState(0);
  const [streak, setStreak] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<JSX.Element | null>(null);
  const [status, setStatus] = useState<"active" | "complete">("active");
  const transitionTimer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (transitionTimer.current !== null) {
        clearTimeout(transitionTimer.current);
        transitionTimer.current = null;
      }
    };
  }, []);

  const totalMatches = useMemo(
    () => rounds.reduce((acc, round) => acc + round.translations.length, 0),
    [rounds],
  );

  const accuracy = attempts === 0 ? 0 : correctMatches / attempts;
  const currentRound = rounds[roundIndex];

  const handleCardSelect = (cardId: string) => {
    if (status === "complete") {
      return;
    }

    if (solved.has(cardId)) {
      return;
    }

    setActiveCardId((previous) => (previous === cardId ? null : cardId));
    setFeedback(null);
  };

  const handleTargetSelect = (targetId: string) => {
    if (status === "complete") {
      return;
    }
    if (!activeCardId) {
      setFeedback(
        <div className="text-sm text-peacock-900">
          Select a translation card first, then choose the language it belongs to.
        </div>,
      );
      return;
    }

    setAttempts((value) => value + 1);

    if (targetId === activeCardId) {
      const nextSolved = new Set(solved);
      nextSolved.add(targetId);
      setSolved(nextSolved);
      setCorrectMatches((value) => value + 1);
      setStreak((value) => value + 1);
      setScore((value) => value + 120 + streak * 15);

      const matchedCard = rounds.flatMap((round) => round.translations).find((card) => card.id === targetId);
      if (matchedCard) {
        setFeedback(
          <div className="flex items-start gap-3 text-peacock-900">
            <span className="text-xl">🔗</span>
            <div>
              <p className="text-sm font-semibold">
                {LANGUAGE_LABEL[matchedCard.language]} alignment unlocked.
              </p>
              <p className="text-xs text-ink-500">
                “{matchedCard.text.slice(0, 120)}{matchedCard.text.length > 120 ? "…" : ""}”
              </p>
            </div>
          </div>,
        );
      }

      setActiveCardId(null);

      if (nextSolved.size >= totalMatches) {
        setStatus("complete");
        return;
      }

      const isRoundComplete = currentRound.translations.every((card) => nextSolved.has(card.id));
      if (isRoundComplete && roundIndex < rounds.length - 1) {
        if (transitionTimer.current !== null) {
          clearTimeout(transitionTimer.current);
        }
        transitionTimer.current = window.setTimeout(() => {
          setRoundIndex((value) => Math.min(value + 1, rounds.length - 1));
          setFeedback(
            <div className="text-sm text-peacock-900">
              New verses await—continue matching translations across languages.
            </div>,
          );
          if (transitionTimer.current !== null) {
            clearTimeout(transitionTimer.current);
            transitionTimer.current = null;
          }
        }, 600);
      }
    } else {
      setStreak(0);
      setScore((value) => Math.max(0, value - 20));
      setFeedback(
        <div className="flex items-start gap-3 text-peacock-900">
          <span className="text-xl">💭</span>
          <div>
            <p className="text-sm font-semibold">Not quite that pairing.</p>
            <p className="text-xs text-ink-500">Reflect on familiar vocabulary and try again.</p>
          </div>
        </div>,
      );
    }
  };

  const summary = useMemo(() => {
    if (status !== "complete") {
      return undefined;
    }
    const bonus = Math.round((accuracy * 150 + streak * 20) * 1.1);
    return {
      score,
      total: totalMatches,
      accuracy,
      streak,
      bonus,
    };
  }, [accuracy, totalMatches, score, status, streak]);

  return (
    <GameShell
      mode={mode}
      level={level}
      score={score}
      streak={streak}
      accuracy={accuracy}
      progress={{ current: solved.size, total: totalMatches }}
      status={status}
      summary={summary}
      feedback={feedback}
      onExit={onExit}
      onRestart={() => {
        onRestart();
      }}
    >
      <div className="grid gap-6 lg:grid-cols-[1.3fr,0.7fr]">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-2xl text-peacock-900">Match each translation to its language</h3>
            <span className="hidden rounded-full border border-pearl-200 bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-peacock-700 sm:inline-flex">
              Round {roundIndex + 1} / {rounds.length}
            </span>
          </div>
          <p className="text-xs text-ink-500">
            Tap a translation card, then choose the matching language badge. Complete all matches to move into the next
            round.
          </p>

          <div className="grid gap-3 md:grid-cols-2">
            {currentRound.translations.map((card) => {
              const isSolved = solved.has(card.id);
              const isActive = activeCardId === card.id;

              return (
                <button
                  key={card.id}
                  type="button"
                  onClick={() => handleCardSelect(card.id)}
                  disabled={isSolved}
                  className={`group relative flex h-full flex-col gap-2 rounded-2xl border border-pearl-200 bg-white/80 p-4 text-left text-sm shadow-soft transition ${
                    isSolved
                      ? "border-peacock-200 bg-peacock-50"
                      : isActive
                        ? "border-peacock-300 bg-peacock-50/70"
                        : "hover:border-peacock-200 hover:bg-peacock-50/60"
                  }`}
                >
                  <div className="flex items-center justify-between text-xs uppercase tracking-[0.35em] text-ink-500">
                    <span>{card.reference}</span>
                    {isSolved ? <span className="text-peacock-700">Matched</span> : null}
                  </div>
                  <p className="text-sm text-ink-600">{card.text}</p>
                  <p className="text-xs text-ink-400">Translator · {card.translator}</p>
                </button>
              );
            })}
          </div>
        </div>
        <div className="space-y-3">
          <div className="rounded-3xl border border-pearl-200 bg-white/80 p-4 shadow-soft">
            <h4 className="text-sm font-semibold text-peacock-900">Language badges</h4>
            <p className="text-xs text-ink-500">Select the badge that mirrors your highlighted translation.</p>
            <div className="mt-3 grid gap-2">
              {currentRound.targets.map((target) => {
                const isSolved = solved.has(target.id);
                return (
                  <button
                    key={target.id}
                    type="button"
                    onClick={() => handleTargetSelect(target.id)}
                    disabled={isSolved}
                    className={`flex w-full items-center justify-between rounded-full border border-pearl-200 px-4 py-2 text-sm font-semibold transition ${
                      isSolved
                        ? "border-peacock-300 bg-peacock-100 text-peacock-900"
                        : "bg-white/80 hover:border-peacock-300 hover:bg-peacock-50"
                    }`}
                  >
                    <span>{target.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </GameShell>
  );
}
