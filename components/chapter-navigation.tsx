"use client";

import { useId, useMemo, useSyncExternalStore } from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { getChapterDisplayInfo } from "@/lib/language";
import { listChapters } from "@/lib/gita";
import { cn } from "@/lib/utils";

import { useLanguage } from "./language-provider";

type ChapterNavigationProps = {
  variant?: "desktop" | "mobile";
  onNavigate?: () => void;
  onDismiss?: () => void;
};

const chapters = listChapters();

function useHashTracker(track: boolean): string {
  return useSyncExternalStore(
    (onChange) => {
      if (typeof window === "undefined" || !track) {
        return () => {};
      }

      window.addEventListener("hashchange", onChange);
      return () => {
        window.removeEventListener("hashchange", onChange);
      };
    },
    () => {
      if (typeof window === "undefined" || !track) {
        return "";
      }

      return window.location.hash;
    },
    () => "",
  );
}

export function ChapterNavigation({ variant = "desktop", onNavigate, onDismiss }: ChapterNavigationProps) {
  const { language } = useLanguage();
  const pathname = usePathname();
  const trackHash = pathname === "/chapters";
  const activeHash = useHashTracker(trackHash);

  const containerStyles = useMemo(
    () =>
      cn(
        "flex h-full w-full max-w-md flex-col bg-sand-25/95 backdrop-blur",
        variant === "desktop" && "border-r border-pearl-200/70",
        variant === "mobile" && "shadow-2xl",
      ),
    [variant],
  );

  const heading = useMemo(() => {
    switch (language) {
      case "sanskrit":
        return "अध्याय";
      case "hindi":
        return "अध्याय मार्ग";
      case "english":
      default:
        return "Study path";
    }
  }, [language]);

  const headingId = useId();

  return (
    <div className={containerStyles}>
      <header className="flex items-center justify-between gap-4 border-b border-pearl-200/60 px-6 py-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-ink-400">{heading}</p>
          <h2 id={headingId} className="font-serif text-lg text-peacock-900">
            Bhagavad Gita chapters
          </h2>
        </div>
        {variant === "mobile" ? (
          <button
            type="button"
            onClick={onDismiss}
            aria-label="Close chapter navigation"
            className="inline-flex rounded-full border border-pearl-300 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-peacock-800 transition hover:border-peacock-200 hover:text-peacock-600"
          >
            Close
          </button>
        ) : null}
      </header>
      <nav className="flex-1 overflow-y-auto px-3 py-4" aria-labelledby={headingId}>
        <ul className="flex flex-col gap-2">
          {chapters.map((chapter) => {
            const targetHash = `#chapter-${chapter.number}`;
            const isActive = pathname === "/chapters" && activeHash === targetHash;
            const { primary, secondary } = getChapterDisplayInfo(chapter, language);

            return (
              <li key={chapter.number}>
                <Link
                  href={`/chapters${targetHash}`}
                  onClick={() => {
                    onNavigate?.();
                  }}
                  aria-current={isActive ? "location" : undefined}
                  className={cn(
                    "group flex flex-col gap-1 rounded-3xl border border-transparent bg-white/70 px-4 py-3 text-left transition hover:border-peacock-100 hover:bg-white/90",
                    isActive && "border-peacock-200 bg-lotus-100/70 shadow-soft",
                  )}
                >
                  <span className="text-xs font-semibold uppercase tracking-[0.35em] text-peacock-700">
                    Chapter {chapter.number.toString().padStart(2, "0")}
                  </span>
                  <span className="font-serif text-base text-peacock-900 transition group-hover:text-peacock-800">
                    {primary}
                  </span>
                  <span className="text-xs text-ink-500 transition group-hover:text-ink-600">{secondary}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <footer className="border-t border-pearl-200/60 px-6 py-4">
        <p className="text-xs text-ink-500">
          Verse counts and translations sourced from trusted commentaries. More study companions are
          on the way.
        </p>
      </footer>
    </div>
  );
}
