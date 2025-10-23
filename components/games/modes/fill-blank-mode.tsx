"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import type { ModeComponentProps } from "@/lib/games/types";
import { GameShell } from "../game-shell";
import { getRandomWords, pickBlankWord, pickRandomVerses, versePrompt, verseSnippet } from "@/lib/games/data";
import type { GitaVerse } from "@/data/gita/types";

interface BlankQuestion {
  verse: GitaVerse;
  prompt: string;
  masked: string;
  word: string;
  options: string[];
  context: string;
}

function buildBlankQuestions(level: { questionCount: number; options?: number }): BlankQuestion[] {
  const questions: BlankQuestion[] = [];
  const used = new Set<string>();
  const optionCount = Math.max(3, level.options ?? 4);
  let attempts = 0;

  while (questions.length < level.questionCount && attempts < level.questionCount * 5) {
    attempts += 1;
    const [verse] = pickRandomVerses(1, { excludeIds: used });
    if (!verse) {
      continue;
    }

    const blank = pickBlankWord(verse);
    if (!blank) {
      continue;
    }

    const correctWord = blank.word;
    const distractors = getRandomWords(optionCount - 1, correctWord).map((word) => word);
    const options = shuffleWords([correctWord, ...distractors]);

    questions.push({
      verse,
      prompt: versePrompt(verse),
      masked: blank.masked,
      word: correctWord,
      options,
      context: verseSnippet(verse, "english", 180),
    });
    used.add(verse.id);
  }

  return questions;
}

function shuffleWords(words: string[]): string[] {
  const arr = [...words];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function FillBlankMode({ mode, level, onExit, onRestart }: ModeComponentProps) {
  const questions = useMemo(() => buildBlankQuestions(level), [level]);
  const total = questions.length;

  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [feedback, setFeedback] = useState<JSX.Element | null>(null);
  const [status, setStatus] = useState<"active" | "complete">("active");

  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  const accuracy = answeredCount === 0 ? 0 : correctCount / answeredCount;
  const current = questions[index];
  const segments = useMemo(() => current.masked.split("_____") ?? [current.masked], [current.masked]);

  const handleNext = () => {
    if (answeredCount >= total) {
      setStatus("complete");
      return;
    }

    setSelectedOption(null);
    setIsCorrect(null);
    setFeedback(null);
    setIndex((value) => Math.min(value + 1, total - 1));
  };

  const handleAnswer = (option: string) => {
    if (status === "complete" || selectedOption) {
      return;
    }

    const correct = option.toLowerCase() === current.word.toLowerCase();
    setSelectedOption(option);
    setIsCorrect(correct);
    const nextAnswered = answeredCount + 1;
    setAnsweredCount(nextAnswered);

    if (correct) {
      setCorrectCount((value) => value + 1);
      setStreak((value) => value + 1);
      setScore((value) => value + 130 + streak * 18);
      setFeedback(
        <div className="flex items-start gap-3 text-peacock-900">
          <span className="text-xl">🌼</span>
          <div>
            <p className="text-sm font-semibold">Word restored.</p>
            <p className="text-xs text-ink-500">{current.context}</p>
          </div>
        </div>,
      );
    } else {
      setStreak(0);
      setFeedback(
        <div className="flex items-start gap-3 text-peacock-900">
          <span className="text-xl">🕯</span>
          <div>
            <p className="text-sm font-semibold">Reflect and try again.</p>
            <p className="text-xs text-ink-500">
              The missing word is <span className="font-semibold">{current.word}</span>.
            </p>
          </div>
        </div>,
      );
    }

    const delay = nextAnswered >= total ? 1600 : 1300;
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = window.setTimeout(() => {
      if (nextAnswered >= total) {
        setStatus("complete");
      } else {
        handleNext();
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

    const bonus = Math.round((accuracy * 140 + streak * 20) * 1.2);
    return { score, total, accuracy, streak, bonus };
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
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.4em] text-ink-500">{current.prompt}</p>
            <h3 className="font-serif text-2xl text-peacock-900">Fill in the missing word</h3>
            <p className="rounded-2xl border border-pearl-200 bg-white/80 p-4 text-sm text-ink-600">
              {segments.length === 1 ? (
                <span>{segments[0]}</span>
              ) : (
                <>
                  <span>{segments[0]}</span>
                  <span className="mx-1 inline-flex items-center rounded-full bg-saffron-200/60 px-2 py-1 text-sm font-semibold text-peacock-900">
                    _____
                  </span>
                  <span>{segments.slice(1).join("_____")}</span>
                </>
              )}
            </p>
          </div>
          <div className="hidden rounded-2xl border border-pearl-200 bg-white/70 px-3 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-peacock-700 sm:flex sm:items-center">
            {index + 1} / {total}
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {current.options.map((option) => {
            const isSelected = selectedOption === option;
            const isCorrectOption = option.toLowerCase() === current.word.toLowerCase();
            return (
              <button
                key={option}
                type="button"
                onClick={() => handleAnswer(option)}
                className="relative flex flex-col gap-2 rounded-2xl border border-pearl-200 bg-white/80 p-4 text-left text-sm transition hover:border-peacock-200 hover:bg-peacock-50/70"
                data-state={isSelected ? (isCorrect ? "correct" : "incorrect") : "idle"}
              >
                <span className="text-sm font-semibold text-peacock-900">{option}</span>
                {selectedOption ? (
                  <span className="text-xs uppercase tracking-[0.35em] text-ink-400">
                    {isCorrectOption ? "Original word" : "Option"}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
        <p className="text-xs text-ink-500">
          Strengthen your memory for precise vocabulary. Correct choices earn 130 points plus an 18-point streak bonus.
        </p>
      </div>
    </GameShell>
  );
}
