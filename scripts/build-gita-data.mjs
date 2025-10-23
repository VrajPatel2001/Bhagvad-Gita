import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";

const BASE_URL = "https://raw.githubusercontent.com/vedicscriptures/bhagavad-gita/main";
const OUTPUT_DIR = path.join(process.cwd(), "data", "gita");
const CHAPTERS_DIR = path.join(OUTPUT_DIR, "chapters");
const TOTAL_CHAPTERS = 18;
const MAX_RETRIES = 3;
const REQUEST_DELAY_MS = 30;

const DEFAULT_TRANSLATORS = {
  sanskrit: "Ved Vyasa",
  hindi: "Swami Tejomayananda",
  english: "A.C. Bhaktivedanta Swami Prabhupada",
};

const ENGLISH_TRANSLATION_PREFERENCE = [
  "prabhu",
  "siva",
  "purohit",
  "gambir",
  "adi",
  "san",
  "raman",
  "abhinav",
  "sankar",
];

const SANSKRIT_SOURCE_KEY = "slok";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchJson(url, attempt = 1) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      if (attempt < MAX_RETRIES) {
        await sleep(attempt * 400);
        return fetchJson(url, attempt + 1);
      }
      throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    if (attempt < MAX_RETRIES) {
      await sleep(attempt * 400);
      return fetchJson(url, attempt + 1);
    }

    const failure = new Error(`Failed to fetch ${url}: ${error.message}`);
    failure.cause = error;
    throw failure;
  }
}

