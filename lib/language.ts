import { GITA_LANGUAGES } from "@/data/gita/types";
import type { GitaChapter, GitaLanguage } from "@/data/gita/types";

export const LANGUAGE_STORAGE_KEY = "gita-preferred-language";

export const DEFAULT_LANGUAGE: GitaLanguage = "english";

export const LANGUAGE_LABELS: Record<GitaLanguage, string> = {
  english: "English",
  hindi: "हिन्दी",
  sanskrit: "संस्कृत",
};

type ChapterDisplayInfo = {
  primary: string;
  secondary: string;
};

export function getChapterDisplayInfo(
  chapter: GitaChapter,
  language: GitaLanguage,
): ChapterDisplayInfo {
  switch (language) {
    case "sanskrit":
      return {
        primary: chapter.title.sanskrit,
        secondary: chapter.title.transliteration ?? chapter.title.english,
      };
    case "hindi":
      return {
        primary: chapter.meaning.hindi ?? chapter.title.sanskrit,
        secondary: chapter.meaning.english ?? chapter.title.english,
      };
    case "english":
    default:
      return {
        primary: chapter.meaning.english ?? chapter.title.english,
        secondary: chapter.title.english ?? chapter.title.sanskrit,
      };
  }
}

export function sortLanguagesByPreference(
  languages: Iterable<GitaLanguage>,
  preferredOrder: readonly GitaLanguage[] = GITA_LANGUAGES,
): GitaLanguage[] {
  const orderMap = new Map(preferredOrder.map((lang, index) => [lang, index] as const));
  const uniqueLanguages = Array.from(new Set(languages));

  return uniqueLanguages.sort((a, b) => {
    const aIndex = orderMap.get(a) ?? Number.MAX_SAFE_INTEGER;
    const bIndex = orderMap.get(b) ?? Number.MAX_SAFE_INTEGER;
    return aIndex - bIndex;
  });
}

export function getLanguageLabel(language: GitaLanguage): string {
  return LANGUAGE_LABELS[language] ?? language;
}
