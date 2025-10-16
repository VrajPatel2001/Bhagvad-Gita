# Bhagavad Gita Data Service

This project packages a normalized copy of the Bhagavad Gita—complete with transliteration, English translation, word meanings, and chapter metadata—and exposes a small TypeScript API for accessing the text.

## Data

- **Sanskrit text, transliteration, and word meanings** are sourced from the [gita/gita](https://github.com/gita/gita) project (Unlicense).
- **English translation** uses the 1935 public-domain edition by **Shri Purohit Swami (with W. B. Yeats)**, available from [Project Gutenberg](https://www.gutenberg.org/ebooks/7435).

The `data/metadata.json` file captures the provenance details alongside computed totals. Each chapter lives in `data/chapters/chapter-<n>.json`, and a lightweight index is available at `data/chapters/index.json`.

## TypeScript API

The entrypoint `src/index.ts` re-exports the main helpers:

- `getBhagavadGitaMetadata()` – global dataset information.
- `getChaptersMetadata()` – lightweight chapter summaries.
- `getChapter(chapterNumber)` / `getAllChapters()` – chapter data with verses.
- `getVerse(chapterNumber, verseNumber)` – specific verse lookup.
- `getRandomVerse(randomGenerator?)` – pull a random verse (optionally inject your own RNG for deterministic behaviour).
- `searchVerses(query, options?)` – simple substring search on translations, transliterations, Sanskrit text, or word meanings.

See `tests/gitaDataService.test.ts` for usage examples and integrity checks.

## Development

```bash
npm install
npm test
```

Vitest enforces data integrity by verifying chapter/verse counts, ordering, and the behaviour of the loader utilities.
