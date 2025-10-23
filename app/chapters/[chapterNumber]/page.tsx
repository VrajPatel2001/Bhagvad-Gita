import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ChapterReader } from "@/components/chapter-reader";
import { getChapter, listChapters } from "@/lib/gita";

type ChapterPageProps = {
  params: {
    chapterNumber: string;
  };
};

export function generateStaticParams() {
  return listChapters().map((chapter) => ({
    chapterNumber: chapter.number.toString(),
  }));
}

export function generateMetadata({ params }: ChapterPageProps): Metadata {
  const chapterNumber = Number(params.chapterNumber);

  if (!Number.isFinite(chapterNumber)) {
    return {
      title: "Chapter not found",
    } satisfies Metadata;
  }

  const chapter = getChapter(chapterNumber);

  if (!chapter) {
    return {
      title: "Chapter not found",
    } satisfies Metadata;
  }

  const englishTitle = chapter.meaning.english ?? chapter.title.english;
  const description = chapter.summary.english ?? `Study Chapter ${chapter.number} of the Bhagavad Gita.`;

  return {
    title: `Chapter ${chapter.number}: ${englishTitle}`,
    description,
  } satisfies Metadata;
}

export default function ChapterPage({ params }: ChapterPageProps) {
  const chapterNumber = Number(params.chapterNumber);

  if (!Number.isFinite(chapterNumber)) {
    notFound();
  }

  const chapter = getChapter(chapterNumber);

  if (!chapter) {
    notFound();
  }

  return <ChapterReader chapter={chapter} />;
}
