import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ChapterReader } from "@/components/chapter-reader";
import { getChapter } from "@/lib/gita";

const TOTAL_CHAPTERS = 18;
const CHAPTER_PARAMS = Array.from({ length: TOTAL_CHAPTERS }, (_, index) => (index + 1).toString());
const CHAPTER_PARAM_SET = new Set(CHAPTER_PARAMS);

type ChapterPageProps = {
  params: {
    chapter: string;
  };
};

export const dynamicParams = false;

export function generateStaticParams() {
  return CHAPTER_PARAMS.map((chapter) => ({ chapter }));
}

export function generateMetadata({ params }: ChapterPageProps): Metadata {
  const { chapter } = params;

  if (!CHAPTER_PARAM_SET.has(chapter)) {
    return {
      title: "Chapter not found",
    } satisfies Metadata;
  }

  const chapterNumber = Number(chapter);
  let title = `Chapter ${chapterNumber}`;
  let description = `Chapter ${chapterNumber} — content loading soon.`;

  const chapterData = getChapterSafe(chapterNumber);

  if (chapterData) {
    const englishTitle = chapterData.meaning.english ?? chapterData.title.english;
    title = `Chapter ${chapterData.number}: ${englishTitle}`;
    description =
      chapterData.summary.english ?? `Study Chapter ${chapterData.number} of the Bhagavad Gita.`;
  }

  return {
    title,
    description,
  } satisfies Metadata;
}

export default function ChapterPage({ params }: ChapterPageProps) {
  const { chapter } = params;

  if (!CHAPTER_PARAM_SET.has(chapter)) {
    notFound();
  }

  const chapterNumber = Number(chapter);
  const chapterData = getChapterSafe(chapterNumber);

  return (
    <div className="space-y-6">
      <Link
        href="/chapters"
        className="inline-flex items-center justify-center rounded-full border border-pearl-300 bg-white/80 px-4 py-2 text-sm font-semibold text-peacock-800 transition hover:border-peacock-300 hover:text-peacock-600"
      >
        ← Back to chapters
      </Link>

      {chapterData ? (
        <ChapterReader chapter={chapterData} />
      ) : (
        <section className="space-y-4 rounded-3xl border border-pearl-200 bg-white/85 p-6 text-center shadow-soft">
          <span className="inline-flex rounded-full bg-sand-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-peacock-800">
            Chapter {chapterNumber.toString().padStart(2, "0")}
          </span>
          <h1 className="font-serif text-3xl text-peacock-900 sm:text-4xl">Chapter {chapterNumber}</h1>
          <p className="text-lg text-ink-600">Chapter {chapterNumber} — content loading soon.</p>
          <p className="text-sm text-ink-500">
            Verses and translations will appear here as soon as the dataset is available.
          </p>
        </section>
      )}
    </div>
  );
}

function getChapterSafe(chapterNumber: number) {
  try {
    return getChapter(chapterNumber);
  } catch {
    return undefined;
  }
}
