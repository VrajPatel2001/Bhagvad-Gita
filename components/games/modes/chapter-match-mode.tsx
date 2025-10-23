"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import type { ModeComponentProps } from "@/lib/games/types";
import { GameShell } from "../game-shell";
import { gitaChapters, gitaChaptersByNumber } from "@/data/gita";
import { pickRandomVerses, shuffle, trimWhitespace, verseSnippet } from "@/lib/games/data";
import type { GitaVerse } from "@/data/gita/types";

interface ChapterMatchQuestion {
  verse: GitaVerse;
  excerpt: string;
  answer: number;
  options: number[];
  prompt: string;
}

const CHAPTER_NUMBERS = gitaChapters.map((chapter) => chapter.number);

function buildOptions(correct: number, count: number): number[] {
  const distractors = new Set<number>();
  while (distractors.size < count - 1) {
    const candidate = CHAPTER_NUMBERS[Math.floor(Math.random() * CHAPTER_NUMBERS.length)];
    if (candidate === correct) {
      continue;
    }
    distractors.add(candidate);
  }
  return shuffle([correct, ...Array.from(distractors)]);
}

function buildQuestions(level: { questionCount: number; options?: number }): ChapterMatchQuestion[] {
  const verses = pickRandomVerses(level.questionCount);
  return verses.map((verse) => ({
    verse,
    excerpt: verseSnippet(verse, "english", 180),
    answer: verse.chapter,
    prompt: `Which chapter contains this verse?`,
    options: buildOptions(verse.chapter, Math.max(3, level.options ?? 4)),
  }));
}

export function ChapterMatchMode({ mode, level, onExit, onRestart }: ModeComponentProps) {
  const questions = useMemo(() => buildQuestions(level), [level]);
  const total = questions.length;

  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isCorrectAnswer, setIsCorrectAnswer] = useState<boolean | null>(null);
  const [feedback, setFeedback] = useState<JSX.Element | null>(null);
  const [status, setStatus] = useState<"active" | "complete">("active");

  const timerRef = useRef<number | null>(null);

  const accuracy = answeredCount === 0 ? 0 : correctCount / answeredCount;

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  const current = questions[index];
  const chapterMeta = gitaChaptersByNumber.get(current.answer);

  const handleAdvance = () => {
    if (answeredCount >= total) {
      setStatus("complete");
      return;
    }

    setSelectedOption(null);
    setIsCorrectAnswer(null);
    setFeedback(null);
    setIndex((value) => Math.min(value + 1, total - 1));
  };

  const handleAnswer = (choice: number) => {
    if (status === "complete" || selectedOption !== null) {
      return;
    }

    const correct = choice === current.answer;
    setSelectedOption(choice);
    setIsCorrectAnswer(correct);
    const nextAnsweredCount = answeredCount + 1;
    setAnsweredCount(nextAnsweredCount);

    setScore((value) => {
      if (!correct) {
        return value;
      }
      const streakBonus = streak * 25;
      return value + 140 + streakBonus;
    });

    if (correct) {
      setStreak((value) => value + 1);
      setCorrectCount((value) => value + 1);
      setFeedback(
        <div className="flex items-start gap-3 text-peacock-900">
          <span className="text-xl">🧭</span>
          <div>
            <p className="text-sm font-semibold">Right on course.</p>
            {chapterMeta ? (
              <p className="text-xs text-ink-500">
                Chapter {chapterMeta.number}: <span className="font-semibold">{chapterMeta.title.english}</span>
              </p>
            ) : null}
          </div>
        </div>,
      );
    } else {
      setStreak(0);
      setFeedback(
        <div className="flex items-start gap-3 text-peacock-900">
          <span className="text-xl">🌱</span>
          <div>
            <p className="text-sm font-semibold">Nearly there.</p>
            {chapterMeta ? (
              <p className="text-xs text-ink-500">
                This verse lives in Chapter {chapterMeta.number}: <span className="font-semibold">{chapterMeta.title.english}</span>
              </p>
            ) : null}
          </div>
        </div>,
      );
    }

    const delay = nextAnsweredCount >= total ? 1600 : 1300;
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = window.setTimeout(() => {
      if (nextAnsweredCount >= total) {
        setStatus("complete");
      } else {
        handleAdvance();
      }
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    }, delay);
  };

  const summary = useMemo(() => {
    if (status !== "complete") {
      return undefined;
    }

    const bonus = Math.round((accuracy * 120 + streak * 30) * 1.15);

    return {
      score,
      total,
      accuracy,
      streak,
      bonus,
    };
  }, [accuracy, score, status, streak, total]);

  return (
    <GameShell
      mode={mode}
      level={level}
      score={score}
      streak={streak}
      accuracy={accuracy}
      progress={{ current: answeredCount, total }}
      status={status}
      summary={summary}
      feedback={feedback}
      onExit={onExit}
      onRestart={() => {
        onRestart();
      }}
    >
      <div className="space-y-5">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.4em] text-ink-500">Identify the chapter</p>
            <h3 className="font-serif text-2xl text-peacock-900">Which chapter contains this verse?</h3>
            <blockquote className="rounded-2xl border border-pearl-200 bg-white/80 p-4 text-sm text-ink-600 shadow-soft">
              “{trimWhitespace(current.excerpt)}”
            </blockquote>
          </div>
          <div className="hidden rounded-2xl border border-pearl-200 bg-white/70 px-3 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-peacock-700 sm:flex sm:items-center">
            {index + 1} / {total}
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {current.options.map((option) => {
            const isSelected = option === selectedOption;
            const isAnswer = option === current.answer;

            return (
              <button
                key={option}
                type="button"
                onClick={() => handleAnswer(option)}
                className="relative flex flex-col gap-2 rounded-2xl border border-pearl-200 bg-white/80 p-4 text-left text-sm transition hover:border-peacock-200 hover:bg-peacock-50/70"
                data-state={isSelected ? (isCorrectAnswer ? "correct" : "incorrect") : "idle"}
              >
                <span className="text-sm font-semibold text-peacock-900">Chapter {option}</span>
                {chapterMeta && isAnswer && selectedOption !== null ? (
                  <span className="text-xs text-ink-500">{chapterMeta.title.english}</span>
                ) : null}
              </button>
            );
          })}
        </div>
        <p className="text-xs text-ink-500">
          Chapter awareness helps place each teaching within the song&apos;s unfolding dialogue. Keep a steady streak for rising
          guides rewarded at +140 points plus 25 for every ongoing streak.
        </p>
      </div>
    </GameShell>
  );
}
