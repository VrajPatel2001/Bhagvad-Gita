"use client";

import { useMemo } from "react";

import { useBookmarks } from "@/components/bookmark-provider";
import { cn } from "@/lib/utils";

type VerseBookmarkButtonProps = {
  verseId: string;
  verseLabel: string;
  showLabel?: boolean;
  size?: "sm" | "md";
};

export function VerseBookmarkButton({
  verseId,
  verseLabel,
  showLabel = false,
  size = "sm",
}: VerseBookmarkButtonProps) {
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const isActive = isBookmarked(verseId);

  const buttonLabel = useMemo(
    () => `${isActive ? "Remove bookmark" : "Add bookmark"} for ${verseLabel}`,
    [isActive, verseLabel],
  );

  return (
    <button
      type="button"
      onClick={() => toggleBookmark(verseId)}
      aria-pressed={isActive}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border transition focus:outline-none focus:ring-2 focus:ring-peacock-200",
        size === "md" ? "px-4 py-2 text-sm" : "px-3 py-1.5 text-xs",
        isActive
          ? "border-saffron-500 bg-saffron-200/70 text-saffron-700 shadow-soft"
          : "border-pearl-300 bg-white/70 text-peacock-800 shadow-soft hover:border-peacock-200 hover:text-peacock-600",
      )}
    >
      <span aria-hidden className={cn(size === "md" ? "text-lg" : "text-base", "leading-none")}>
        {isActive ? "★" : "☆"}
      </span>
      {showLabel ? (
        <span className="text-xs font-semibold uppercase tracking-[0.3em]">
          {isActive ? "Saved" : "Save"}
        </span>
      ) : null}
      <span className="sr-only">{buttonLabel}</span>
    </button>
  );
}
