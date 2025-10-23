import {
  gitaChapters,
  gitaChaptersByNumber,
  gitaTranslationAttribution,
  gitaTranslationSources,
} from "@/data/gita";
import { GITA_LANGUAGES } from "@/data/gita/types";
import type { GitaChapter, GitaLanguage, GitaVerse } from "@/data/gita/types";

const verseIndexByChapter = new Map<number, Map<number, GitaVerse>>();
const verseIndexById = new Map<string, GitaVerse>();

for (const chapter of gitaChapters) {
  let chapterIndex = verseIndexByChapter.get(chapter.number);
  if (!chapterIndex) {
    chapterIndex = new Map<number, GitaVerse>();
    verseIndexByChapter.set(chapter.number, chapterIndex);
  }

  for (const verse of chapter.verses) {
    chapterIndex.set(verse.number, verse);
    verseIndexById.set(verse.id, verse);
  }
}

export function listChapters(): readonly GitaChapter[] {
  return gitaChapters;
}

export function getChapterCount(): number {
  return gitaChapters.length;
}

export function getTotalVerseCount(): number {
  return verseIndexById.size;
}

export function getChapter(chapterNumber: number): GitaChapter | undefined {
  return gitaChaptersByNumber.get(chapterNumber);
}

export function getVerses(chapterNumber: number): readonly GitaVerse[] {
  const chapterMap = verseIndexByChapter.get(chapterNumber);
  return chapterMap ? Array.from(chapterMap.values()) : [];
}

export function getVerse(chapterNumber: number, verseNumber: number): GitaVerse | undefined {
  return verseIndexByChapter.get(chapterNumber)?.get(verseNumber);
}

export function getVerseById(verseId: string): GitaVerse | undefined {
  return verseIndexById.get(verseId);
}

export function getVerseText(
  chapterNumber: number,
  verseNumber: number,
  language: GitaLanguage,
): string | undefined {
  return getVerse(chapterNumber, verseNumber)?.text[language];
}

export function getVerseTranslation(verseId: string, language: GitaLanguage): string | undefined {
  return verseIndexById.get(verseId)?.text[language];
}

export function hasVerse(chapterNumber: number, verseNumber: number): boolean {
  return verseIndexByChapter.get(chapterNumber)?.has(verseNumber) ?? false;
}

export function getSupportedLanguages(): readonly GitaLanguage[] {
  return GITA_LANGUAGES;
}

export function getTranslationAttribution(language: GitaLanguage): readonly string[] {
  return gitaTranslationAttribution[language];
}

export function getTranslationSources(language: GitaLanguage): readonly string[] {
  return gitaTranslationSources[language];
}
