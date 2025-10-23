"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import type { ModeComponentProps } from "@/lib/games/types";
import { GameShell } from "../game-shell";
import { buildMemoryPairs, shuffle } from "@/lib/games/data";

interface MemoryCard {
  id: string;
  pairId: string;
  kind: "transliteration" | "translation";
  content: string;
  reference: string;
}

interface BoardCard extends MemoryCard {
  state: "hidden" | "revealed" | "matched";
}

function createMemoryDeck(pairCount: number): BoardCard[] {
  const pairs = buildMemoryPairs(pairCount);
  const cards: BoardCard[] = pairs.flatMap((pair) => {
    const reference = `BG ${pair.verse.chapter}.${pair.verse.number}`;
    return [
      {
        id: `${pair.id}-transliteration`,
        pairId: pair.id,
        kind: "transliteration",
        content: pair.transliteration,
        reference,
        state: "hidden",
      },
      {
        id: `${pair.id}-translation`,
        pairId: pair.id,
        kind: "translation",
        content: pair.english,
        reference,
        state: "hidden",
      },
    ];
  });

  return shuffle(cards).map((card) => ({ ...card, state: "hidden" }));
}

export function MemoryMode({ mode, level, onExit, onRestart }: ModeComponentProps) {
  const pairCount = level.pairs ?? level.questionCount;
  const [board, setBoard] = useState<BoardCard[]>(() => createMemoryDeck(pairCount));
  const [revealedIds, setRevealedIds] = useState<string[]>([]);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [moves, setMoves] = useState(0);
  const [streak, setStreak] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<JSX.Element | null>(null);
  const [status, setStatus] = useState<"active" | "complete">("active");

  const flipTimer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (flipTimer.current !== null) {
        clearTimeout(flipTimer.current);
        flipTimer.current = null;
      }
    };
  }, []);

  const totalPairs = pairCount;
  const accuracy = moves === 0 ? 0 : matchedPairs / moves;



  const handleCardClick = (card: BoardCard) => {
    if (status === "complete") {
      return;
    }

    if (card.state !== "hidden") {
      return;
    }

    if (revealedIds.length === 2) {
      return;
    }

    const nextRevealed = [...revealedIds, card.id];
    const revealedBoard = board.map((item) =>
      item.id === card.id ? { ...item, state: "revealed" } : item,
    );

    setBoard(revealedBoard);
    setRevealedIds(nextRevealed);

    if (nextRevealed.length < 2) {
      if (flipTimer.current !== null) {
        clearTimeout(flipTimer.current);
        flipTimer.current = null;
      }
      return;
    }

    const [firstId, secondId] = nextRevealed;
    const firstCard = revealedBoard.find((item) => item.id === firstId);
    const secondCard = revealedBoard.find((item) => item.id === secondId);

    if (!firstCard || !secondCard) {
      return;
    }

    setMoves((value) => value + 1);

    if (firstCard.pairId === secondCard.pairId && firstCard.id !== secondCard.id) {
      const matchedBoard = revealedBoard.map((item) =>
        item.id === firstId || item.id === secondId ? { ...item, state: "matched" } : item,
      );
      setBoard(matchedBoard);
      const nextMatched = matchedPairs + 1;
      setMatchedPairs(nextMatched);
      const nextStreak = streak + 1;
      setStreak(nextStreak);
      setScore((value) => value + 200 + streak * 30);
      setFeedback(
        <div className="flex items-start gap-3 text-peacock-900">
          <span className="text-xl">🪷</span>
          <div>
            <p className="text-sm font-semibold">Pair remembered.</p>
            <p className="text-xs text-ink-500">{firstCard.reference}</p>
          </div>
        </div>,
      );
      setRevealedIds([]);

      if (nextMatched >= totalPairs) {
        setStatus("complete");
      }
    } else {
      setStreak(0);
      setFeedback(
        <div className="flex items-start gap-3 text-peacock-900">
          <span className="text-xl">🌀</span>
          <div>
            <p className="text-sm font-semibold">Different threads.</p>
            <p className="text-xs text-ink-500">Consider another pair and continue.</p>
          </div>
        </div>,
      );

      if (flipTimer.current !== null) {
        clearTimeout(flipTimer.current);
      }
      flipTimer.current = window.setTimeout(() => {
        setBoard((currentBoard) =>
          currentBoard.map((item) =>
            item.id === firstId || item.id === secondId ? { ...item, state: "hidden" } : item,
          ),
        );
        setRevealedIds([]);
        if (flipTimer.current !== null) {
          clearTimeout(flipTimer.current);
          flipTimer.current = null;
        }
      }, 900);
    }
  };

  const summary = useMemo(() => {
    if (status !== "complete") {
      return undefined;
    }

    const bonus = Math.round((accuracy * 180 + streak * 40) * 1.1);
    return {
      score,
      total: totalPairs,
      accuracy,
      streak,
      bonus,
    };
  }, [accuracy, score, status, streak, totalPairs]);

  return (
    <GameShell
      mode={mode}
      level={level}
      score={score}
      streak={streak}
      accuracy={accuracy}
      progress={{ current: matchedPairs, total: totalPairs }}
      status={status}
      summary={summary}
      feedback={feedback}
      onExit={onExit}
      onRestart={() => {
        onRestart();
      }}
    >
      <div className="space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h3 className="font-serif text-2xl text-peacock-900">Find matching teachings</h3>
            <p className="text-xs text-ink-500">
              Flip two cards to reveal transliterations and translations. Pair them to weave memory across languages.
            </p>
          </div>
          <div className="hidden rounded-2xl border border-pearl-200 bg-white/70 px-3 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-peacock-700 sm:flex sm:items-center">
            Pairs matched {matchedPairs} / {totalPairs}
          </div>
        </div>
        <div
          className={`grid gap-3 sm:grid-cols-3 ${
            totalPairs >= 6 ? "lg:grid-cols-4" : "lg:grid-cols-3"
          }`}
        >
          {board.map((card) => {
            const isRevealed = card.state !== "hidden";
            const isMatched = card.state === "matched";
            return (
              <button
                key={card.id}
                type="button"
                onClick={() => handleCardClick(card)}
                className={`relative flex h-full min-h-[7.5rem] flex-col justify-between rounded-2xl border border-pearl-200 p-4 text-left text-sm transition ${
                  isMatched
                    ? "bg-peacock-100/90 text-peacock-900"
                    : isRevealed
                      ? "bg-peacock-50 text-peacock-800"
                      : "bg-white/80 hover:border-peacock-200 hover:bg-peacock-50/60"
                }`}
              >
                <span className="text-xs uppercase tracking-[0.35em] text-ink-500">{card.reference}</span>
                <p className="text-sm font-medium text-peacock-900">
                  {isRevealed ? card.content : "Reveal"}
                </p>
                <span className="text-xs text-ink-400">{card.kind === "transliteration" ? "Transliteration" : "Translation"}</span>
              </button>
            );
          })}
        </div>
        <p className="text-xs text-ink-500">
          Each correct match awards 200 points plus a 30-point streak bonus. Keep attention steady to complete every pair.
        </p>
      </div>
    </GameShell>
  );
}
