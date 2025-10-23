import { describe, expect, it } from "vitest";

import {
  getChapter,
  getChapterCount,
  getTotalVerseCount,
  getTranslationAttribution,
  getTranslationSources,
  getVerse,
  getVerseById,
  getVerseText,
  hasVerse,
  listChapters,
  getSupportedLanguages,
} from "@/lib/gita";

const EXPECTED_LANGUAGES = ["english", "hindi", "sanskrit"] as const;

describe("gita dataset utilities", () => {
  it("lists all chapters in their canonical order", () => {
    const chapters = listChapters();

    expect(chapters).toHaveLength(18);
    expect(chapters[0].number).toBe(1);
    expect(chapters[chapters.length - 1].number).toBe(18);
  });

  it("provides chapter level access helpers", () => {
    expect(getChapterCount()).toBe(18);

    const chapterOne = getChapter(1);

    expect(chapterOne?.number).toBe(1);
    expect(chapterOne?.meaning.english).toContain("Arjuna");
  });

  it("indexes verses for random access", () => {
    expect(getTotalVerseCount()).toBeGreaterThan(600);
    expect(hasVerse(1, 1)).toBe(true);

    const verse = getVerse(1, 1);
    expect(verse?.id).toBe("BG1.1");

    const byId = getVerseById("BG1.1");
    expect(byId?.number).toBe(1);
  });

  it("returns translated verse text for supported languages", () => {
    const english = getVerseText(1, 1, "english");
    const hindi = getVerseText(1, 1, "hindi");
    const sanskrit = getVerseText(1, 1, "sanskrit");

    expect(english).toContain("Kuruk");
    expect(hindi).toContain("धृतराष्ट्र");
    expect(sanskrit).toContain("कुरुक्षेत्रे");
  });

  it("exposes translation metadata", () => {
    const supported = getSupportedLanguages();

    for (const language of EXPECTED_LANGUAGES) {
      expect(supported).toContain(language);

      const attribution = getTranslationAttribution(language);
      expect(attribution.length).toBeGreaterThan(0);

      const sources = getTranslationSources(language);
      expect(sources.length).toBeGreaterThan(0);
    }
  });
});
