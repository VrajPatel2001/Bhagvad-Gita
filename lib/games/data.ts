import { gitaChapters } from "@/data/gita";
import type { GitaVerse, GitaLanguage } from "@/data/gita/types";

const ALL_VERSES: GitaVerse[] = gitaChapters.flatMap((chapter) => chapter.verses);

export function shuffle<T>(items: T[]): T[] {
  const clone = [...items];
  for (let i = clone.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [clone[i], clone[j]] = [clone[j], clone[i]];
  }
  return clone;
}

export function getRandomInt(max: number): number {
  return Math.floor(Math.random() * max);
}

type VerseSelectorOptions = {
  excludeIds?: Set<string>;
  filter?: (verse: GitaVerse) => boolean;
};

export function pickRandomVerses(count: number, options: VerseSelectorOptions = {}): GitaVerse[] {
  const { excludeIds, filter } = options;
  const candidates = filter ? ALL_VERSES.filter(filter) : ALL_VERSES;
  if (candidates.length <= count) {
    return shuffle(candidates).slice(0, count);
  }

  const selected: GitaVerse[] = [];
  const usedIds = new Set<string>(excludeIds ? Array.from(excludeIds) : []);

  while (selected.length < count && usedIds.size < candidates.length) {
    const candidate = candidates[getRandomInt(candidates.length)];
    if (usedIds.has(candidate.id)) {
      continue;
    }

    usedIds.add(candidate.id);
    selected.push(candidate);
  }

  return selected;
}

export function selectRandomVerse(): GitaVerse {
  return ALL_VERSES[getRandomInt(ALL_VERSES.length)];
}

export function versePrompt(verse: GitaVerse): string {
  return `Chapter ${verse.chapter}, Verse ${verse.number}`;
}

export function trimWhitespace(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

export function verseSnippet(
  verse: GitaVerse,
  language: GitaLanguage = "english",
  maxLength = 160,
): string {
  const text = trimWhitespace(verse.text[language]);
  if (text.length <= maxLength) {
    return text;
  }

  const truncated = text.slice(0, maxLength);
  const lastSpace = truncated.lastIndexOf(" ");
  return `${truncated.slice(0, lastSpace)}…`;
}

export function getDistinctTranslations(
  count: number,
  excludeVerseIds: Set<string>,
): string[] {
  const translations = ALL_VERSES.filter((verse) => !excludeVerseIds.has(verse.id)).map((verse) => verse.text.english);
  return shuffle(translations).slice(0, count).map(trimWhitespace);
}

const WORD_REGEX = /[A-Za-z']+/g;

export function pickBlankWord(verse: GitaVerse): {
  word: string;
  masked: string;
} | null {
  const text = trimWhitespace(verse.text.english);
  const matches = text.match(WORD_REGEX);
  if (!matches || matches.length === 0) {
    return null;
  }

  const candidates = matches.filter((word) => word.length >= 4);
  if (candidates.length === 0) {
    return null;
  }

  const word = candidates[getRandomInt(candidates.length)];
  const masked = text.replace(new RegExp(`\\b${word}\\b`), "_____");
  return { word, masked };
}

export function getRandomWords(count: number, excludeWord: string): string[] {
  const words = new Set<string>();

  while (words.size < count) {
    const verse = selectRandomVerse();
    const match = trimWhitespace(verse.text.english).match(WORD_REGEX);
    if (!match) {
      continue;
    }

    const candidate = match[getRandomInt(match.length)];
    if (!candidate || candidate.length < 4 || candidate.toLowerCase() === excludeWord.toLowerCase()) {
      continue;
    }

    words.add(candidate);
  }

  return Array.from(words);
}

export function buildMemoryPairs(count: number): Array<{
  id: string;
  verse: GitaVerse;
  transliteration: string;
  english: string;
}> {
  const verses = pickRandomVerses(count);
  return verses.map((verse) => ({
    id: verse.id,
    verse,
    transliteration: trimWhitespace(verse.transliteration),
    english: trimWhitespace(verse.text.english),
  }));
}

export function groupTranslations(batchSize: number): GitaVerse[] {
  return pickRandomVerses(batchSize);
}
