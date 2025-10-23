"use client";

import { useCallback, useEffect, useMemo, useState, useId } from "react";

import Link from "next/link";

import type { GitaChapter, GitaLanguage, GitaVerse } from "@/data/gita/types";

import { useBookmarks } from "@/components/bookmark-provider";
import { VerseBookmarkButton } from "@/components/verse-bookmark-button";
import { useLanguage } from "@/components/language-provider";
import { LANGUAGE_LABELS, sortLanguagesByPreference } from "@/lib/language";
import { cn } from "@/lib/utils";

type ChapterReaderProps = {
  chapter: GitaChapter;
};

export function ChapterReader({ chapter }: ChapterReaderProps) {
  const { language, supportedLanguages } = useLanguage();
  const { isBookmarked } = useBookmarks();
  const [query, setQuery] = useState("");
  const [visibleLanguages, setVisibleLanguages] = useState<GitaLanguage[]>(() => [language]);
  const searchInputId = useId();

  useEffect(() => {
    setVisibleLanguages((current) => {
      if (current.includes(language)) {
        return sortLanguagesByPreference(current, supportedLanguages);
      }

      return sortLanguagesByPreference([language, ...current], supportedLanguages);
    });
  }, [language, supportedLanguages]);

  const toggleLanguage = useCallback(
    (targetLanguage: GitaLanguage) => {
      setVisibleLanguages((current) => {
        if (current.includes(targetLanguage)) {
          if (current.length === 1) {
            return current;
          }

          return current.filter((item) => item !== targetLanguage);
        }

        return sortLanguagesByPreference([...current, targetLanguage], supportedLanguages);
      });
    },
    [supportedLanguages],
  );

  const normalizedQuery = query.trim().toLowerCase();

  const filteredVerses = useMemo(() => {
    if (!normalizedQuery) {
      return chapter.verses;
    }

    return chapter.verses.filter((verse) => matchesQuery(verse, normalizedQuery, supportedLanguages));
  }, [chapter.verses, normalizedQuery, supportedLanguages]);

  const bookmarkedCount = useMemo(() => {
    return chapter.verses.reduce((count, verse) => (isBookmarked(verse.id) ? count + 1 : count), 0);
  }, [chapter.verses, isBookmarked]);

  const verseCount = chapter.verses.length;
  const hasResults = filteredVerses.length > 0;
  const hasActiveSearch = Boolean(normalizedQuery.length);

  return (
    <div className="space-y-10">
      <section className="space-y-6 rounded-3xl border border-pearl-200 bg-white/80 p-6 shadow-soft">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-3">
            <span className="inline-flex w-fit rounded-full bg-sand-100 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-peacock-800">
              Chapter {chapter.number.toString().padStart(2, "0")}
            </span>
            <h1 className="font-serif text-3xl text-peacock-900 sm:text-4xl">
              {chapter.meaning.english ?? chapter.title.english}
            </h1>
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-saffron-600">
              {chapter.title.sanskrit}
            </p>
          </div>
          <div className="flex gap-6 text-sm text-ink-500">
            <div>
              <p className="font-semibold text-peacock-800">{verseCount}</p>
              <p className="uppercase tracking-[0.25em]">Verses</p>
            </div>
            <div>
              <p className="font-semibold text-peacock-800">{bookmarkedCount}</p>
              <p className="uppercase tracking-[0.25em]">Bookmarked</p>
            </div>
          </div>
        </div>
        {chapter.summary.english ? (
          <p className="whitespace-pre-line text-lg leading-relaxed text-ink-600">
            {chapter.summary.english}
          </p>
        ) : null}
        <div className="flex flex-wrap gap-2 text-sm text-ink-500">
          {chapter.summary.hindi ? (
            <span className="rounded-full bg-lotus-100 px-3 py-1 text-xs font-medium tracking-[0.1em] text-saffron-700">
              हिन्दी सार: {chapter.summary.hindi.substring(0, 120)}{chapter.summary.hindi.length > 120 ? "…" : ""}
            </span>
          ) : null}
        </div>
      </section>

      <section className="space-y-6 rounded-3xl border border-pearl-200 bg-white/80 p-5 shadow-soft">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex-1">
            <label htmlFor={searchInputId} className="sr-only">
              Search within chapter
            </label>
            <input
              id={searchInputId}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search verses, words, or transliteration"
              className="w-full rounded-full border border-pearl-300 bg-white/95 px-5 py-3 text-sm shadow-soft transition focus:border-peacock-200 focus:outline-none focus:ring-2 focus:ring-peacock-100"
              type="search"
            />
            {hasActiveSearch ? (
              <p className="mt-2 text-xs text-ink-500">
                {hasResults ? (
                  <>
                    Showing <span className="font-semibold text-peacock-800">{filteredVerses.length}</span> of {verseCount} verses
                  </>
                ) : (
                  <>No verses match “{query}”</>
                )}
              </p>
            ) : null}
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

        <div className="flex items-center gap-2 overflow-x-auto rounded-full border border-pearl-200 bg-white/70 p-2 text-xs text-ink-500">
          {chapter.verses.map((verse) => {
            const href = `#verse-${verse.number}`;

            return (
              <a
                key={verse.id}
                href={href}
                className="inline-flex items-center justify-center rounded-full px-3 py-1 font-semibold text-peacock-800 transition hover:bg-peacock-50"
              >
                {verse.number}
              </a>
            );
          })}
        </div>
      </section>

      <section className="space-y-6">
        {hasResults ? (
          filteredVerses.map((verse) => {
            const verseLabel = `Chapter ${chapter.number}, Verse ${verse.number}`;
            const verseHref = `/chapters/${chapter.number}/verses/${verse.number}`;
            const isVerseBookmarked = isBookmarked(verse.id);

            return (
              <article
                key={verse.id}
                id={`verse-${verse.number}`}
                className={cn(
                  "space-y-5 rounded-3xl border bg-white/80 p-6 shadow-soft transition hover:border-peacock-200",
                  isVerseBookmarked ? "border-saffron-400/80 bg-saffron-100/40" : "border-pearl-200",
                )}
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.35em] text-peacock-700">
                      Verse {chapter.number}.{verse.number}
                    </p>
                    <p className="text-sm text-ink-500">{verse.id}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Link
                      href={verseHref}
                      className="inline-flex items-center gap-2 rounded-full border border-peacock-200 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-peacock-800 transition hover:border-peacock-400 hover:text-peacock-600"
                    >
                      Study verse
                      <span aria-hidden className="translate-y-[1px]">→</span>
                    </Link>
                    <VerseBookmarkButton verseId={verse.id} verseLabel={verseLabel} />
                  </div>
                </div>

                {verse.transliteration ? (
                  <div className="rounded-2xl bg-sand-100/70 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-ink-400">
                      Transliteration
                    </p>
                    <p className="mt-2 whitespace-pre-line font-medium italic leading-relaxed text-ink-600">
                      {verse.transliteration}
                    </p>
                  </div>
                ) : null}

                <div className="grid gap-4 md:grid-cols-2">
                  {visibleLanguages.map((selectedLanguage) => {
                    const translation = verse.text[selectedLanguage];
                    const translator = verse.translators[selectedLanguage];
                    const languageLabel = LANGUAGE_LABELS[selectedLanguage] ?? selectedLanguage;

                    if (!translation) {
                      return null;
                    }

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
                          Source: {verse.sources[selectedLanguage] ?? "—"}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </article>
            );
          })
        ) : (
          <div className="rounded-3xl border border-dashed border-pearl-200 bg-white/60 p-8 text-center text-ink-500">
            <p>No verses match your search. Try different keywords or reset filters.</p>
            <button
              type="button"
              onClick={() => setQuery("")}
              className="mt-4 inline-flex items-center justify-center rounded-full border border-pearl-300 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-peacock-800 transition hover:border-peacock-300 hover:text-peacock-600"
            >
              Clear search
            </button>
          </div>
        )}
      </section>
    </div>
  );
}

function matchesQuery(verse: GitaVerse, query: string, languages: readonly GitaLanguage[]): boolean {
  if (verse.number.toString().includes(query)) {
    return true;
  }

  if (verse.id.toLowerCase().includes(query)) {
    return true;
  }

  if (verse.transliteration?.toLowerCase().includes(query)) {
    return true;
  }

  return languages.some((language) => verse.text[language]?.toLowerCase().includes(query));
}