function normalizeText(value) {
  if (!value) return "";

  return value
    .replace(/\u00a0/g, " ")
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((line) => line.trim())
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function cleanEnglishText(value) {
  if (!value) return "";

  return value
    .replace(/^(?:\d+[\.\s])+/u, "")
    .replace(/\s*\n\s*/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function toSortedArray(set) {
  return Array.from(set)
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b, "en"));
}

function formatTranslatorSet(set) {
  const values = toSortedArray(set);
  return `[${values.map((value) => JSON.stringify(value)).join(", ")}]`;
}

async function ensureCleanDir(dir) {
  await rm(dir, { recursive: true, force: true });
  await mkdir(dir, { recursive: true });
}

function buildChapterOutput(meta, verses) {
  return {
    number: meta.chapter_number,
    versesCount: meta.verses_count,
    title: {
      sanskrit: normalizeText(meta.name),
      english: normalizeText(meta.translation),
      transliteration: normalizeText(meta.transliteration),
    },
    meaning: {
      english: normalizeText(meta.meaning?.en ?? ""),
      hindi: normalizeText(meta.meaning?.hi ?? ""),
    },
    summary: {
      english: normalizeText(meta.summary?.en ?? ""),
      hindi: normalizeText(meta.summary?.hi ?? ""),
    },
    verses,
  };
}

function buildVerseOutput(raw, translatorSets) {
  const sanskrit = normalizeText(raw.slok ?? "");
  const hindi = normalizeText(raw.tej?.ht ?? "");
  const transliteration = normalizeText(raw.transliteration ?? "");

  let englishRaw = "";
  let englishAuthor = "";
  let englishSourceKey = "";

  for (const key of ENGLISH_TRANSLATION_PREFERENCE) {
    const candidate = raw[key];
    if (candidate?.et) {
      englishRaw = candidate.et;
      englishAuthor = candidate.author ?? englishAuthor;
      englishSourceKey = key;
      break;
    }
  }

  const english = cleanEnglishText(normalizeText(englishRaw));

  if (!sanskrit || !hindi || !english) {
    throw new Error(`Missing verse data for ${raw._id}`);
  }

  const verseTranslators = {
    sanskrit: DEFAULT_TRANSLATORS.sanskrit,
    hindi: normalizeText(raw.tej?.author ?? DEFAULT_TRANSLATORS.hindi),
    english: normalizeText(englishAuthor || DEFAULT_TRANSLATORS.english),
  };

  translatorSets.sanskrit.add(verseTranslators.sanskrit);
  translatorSets.hindi.add(verseTranslators.hindi);
  translatorSets.english.add(verseTranslators.english);

  return {
    id: raw._id,
    chapter: raw.chapter,
    number: raw.verse,
    transliteration,
    text: {
      sanskrit,
      hindi,
      english,
    },
    translators: verseTranslators,
    sources: {
      sanskrit: SANSKRIT_SOURCE_KEY,
      hindi: "tej",
      english: englishSourceKey || ENGLISH_TRANSLATION_PREFERENCE[0],
    },
  };
}

function buildIndexModule(chapterNumbers, translatorSets, translationSources) {
  const imports = chapterNumbers
    .map((chapter) => `import chapter${chapter} from "./chapters/${chapter}.json";`)
    .join("\n");

  const chapterList = chapterNumbers
    .map((chapter) => `  chapter${chapter} as GitaChapter,`)
    .join("\n");

  return `import type {
  GitaChapter,
  GitaTranslationAttribution,
  GitaTranslationSources,
} from "./types";

${imports}

export const gitaChapters: GitaChapter[] = [
${chapterList}
];

export const gitaChaptersByNumber: Map<number, GitaChapter> = new Map(
  gitaChapters.map((chapter) => [chapter.number, chapter]),
);

export const gitaTranslationAttribution = {
  sanskrit: ${formatTranslatorSet(translatorSets.sanskrit)},
  hindi: ${formatTranslatorSet(translatorSets.hindi)},
  english: ${formatTranslatorSet(translatorSets.english)},
} as const satisfies GitaTranslationAttribution;

export const gitaTranslationSources = {
  sanskrit: ${formatTranslatorSet(translationSources.sanskrit)},
  hindi: ${formatTranslatorSet(translationSources.hindi)},
  english: ${formatTranslatorSet(translationSources.english)},
} as const satisfies GitaTranslationSources;
`;
}

async function writeJsonFile(filePath, data) {
  await writeFile(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

async function main() {
  await mkdir(OUTPUT_DIR, { recursive: true });
  await ensureCleanDir(CHAPTERS_DIR);

  const translatorSets = {
    sanskrit: new Set([DEFAULT_TRANSLATORS.sanskrit]),
    hindi: new Set(),
    english: new Set(),
  };

  const translationSourceKeys = {
    sanskrit: new Set([SANSKRIT_SOURCE_KEY]),
    hindi: new Set(),
    english: new Set(),
  };

  const generatedChapters = [];
  let totalVerses = 0;

  for (let chapterNumber = 1; chapterNumber <= TOTAL_CHAPTERS; chapterNumber += 1) {
    const chapterMetaUrl = `${BASE_URL}/chapter/bhagavadgita_chapter_${chapterNumber}.json`;
    const chapterMeta = await fetchJson(chapterMetaUrl);

    const verses = [];
    for (let verseNumber = 1; verseNumber <= chapterMeta.verses_count; verseNumber += 1) {
      const verseUrl = `${BASE_URL}/slok/bhagavadgita_chapter_${chapterNumber}_slok_${verseNumber}.json`;
      const rawVerse = await fetchJson(verseUrl);
      const verse = buildVerseOutput(rawVerse, translatorSets);
      verses.push(verse);
      translationSourceKeys.sanskrit.add(verse.sources.sanskrit);
      translationSourceKeys.hindi.add(verse.sources.hindi);
      translationSourceKeys.english.add(verse.sources.english);
      await sleep(REQUEST_DELAY_MS);
    }

    const chapterOutput = buildChapterOutput(chapterMeta, verses);
    const chapterPath = path.join(CHAPTERS_DIR, `${chapterNumber}.json`);
    await writeJsonFile(chapterPath, chapterOutput);
    generatedChapters.push(chapterNumber);
    totalVerses += verses.length;
    console.log(`Generated chapter ${chapterNumber} (${verses.length} verses)`);
  }

  if (translatorSets.hindi.size === 0) {
    translatorSets.hindi.add(DEFAULT_TRANSLATORS.hindi);
  }

  if (translatorSets.english.size === 0) {
    translatorSets.english.add(DEFAULT_TRANSLATORS.english);
  }

  if (translationSourceKeys.hindi.size === 0) {
    translationSourceKeys.hindi.add("tej");
  }

  if (translationSourceKeys.english.size === 0) {
    translationSourceKeys.english.add(ENGLISH_TRANSLATION_PREFERENCE[0]);
  }

  const indexModule = buildIndexModule(generatedChapters, translatorSets, translationSourceKeys);
  await writeFile(path.join(OUTPUT_DIR, "index.ts"), indexModule, "utf8");

  const manifest = {
    source: {
      repository: "https://github.com/vedicscriptures/bhagavad-gita",
      fetchedAt: new Date().toISOString(),
    },
    translators: {
      sanskrit: toSortedArray(translatorSets.sanskrit),
      hindi: toSortedArray(translatorSets.hindi),
      english: toSortedArray(translatorSets.english),
    },
    sources: {
      sanskrit: toSortedArray(translationSourceKeys.sanskrit),
      hindi: toSortedArray(translationSourceKeys.hindi),
      english: toSortedArray(translationSourceKeys.english),
    },
    statistics: {
      chapters: generatedChapters.length,
      verses: totalVerses,
    },
  };

  await writeJsonFile(path.join(OUTPUT_DIR, "manifest.json"), manifest);

  console.log("Multilingual Gita dataset generated successfully.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
