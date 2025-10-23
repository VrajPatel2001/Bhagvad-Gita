export const GITA_LANGUAGES = ["sanskrit", "hindi", "english"] as const;

export type GitaLanguage = (typeof GITA_LANGUAGES)[number];

export type GitaVerseText = Record<GitaLanguage, string>;

export type GitaVerseTranslators = Record<GitaLanguage, string>;

export type GitaVerseSources = Record<GitaLanguage, string>;

export interface GitaVerse {
  id: string;
  chapter: number;
  number: number;
  transliteration: string;
  text: GitaVerseText;
  translators: GitaVerseTranslators;
  sources: GitaVerseSources;
}

export interface GitaChapterTitle {
  sanskrit: string;
  english: string;
  transliteration: string;
}

export interface GitaChapterMeaning {
  english: string;
  hindi: string;
}

export interface GitaChapterSummary {
  english: string;
  hindi: string;
}

export interface GitaChapter {
  number: number;
  versesCount: number;
  title: GitaChapterTitle;
  meaning: GitaChapterMeaning;
  summary: GitaChapterSummary;
  verses: GitaVerse[];
}

export type GitaTranslationAttribution = Record<GitaLanguage, readonly string[]>;

export type GitaTranslationSources = Record<GitaLanguage, readonly string[]>;
