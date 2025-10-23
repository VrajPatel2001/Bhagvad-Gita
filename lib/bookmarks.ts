export const BOOKMARK_STORAGE_KEY = "gita-verse-bookmarks";
export const BOOKMARK_STORAGE_EVENT = "gita:bookmarks-updated";

export function parseBookmarks(raw: string | null): string[] {
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw);

    if (Array.isArray(parsed)) {
      return parsed.filter((value): value is string => typeof value === "string");
    }

    return [];
  } catch (error) {
    console.warn("Failed to parse stored bookmarks", error);
    return [];
  }
}

export function serializeBookmarks(bookmarks: Iterable<string>): string {
  return JSON.stringify(Array.from(new Set(bookmarks)));
}
