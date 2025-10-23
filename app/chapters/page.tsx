import type { Metadata } from "next";

import Link from "next/link";

const TOTAL_CHAPTERS = 18;
const CHAPTER_NUMBERS = Array.from({ length: TOTAL_CHAPTERS }, (_, index) => index + 1);

export const metadata: Metadata = {
  title: "Chapters",
  description: "Browse the Bhagavad Gita chapters 1 through 18 and return as new study materials are published.",
};

export default function ChaptersPage() {
  return (
    <div className="space-y-10">
      <header className="space-y-4">
        <h1 className="font-serif text-fluid-display text-peacock-900">Chapters overview</h1>
        <p className="max-w-2xl text-lg text-ink-600">
          Explore each chapter of the Bhagavad Gita in order. Full study content is on the way, but you can
          bookmark the chapter numbers below and check back as the learning experience expands.
        </p>
      </header>

      <div className="grid gap-6">
        {CHAPTER_NUMBERS.map((chapterNumber) => (
          <article
            key={chapterNumber}
            id={`chapter-${chapterNumber}`}
            className="rounded-3xl border border-pearl-200 bg-white/85 p-6 shadow-soft"
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <span className="inline-flex rounded-full bg-sand-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-peacock-800">
                  Chapter {chapterNumber.toString().padStart(2, "0")}
                </span>
                <h2 className="mt-3 font-serif text-fluid-heading text-peacock-900">Chapter {chapterNumber}</h2>
                <p className="text-sm text-ink-500">Content loading soon</p>
              </div>
              <Link
                href={`/chapters/${chapterNumber}`}
                className="inline-flex items-center justify-center rounded-full border border-pearl-300 px-4 py-2 text-sm font-semibold text-peacock-800 transition hover:border-peacock-300 hover:text-peacock-600"
              >
                Read chapter
              </Link>
            </div>
            <p className="mt-4 text-ink-600">Chapter {chapterNumber} — content loading soon.</p>
          </article>
        ))}
      </div>
    </div>
  );
}
