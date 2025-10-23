import type { Metadata } from "next";

import Link from "next/link";

import { chapters } from "@/data/chapters";

export const metadata: Metadata = {
  title: "Chapters",
  description:
    "Browse chapter summaries, themes, and study prompts to deepen your Bhagavad Gita learning journey.",
};

export default function ChaptersPage() {
  return (
    <div className="space-y-10">
      <header className="space-y-4">
        <h1 className="font-serif text-4xl text-peacock-900 sm:text-5xl">Chapters overview</h1>
        <p className="max-w-2xl text-lg text-ink-600">
          Move through the Gita chapter by chapter. Each section includes a guiding theme, a gentle
          summary, and prompts that invite personal contemplation. Additional chapters will be added
          as study materials are released.
        </p>
      </header>

      <div className="grid gap-6">
        {chapters.map((chapter) => (
          <article
            key={chapter.number}
            id={`chapter-${chapter.number}`}
            className="rounded-3xl border border-pearl-200 bg-white/85 p-6 shadow-soft"
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <span className="inline-flex rounded-full bg-sand-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-peacock-800">
                  Chapter {chapter.number}
                </span>
                <h2 className="mt-3 font-serif text-3xl text-peacock-900">{chapter.title}</h2>
                <p className="font-semibold uppercase tracking-[0.35em] text-saffron-600">
                  {chapter.theme}
                </p>
              </div>
              <Link
                href={`/chapters/${chapter.number}`}
                className="inline-flex items-center justify-center rounded-full border border-pearl-300 px-4 py-2 text-sm font-semibold text-peacock-800 transition hover:border-peacock-300 hover:text-peacock-600"
              >
                View study guide
              </Link>
            </div>
            <p className="mt-4 text-ink-600">{chapter.summary}</p>
          </article>
        ))}
        <div className="rounded-3xl border border-dashed border-pearl-200 bg-sand-50/70 p-6 text-ink-600 shadow-soft">
          <h3 className="font-serif text-2xl text-peacock-900">More to come</h3>
          <p className="mt-2 max-w-2xl">
            Chapters 5 through 18 are in development with detailed summaries, reflection prompts,
            and mantra-based meditations. Stay tuned for phased releases.
          </p>
        </div>
      </div>
    </div>
  );
}
