export interface VerseContent {
  text: string;
  transliteration: string;
  wordMeanings: string;
  translation: string;
  commentary: string | null;
}

export interface Verse extends VerseContent {
  id: string;
  chapterNumber: number;
  verseNumber: number;
}

export interface ChapterName {
  original: string;
  translation: string;
  transliteration: string;
  meaning: string;
}

export interface ChapterSummary {
  english: string;
  hindi?: string;
}

export interface ChapterMetadata {
  chapterNumber: number;
  slug: string;
  name: ChapterName;
  summary: ChapterSummary;
  versesCount: number;
}

export interface ChapterData extends ChapterMetadata {
  verses: Verse[];
}

export interface BhagavadGitaMetadata {
  chaptersCount: number;
  totalVerses: number;
  source: {
    sanskrit: {
      repository: string;
      license: string;
    };
    translation: {
      translator: string;
      edition: string;
      publicDomain: boolean;
      reference: string;
    };
  };
  generatedAt: string;
}

export interface VerseSearchMatch {
  chapter: ChapterMetadata;
  verse: Verse;
  matchedFields: Array<keyof VerseContent>;
}

export interface VerseSearchOptions {
  fields?: Array<keyof VerseContent>;
  chapterNumbers?: number[];
  limit?: number;
  caseSensitive?: boolean;
}
