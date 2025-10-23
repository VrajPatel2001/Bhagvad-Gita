import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { VerseDetail } from "@/components/verse-detail";
import { getChapter, listChapters } from "@/lib/gita";

type VersePageProps = {
  params: {
    chapter: string;
    verseNumber: string;
  };
};

export function generateStaticParams() {
  return listChapters().flatMap((chapter) =>
    chapter.verses.map((verse) => ({
      chapter: chapter.number.toString(),
      verseNumber: verse.number.toString(),
    })),
  );
}

export function generateMetadata({ params }: VersePageProps): Metadata {
  const chapterNumber = Number(params.chapter);
  const verseNumber = Number(params.verseNumber);

  if (!Number.isFinite(chapterNumber) || !Number.isFinite(verseNumber)) {
    return {
      title: "Verse not found",
    } satisfies Metadata;
  }

  const chapter = getChapter(chapterNumber);
  const verse = chapter?.verses.find((item) => item.number === verseNumber);

  if (!chapter || !verse) {
    return {
      title: "Verse not found",
    } satisfies Metadata;
  }

  const englishChapterTitle = chapter.meaning.english ?? chapter.title.english;
  const englishTranslation = verse.text.english ?? verse.transliteration ?? "";
  const description = englishTranslation.slice(0, 160);

  return {
    title: `Chapter ${chapter.number}, Verse ${verse.number} · ${englishChapterTitle}`,
    description: description || `Study Chapter ${chapter.number}, Verse ${verse.number} of the Bhagavad Gita.`,
  } satisfies Metadata;
}

export default function VersePage({ params }: VersePageProps) {
  const chapterNumber = Number(params.chapter);
  const verseNumber = Number(params.verseNumber);

  if (!Number.isFinite(chapterNumber) || !Number.isFinite(verseNumber)) {
    notFound();
  }

  const chapter = getChapter(chapterNumber);

  if (!chapter) {
    notFound();
  }

  const verse = chapter.verses.find((item) => item.number === verseNumber);

  if (!verse) {
    notFound();
  }

  const verseIndex = chapter.verses.findIndex((item) => item.id === verse.id);
  const previousVerseNumber = verseIndex > 0 ? chapter.verses[verseIndex - 1]?.number ?? null : null;
  const nextVerseNumber =
    verseIndex >= 0 && verseIndex < chapter.verses.length - 1
      ? chapter.verses[verseIndex + 1]?.number ?? null
      : null;

  return (
    <VerseDetail
      chapter={chapter}
      verse={verse}
      previousVerseNumber={previousVerseNumber}
      nextVerseNumber={nextVerseNumber}
    />
  );
}
