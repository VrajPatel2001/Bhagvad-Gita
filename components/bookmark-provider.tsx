"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import {
  BOOKMARK_STORAGE_EVENT,
  BOOKMARK_STORAGE_KEY,
  parseBookmarks,
  serializeBookmarks,
} from "@/lib/bookmarks";

const BookmarkContext = createContext<BookmarkContextValue | undefined>(undefined);

export function BookmarkProvider({ children }: { children: React.ReactNode }) {
  const [bookmarks, setBookmarks] = useState<Set<string>>(() => getStoredBookmarks());

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const syncFromStorage = () => {
      setBookmarks(getStoredBookmarks());
    };

    const handleStorage = (event: StorageEvent) => {
      if (event.key === BOOKMARK_STORAGE_KEY) {
        syncFromStorage();
      }
    };

    syncFromStorage();

    window.addEventListener("storage", handleStorage);
    window.addEventListener(BOOKMARK_STORAGE_EVENT, syncFromStorage as EventListener);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener(BOOKMARK_STORAGE_EVENT, syncFromStorage as EventListener);
    };
  }, []);

  const updateBookmarks = useCallback((mutator: (current: Set<string>) => Set<string>) => {
    setBookmarks((current) => {
      const next = mutator(current);
      const normalized = next instanceof Set ? next : new Set(next);

      if (setsAreEqual(current, normalized)) {
        return current;
      }

      persistBookmarks(normalized);
      return normalized;
    });
  }, []);

  const addBookmark = useCallback(
    (verseId: string) => {
      updateBookmarks((current) => {
        if (current.has(verseId)) {
          return current;
        }

        const next = new Set(current);
        next.add(verseId);
        return next;
      });
    },
    [updateBookmarks],
  );

  const removeBookmark = useCallback(
    (verseId: string) => {
      updateBookmarks((current) => {
        if (!current.has(verseId)) {
          return current;
        }

        const next = new Set(current);
        next.delete(verseId);
        return next;
      });
    },
    [updateBookmarks],
  );

  const toggleBookmark = useCallback(
    (verseId: string) => {
      updateBookmarks((current) => {
        const next = new Set(current);
        if (next.has(verseId)) {
          next.delete(verseId);
        } else {
          next.add(verseId);
        }
        return next;
      });
    },
    [updateBookmarks],
  );

  const clearBookmarks = useCallback(() => {
    updateBookmarks(() => new Set());
  }, [updateBookmarks]);

  const value = useMemo<BookmarkContextValue>(
    () => ({
      bookmarks,
      addBookmark,
      removeBookmark,
      toggleBookmark,
      clearBookmarks,
      isBookmarked: (verseId: string) => bookmarks.has(verseId),
    }),
    [addBookmark, bookmarks, clearBookmarks, removeBookmark, toggleBookmark],
  );

  return <BookmarkContext.Provider value={value}>{children}</BookmarkContext.Provider>;
}

export function useBookmarks(): BookmarkContextValue {
  const context = useContext(BookmarkContext);

  if (!context) {
    throw new Error("useBookmarks must be used within a BookmarkProvider");
  }

  return context;
}

function getStoredBookmarks(): Set<string> {
  if (typeof window === "undefined") {
    return new Set();
  }

  return new Set(parseBookmarks(window.localStorage.getItem(BOOKMARK_STORAGE_KEY)));
}

function persistBookmarks(bookmarks: Set<string>) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(BOOKMARK_STORAGE_KEY, serializeBookmarks(bookmarks));
  window.dispatchEvent(new Event(BOOKMARK_STORAGE_EVENT));
}

function setsAreEqual(a: Set<string>, b: Set<string>): boolean {
  if (a.size !== b.size) {
    return false;
  }

  for (const value of a) {
    if (!b.has(value)) {
      return false;
    }
  }

  return true;
}

type BookmarkContextValue = {
  bookmarks: ReadonlySet<string>;
  isBookmarked: (verseId: string) => boolean;
  addBookmark: (verseId: string) => void;
  removeBookmark: (verseId: string) => void;
  toggleBookmark: (verseId: string) => void;
  clearBookmarks: () => void;
};
