"use client";

import { useId } from "react";

import type { GitaLanguage } from "@/data/gita/types";

import { LANGUAGE_LABELS } from "@/lib/language";

import { useLanguage } from "./language-provider";

export function LanguageSwitcher() {
  const { language, supportedLanguages, setLanguage } = useLanguage();
  const selectId = useId();

  return (
    <div className="flex items-center gap-2">
      <label
        htmlFor={selectId}
        className="hidden text-xs font-semibold uppercase tracking-[0.2em] text-ink-500 sm:inline"
      >
        Language
      </label>
      <div className="relative">
        <select
          id={selectId}
          value={language}
          aria-label="Select language"
          onChange={(event) => setLanguage(event.target.value as GitaLanguage)}
          className="appearance-none rounded-full border border-pearl-300 bg-white/80 px-4 py-2 pr-10 text-sm font-semibold text-peacock-900 shadow-soft transition focus:border-peacock-300 focus:outline-none focus:ring-2 focus:ring-peacock-200"
        >
          {supportedLanguages.map((supportedLanguage) => (
            <option key={supportedLanguage} value={supportedLanguage}>
              {LANGUAGE_LABELS[supportedLanguage] ?? supportedLanguage}
            </option>
          ))}
        </select>
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-ink-400"
        >
          ▾
        </span>
      </div>
    </div>
  );
}
