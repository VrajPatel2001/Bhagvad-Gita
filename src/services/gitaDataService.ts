import fs from 'node:fs';
import path from 'node:path';

import {
  BhagavadGitaMetadata,
  ChapterData,
  ChapterMetadata,
  Verse,
  VerseContent,
  VerseSearchMatch,
  VerseSearchOptions,
} from '../types';

const DATA_DIR = path.resolve(__dirname, '../../data');
const CHAPTERS_DIR = path.join(DATA_DIR, 'chapters');
const CHAPTER_INDEX_PATH = path.join(CHAPTERS_DIR, 'index.json');
const METADATA_PATH = path.join(DATA_DIR, 'metadata.json');

const chapterCache = new Map<number, ChapterData>();
let chapterMetadataCache: ChapterMetadata[] | null = null;
let metadataCache: BhagavadGitaMetadata | null = null;

const defaultSearchFields: Array<keyof VerseContent> = [
  'translation',
  'transliteration',
  'text',
  'wordMeanings',
];

interface ChapterIndexFile {
  chapters: ChapterMetadata[];
}

type RandomGenerator = () => number;

type VerseField = keyof VerseContent;

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value));

const ensureDataExists = () => {
  if (!fs.existsSync(DATA_DIR)) {
    throw new Error(`Expected data directory at ${DATA_DIR}`);
  }
  if (!fs.existsSync(CHAPTERS_DIR)) {
    throw new Error(`Expected chapters directory at ${CHAPTERS_DIR}`);
  }
};

const readJsonFile = <T>(filePath: string): T => {
  const raw = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(raw) as T;
};

const assertChapterNumber = (chapterNumber: number) => {
  if (!Number.isInteger(chapterNumber) || chapterNumber <= 0) {
    throw new Error(`Invalid chapter number: ${chapterNumber}`);
  }
};

const loadChapterMetadata = (): ChapterMetadata[] => {
  if (chapterMetadataCache) {
    return chapterMetadataCache;
  }
  ensureDataExists();
  if (!fs.existsSync(CHAPTER_INDEX_PATH)) {
    throw new Error('Missing chapter index data');
  }
  const index = readJsonFile<ChapterIndexFile>(CHAPTER_INDEX_PATH);
  chapterMetadataCache = index.chapters.sort(
    (a, b) => a.chapterNumber - b.chapterNumber,
  );
  return chapterMetadataCache;
};

const loadMetadata = (): BhagavadGitaMetadata => {
  if (metadataCache) {
    return metadataCache;
  }
  ensureDataExists();
  if (!fs.existsSync(METADATA_PATH)) {
    throw new Error('Missing metadata file');
  }
  metadataCache = readJsonFile<BhagavadGitaMetadata>(METADATA_PATH);
  return metadataCache;
};

const buildChapterPath = (chapterNumber: number) =>
  path.join(CHAPTERS_DIR, `chapter-${chapterNumber}.json`);

const loadChapterData = (chapterNumber: number): ChapterData => {
  assertChapterNumber(chapterNumber);
  const metadata = loadChapterMetadata();
  const maxChapter = metadata[metadata.length - 1]?.chapterNumber ?? 0;
  if (chapterNumber > maxChapter) {
    throw new Error(`Chapter number out of range: ${chapterNumber}`);
  }

  if (chapterCache.has(chapterNumber)) {
    return chapterCache.get(chapterNumber)!;
  }

  const chapterPath = buildChapterPath(chapterNumber);
  if (!fs.existsSync(chapterPath)) {
    throw new Error(`Missing chapter data for chapter ${chapterNumber}`);
  }

  const chapter = readJsonFile<ChapterData>(chapterPath);
  chapterCache.set(chapterNumber, chapter);
  return chapter;
};

const findVerse = (chapter: ChapterData, verseNumber: number): Verse | null => {
  if (!Number.isInteger(verseNumber) || verseNumber <= 0) {
    throw new Error(`Invalid verse number: ${verseNumber}`);
  }
  return (
    chapter.verses.find((verse) => verse.verseNumber === verseNumber) ?? null
  );
};

