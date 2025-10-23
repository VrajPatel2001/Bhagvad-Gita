"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import type { ModeComponentProps } from "@/lib/games/types";
import { GameShell } from "../game-shell";
import {
  getDistinctTranslations,
  pickRandomVerses,
  shuffle,
  trimWhitespace,
  versePrompt,
  verseSnippet,
} from "@/lib/games/data";
import type { GitaVerse } from "@/data/gita/types";

interface QuizQuestion {
  verse: GitaVerse;
  prompt: string;
  transliteration: string;
  options: string[];
  answer: string;
  context: string;
}

function buildQuizQuestions(levelOptions: { questionCount: number; options?: number }): QuizQuestion[] {
  const verses = pickRandomVerses(levelOptions.questionCount);
  return verses.map((verse) => {
    const correct = trimWhitespace(verse.text.english);
    const optionCount = Math.max(2, levelOptions.options ?? 4);
    const distractors = getDistinctTranslations(optionCount - 1, new Set([verse.id]));
    const options = shuffle([correct, ...distractors]);

    const transliteration = trimWhitespace(verse.transliteration);
    const transliterationSnippet = (() => {
      if (transliteration.length <= 140) {
        return transliteration;
      }
      const truncated = transliteration.slice(0, 140);
      const lastSpace = truncated.lastIndexOf(" ");
      const safeSlice = lastSpace > 0 ? truncated.slice(0, lastSpace) : truncated;
      return `${safeSlice}…`;
    })();

    return {
      verse,
      prompt: versePrompt(verse),
      transliteration: transliterationSnippet,
      options,
      answer: correct,
      context: verseSnippet(verse, "english", 200),
    };
  });
}

export function QuizMode({ mode, level, onExit, onRestart }: ModeComponentProps) {
  const questions = useMemo(() => buildQuizQuestions(level), [level]);
  const totalQuestions = questions.length;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
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

  const currentQuestion = questions[currentIndex];

  const handleAdvance = () => {
    if (answeredCount >= totalQuestions) {
      setStatus("complete");
      return;
    }

    setSelectedOption(null);
    setIsCorrectAnswer(null);
    setFeedback(null);

    setCurrentIndex((value) => Math.min(value + 1, totalQuestions - 1));
  };

  const handleAnswer = (option: string) => {
    if (status === "complete" || selectedOption) {
      return;
    }

    const isCorrect = option === currentQuestion.answer;
    setSelectedOption(option);
    setIsCorrectAnswer(isCorrect);
    const nextAnsweredCount = answeredCount + 1;
    setAnsweredCount(nextAnsweredCount);

    setScore((value) => {
      if (!isCorrect) {
        return value;
      }

      const streakBonus = streak * 20;
      return value + 150 + streakBonus;
    });

    if (isCorrect) {
      setStreak((value) => value + 1);
      setCorrectCount((value) => value + 1);
      setFeedback(
        <div className="flex items-start gap-3 text-peacock-900">
          <span className="text-xl">✨</span>
          <div>
            <p className="text-sm font-semibold">Precise insight!</p>
            <p className="text-xs text-ink-500">{currentQuestion.context}</p>
          </div>
        </div>,
      );
    } else {
      setStreak(0);
      setFeedback(
        <div className="flex items-start gap-3 text-peacock-900">
          <span className="text-xl">🌿</span>
          <div>
            <p className="text-sm font-semibold">A moment to reflect.</p>
            <p className="text-xs text-ink-500">
              The verse teaches: <span className="font-semibold">{currentQuestion.answer}</span>
            </p>
          </div>
        </div>,
      );
    }

    const delay = nextAnsweredCount >= totalQuestions ? 1600 : 1300;
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = window.setTimeout(() => {
      if (nextAnsweredCount >= totalQuestions) {
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

    const bonus = Math.round((accuracy * 100 + streak * 25) * 1.25);

    return {
      score,
      total: totalQuestions,
      accuracy,
      streak,
      bonus,
    };
  }, [accuracy, score, status, streak, totalQuestions]);

  return (
    <GameShell
      mode={mode}
      level={level}
      score={score}
      streak={streak}
      accuracy={accuracy}
      progress={{ current: answeredCount, total: totalQuestions }}
      status={status}
      summary={summary}
      feedback={feedback}
      onExit={onExit}
      onRestart={() => {
        onRestart();
      }}
    >
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-ink-500">{currentQuestion.prompt}</p>
            <h3 className="font-serif text-2xl text-peacock-900">Select the English translation</h3>
            <p className="text-sm text-ink-500">{currentQuestion.transliteration}</p>
          </div>
          <div className="hidden rounded-2xl border border-pearl-200 bg-white/70 px-3 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-peacock-700 sm:flex sm:items-center">
            {currentIndex + 1} / {totalQuestions}
          </div>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {currentQuestion.options.map((option) => {
            const isSelected = option === selectedOption;
            const isAnswer = option === currentQuestion.answer;

            return (
              <button
                key={option}
                type="button"
                onClick={() => handleAnswer(option)}
                className={
                  "group relative flex h-full flex-col justify-start gap-2 rounded-2xl border border-pearl-200 bg-white/80 p-4 text-left text-sm transition hover:border-peacock-200 hover:bg-peacock-50/80"
                }
                data-state={isSelected ? (isCorrectAnswer ? "correct" : "incorrect") : "idle"}
              >
                <span className="text-sm text-ink-600">{option}</span>
                {selectedOption ? (
                  <span
                    className={
                      "absolute right-4 top-4 rounded-full px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-[0.35em]"
                    }
                    data-state={isAnswer ? "correct" : "incorrect"}
                  >
                    {isAnswer ? "Correct" : isSelected ? "Chosen" : ""}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
        <p className="text-xs text-ink-500">
          Earn streak bonuses by sustaining consecutive wisdom-filled selections. Each right answer adds 150 points plus a
          20-point streak bonus.
        </p>
      </div>
    </GameShell>
  );
}
