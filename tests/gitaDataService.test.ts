import {
  getAllChapters,
  getBhagavadGitaMetadata,
  getChapter,
  getChaptersMetadata,
  getRandomVerse,
  getVerse,
  searchVerses,
} from '../src';

describe('Bhagavad Gita data integrity', () => {
  it('exposes consistent metadata', () => {
    const metadata = getBhagavadGitaMetadata();
    expect(metadata.chaptersCount).toBe(18);
    expect(metadata.totalVerses).toBe(701);

    const chapterMetadata = getChaptersMetadata();
    expect(chapterMetadata).toHaveLength(metadata.chaptersCount);

    const totalVersesFromChapters = chapterMetadata.reduce(
      (sum, chapter) => sum + chapter.versesCount,
      0,
    );

    expect(totalVersesFromChapters).toBe(metadata.totalVerses);
  });

  it('ensures every chapter has sequential verses with matching identifiers', () => {
    const chapterMetadata = getChaptersMetadata();

    for (const meta of chapterMetadata) {
      const chapter = getChapter(meta.chapterNumber);

      expect(chapter.versesCount).toBe(meta.versesCount);
      expect(chapter.name).toEqual(meta.name);
      expect(chapter.summary).toEqual(meta.summary);

      chapter.verses.forEach((verse, index) => {
        expect(verse.chapterNumber).toBe(meta.chapterNumber);
        expect(verse.verseNumber).toBe(index + 1);
        expect(verse.id).toBe(`${meta.chapterNumber}.${index + 1}`);
        expect(verse.translation.length).toBeGreaterThan(0);
        expect(verse.transliteration.length).toBeGreaterThan(0);
      });
    }
  });

  it('provides access to a specific verse', () => {
    const verse = getVerse(2, 47);
    expect(verse.id).toBe('2.47');
    expect(verse.translation).toContain('right to work');
  });

  it('selects a deterministic random verse when supplied with a generator', () => {
    const firstVerse = getRandomVerse(() => 0);
    expect(firstVerse.chapter.chapterNumber).toBe(1);
    expect(firstVerse.verse.verseNumber).toBe(1);

    const lastVerse = getRandomVerse(() => 0.99999999);
    expect(lastVerse.chapter.chapterNumber).toBe(18);
    expect(lastVerse.verse.id).toBe('18.78');
  });

  it('supports verse search with filtering options', () => {
    const matches = searchVerses('right to work', {
      fields: ['translation'],
      limit: 3,
      chapterNumbers: [2],
    });

    expect(matches.length).toBeGreaterThan(0);
    expect(matches[0].chapter.chapterNumber).toBe(2);
    expect(matches[0].matchedFields).toContain('translation');
    expect(matches[0].verse.translation).toContain('right to work');
  });

  it('throws on empty search queries', () => {
    expect(() => searchVerses('   ')).toThrowError('Query must not be empty');
  });

  it('loads all chapters when requested', () => {
    const chapters = getAllChapters();
    expect(chapters).toHaveLength(18);

    const verseCount = chapters.reduce((sum, chapter) => sum + chapter.verses.length, 0);
    expect(verseCount).toBe(701);
  });
});
