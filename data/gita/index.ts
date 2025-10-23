import type {
  GitaChapter,
  GitaTranslationAttribution,
  GitaTranslationSources,
} from "./types";

import chapter1 from "./chapters/1.json";
import chapter2 from "./chapters/2.json";
import chapter3 from "./chapters/3.json";
import chapter4 from "./chapters/4.json";
import chapter5 from "./chapters/5.json";
import chapter6 from "./chapters/6.json";
import chapter7 from "./chapters/7.json";
import chapter8 from "./chapters/8.json";
import chapter9 from "./chapters/9.json";
import chapter10 from "./chapters/10.json";
import chapter11 from "./chapters/11.json";
import chapter12 from "./chapters/12.json";
import chapter13 from "./chapters/13.json";
import chapter14 from "./chapters/14.json";
import chapter15 from "./chapters/15.json";
import chapter16 from "./chapters/16.json";
import chapter17 from "./chapters/17.json";
import chapter18 from "./chapters/18.json";

export const gitaChapters: GitaChapter[] = [
  chapter1 as GitaChapter,
  chapter2 as GitaChapter,
  chapter3 as GitaChapter,
  chapter4 as GitaChapter,
  chapter5 as GitaChapter,
  chapter6 as GitaChapter,
  chapter7 as GitaChapter,
  chapter8 as GitaChapter,
  chapter9 as GitaChapter,
  chapter10 as GitaChapter,
  chapter11 as GitaChapter,
  chapter12 as GitaChapter,
  chapter13 as GitaChapter,
  chapter14 as GitaChapter,
  chapter15 as GitaChapter,
  chapter16 as GitaChapter,
  chapter17 as GitaChapter,
  chapter18 as GitaChapter,
];

export const gitaChaptersByNumber: Map<number, GitaChapter> = new Map(
  gitaChapters.map((chapter) => [chapter.number, chapter]),
);

export const gitaTranslationAttribution = {
  sanskrit: ["Ved Vyasa"],
  hindi: ["Swami Tejomayananda"],
  english: ["A.C. Bhaktivedanta Swami Prabhupada", "Swami Sivananda"],
} as const satisfies GitaTranslationAttribution;

export const gitaTranslationSources = {
  sanskrit: ["slok"],
  hindi: ["tej"],
  english: ["prabhu", "siva"],
} as const satisfies GitaTranslationSources;
