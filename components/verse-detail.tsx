"use client";

import { useCallback, useMemo, useState } from "react";

import Link from "next/link";

import type { GitaChapter, GitaLanguage, GitaVerse } from "@/data/gita/types";

import { VerseBookmarkButton } from "@/components/verse-bookmark-button";
import { useLanguage } from "@/components/language-provider";
import {
  LANGUAGE_LABELS,
  getChapterDisplayInfo,
  sortLanguagesByPreference,
} from "@/lib/language";
import { cn } from "@/lib/utils";

type VerseDetailProps = {
  chapter: GitaChapter;
  verse: GitaVerse;
  previousVerseNumber?: number | null;
  nextVerseNumber?: number | null;
};

export function VerseDetail({
  chapter,
  verse,
  previousVerseNumber,
  nextVerseNumber,
}: VerseDetailProps) {
  const { language, supportedLanguages } = useLanguage();
  const [languagePreferences, setLanguagePreferences] = useState<GitaLanguage[]>(() =>
    sortLanguagesByPreference([language], supportedLanguages),
  );

  const visibleLanguages = useMemo(() => {
    const merged = new Set<GitaLanguage>([language, ...languagePreferences]);
    return sortLanguagesByPreference(Array.from(merged), supportedLanguages);
  }, [language, languagePreferences, supportedLanguages]);

  const toggleLanguage = useCallback(
    (targetLanguage: GitaLanguage) => {
      setLanguagePreferences((current) => {
        const next = new Set(current);

        if (next.has(targetLanguage)) {
          if (targetLanguage === language) {
            return current;
          }

          if (next.size === 1) {
            return current;
          }

          next.delete(targetLanguage);
          return Array.from(next);
        }

        if (!supportedLanguages.includes(targetLanguage)) {
          return current;
        }

        next.add(targetLanguage);
        return Array.from(next);
      });
    },
    [language, supportedLanguages],
  );

  const { primary: chapterPrimary, secondary: chapterSecondary } = useMemo(
    () => getChapterDisplayInfo(chapter, language),
    [chapter, language],
  );

  const verseLabel = `Chapter ${chapter.number}, Verse ${verse.number}`;
  const backToChapterHref = `/chapters/${chapter.number}#verse-${verse.number}`;
  const previousLink =
    typeof previousVerseNumber === "number"
      ? `/chapters/${chapter.number}/verses/${previousVerseNumber}`
      : null;
  const nextLink =
    typeof nextVerseNumber === "number"
      ? `/chapters/${chapter.number}/verses/${nextVerseNumber}`
      : null;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-3">
          <Link
            href={backToChapterHref}
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-peacock-700 transition hover:text-peacock-500"
          >
            <span aria-hidden>←</span>
            Back to chapter
          </Link>
          <h1 className="font-serif text-3xl text-peacock-900 sm:text-4xl">
            Chapter {chapter.number}, Verse {verse.number}
          </h1>
          <div className="space-y-1">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-saffron-600">
              {chapter.title.sanskrit}
            </p>
            <p className="text-sm text-ink-500">
              {chapterPrimary}
              {chapterSecondary ? ` · ${chapterSecondary}` : ""}
            </p>
          </div>
        </div>
        <VerseBookmarkButton verseId={verse.id} verseLabel={verseLabel} showLabel size="md" />
      </div>

      <div className="space-y-6 rounded-3xl border border-pearl-200 bg-white/85 p-6 shadow-soft">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1 text-sm text-ink-500">
            <p className="font-semibold text-peacock-800">{verse.id}</p>
            <p>
              Within Chapter {chapter.number} · {chapter.versesCount} total verses
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-ink-400">Translations</p>
            <div className="flex flex-wrap gap-2">
              {supportedLanguages.map((supportedLanguage) => {
                const isActive = visibleLanguages.includes(supportedLanguage);

                return (
                  <button
                    key={supportedLanguage}
                    type="button"
                    onClick={() => toggleLanguage(supportedLanguage)}
                    aria-pressed={isActive}
                    className={cn(
                      "rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] transition focus:outline-none focus:ring-2 focus:ring-peacock-200",
                      isActive
                        ? "border-peacock-500 bg-peacock-600 text-sand-25 shadow-soft"
                        : "border-pearl-300 bg-white/80 text-peacock-800 hover:border-peacock-200 hover:text-peacock-600",
                    )}
                  >
                    {LANGUAGE_LABELS[supportedLanguage] ?? supportedLanguage}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {verse.transliteration ? (
          <div className="rounded-2xl bg-sand-100/70 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-ink-400">
              Transliteration
            </p>
            <p className="mt-3 whitespace-pre-line font-medium italic leading-relaxed text-ink-600">
              {verse.transliteration}
            </p>
          </div>
        ) : null}

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {visibleLanguages.map((selectedLanguage) => {
            const translation = verse.text[selectedLanguage];

            if (!translation) {
              return null;
            }

            const translator = verse.translators[selectedLanguage];
            const source = verse.sources[selectedLanguage];
            const languageLabel = LANGUAGE_LABELS[selectedLanguage] ?? selectedLanguage;

            return (
              <div
                key={selectedLanguage}
                className="flex h-full flex-col justify-between rounded-2xl border border-pearl-200 bg-white/90 p-4"
              >
                <div>
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-peacock-700">
                      {languageLabel}
                    </p>
                    {translator ? (
                      <p className="text-[11px] uppercase tracking-[0.2em] text-ink-400">
                        {translator}
                      </p>
                    ) : null}
                  </div>
                  <p className="mt-3 whitespace-pre-line text-base leading-relaxed text-ink-700">
                    {translation}
                  </p>
                </div>
                <p className="mt-4 text-[11px] uppercase tracking-[0.25em] text-ink-400">
                  Source: {source ?? "—"}
                </p>
              </div>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-pearl-200 pt-4 text-sm">
          <div>
            {previousLink ? (
              <Link
                href={previousLink}
                className="inline-flex items-center gap-2 rounded-full border border-pearl-300 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-peacock-800 transition hover:border-peacock-200 hover:text-peacock-600"
              >
                <span aria-hidden>←</span> Verse {chapter.number}.{previousVerseNumber}
              </Link>
            ) : (
              <span className="text-xs uppercase tracking-[0.3em] text-ink-400">Beginning of chapter</span>
            )}
          </div>
          <Link
            href={backToChapterHref}
            className="inline-flex items-center gap-2 rounded-full border border-peacock-200 bg-peacock-600 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-sand-25 shadow-soft transition hover:bg-peacock-500"
          >
            Back to verses
          </Link>
          <div>
            {nextLink ? (
              <Link
                href={nextLink}
                className="inline-flex items-center gap-2 rounded-full border border-pearl-300 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-peacock-800 transition hover:border-peacock-200 hover:text-peacock-600"
              >
                Verse {chapter.number}.{nextVerseNumber} <span aria-hidden>→</span>
              </Link>
            ) : (
              <span className="text-xs uppercase tracking-[0.3em] text-ink-400">End of chapter</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
