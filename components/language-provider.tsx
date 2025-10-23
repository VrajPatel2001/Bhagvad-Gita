"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import type { GitaLanguage } from "@/data/gita/types";

import { DEFAULT_LANGUAGE, LANGUAGE_STORAGE_KEY } from "@/lib/language";
import { getSupportedLanguages } from "@/lib/gita";

type LanguageContextValue = {
  language: GitaLanguage;
  supportedLanguages: readonly GitaLanguage[];
  setLanguage: (language: GitaLanguage) => void;
};

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const supportedLanguages = useMemo(() => getSupportedLanguages(), []);

  const fallbackLanguage = useMemo(() => {
    return (
      supportedLanguages.find((language) => language === DEFAULT_LANGUAGE) ??
      supportedLanguages[0] ??
      DEFAULT_LANGUAGE
    );
  }, [supportedLanguages]);

  const [language, setLanguageState] = useState<GitaLanguage>(fallbackLanguage);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY) as GitaLanguage | null;

    if (stored && supportedLanguages.includes(stored)) {
      setLanguageState(stored);
    }
  }, [supportedLanguages]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  }, [language]);

  const setLanguage = useCallback(
    (nextLanguage: GitaLanguage) => {
      if (supportedLanguages.includes(nextLanguage)) {
        setLanguageState(nextLanguage);
      }
    },
    [supportedLanguages],
  );

  const value = useMemo(
    () => ({
      language,
      supportedLanguages,
      setLanguage,
    }),
    [language, setLanguage, supportedLanguages],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageContextValue {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }

  return context;
}