export const getBhagavadGitaMetadata = (): BhagavadGitaMetadata =>
  clone(loadMetadata());

export const getChaptersMetadata = (): ChapterMetadata[] =>
  clone(loadChapterMetadata());

export const getChapter = (chapterNumber: number): ChapterData =>
  clone(loadChapterData(chapterNumber));

export const getAllChapters = (): ChapterData[] =>
  getChaptersMetadata().map((meta) => getChapter(meta.chapterNumber));

export const getVerse = (
  chapterNumber: number,
  verseNumber: number,
): Verse => {
  const chapter = loadChapterData(chapterNumber);
  const verse = findVerse(chapter, verseNumber);
  if (!verse) {
    throw new Error(
      `Verse not found for chapter ${chapterNumber}, verse ${verseNumber}`,
    );
  }
  return clone(verse);
};

export const getRandomVerse = (
  random: RandomGenerator = Math.random,
): VerseSearchMatch => {
  const metadata = loadChapterMetadata();
  const totalVerses = metadata.reduce(
    (sum, chapter) => sum + chapter.versesCount,
    0,
  );
  if (totalVerses === 0) {
    throw new Error('There are no verses to choose from');
  }
  const r = random();
  if (Number.isNaN(r)) {
    throw new Error('Random generator returned NaN');
  }
  const randomIndex = Math.min(
    Math.floor(Math.max(r, 0) * totalVerses),
    totalVerses - 1,
  );

  let cumulative = 0;
  for (const chapterMeta of metadata) {
    const start = cumulative;
    const end = cumulative + chapterMeta.versesCount;
    if (randomIndex >= start && randomIndex < end) {
      const verseNumber = randomIndex - start + 1;
      const verse = getVerse(chapterMeta.chapterNumber, verseNumber);
      return {
        chapter: clone(chapterMeta),
        verse,
        matchedFields: ['translation'],
      };
    }
    cumulative = end;
  }

  throw new Error('Failed to select a random verse');
};

const normalizeSearchValue = (
  value: string,
  caseSensitive: boolean,
): string => (caseSensitive ? value : value.toLowerCase());

const getFieldValue = (verse: Verse, field: VerseField): string => verse[field];

export const searchVerses = (
  query: string,
  options: VerseSearchOptions = {},
): VerseSearchMatch[] => {
  const trimmedQuery = query.trim();
  if (!trimmedQuery) {
    throw new Error('Query must not be empty');
  }

  const fields = options.fields?.length
    ? options.fields
    : defaultSearchFields;
  const caseSensitive = options.caseSensitive ?? false;
  const normalizedQuery = normalizeSearchValue(trimmedQuery, caseSensitive);

  const metadata = loadChapterMetadata();
  const allowedChapters = new Set(
    (options.chapterNumbers ?? metadata.map((chapter) => chapter.chapterNumber))
      .filter((chapterNumber) => {
        assertChapterNumber(chapterNumber);
        return true;
      }),
  );

  const limit = options.limit && options.limit > 0 ? options.limit : undefined;
  const matches: VerseSearchMatch[] = [];

  for (const chapterMeta of metadata) {
    if (!allowedChapters.has(chapterMeta.chapterNumber)) {
      continue;
    }
    const chapter = loadChapterData(chapterMeta.chapterNumber);
    for (const verse of chapter.verses) {
      const matchedFields = fields.filter((field) => {
        const value = getFieldValue(verse, field);
        if (!value) {
          return false;
        }
        const haystack = normalizeSearchValue(value, caseSensitive);
        return haystack.includes(normalizedQuery);
      });

      if (matchedFields.length > 0) {
        matches.push({
          chapter: clone(chapterMeta),
          verse: clone(verse),
          matchedFields: matchedFields as VerseField[],
        });

        if (limit && matches.length >= limit) {
          return matches;
        }
      }
    }
  }

  return matches;
};
