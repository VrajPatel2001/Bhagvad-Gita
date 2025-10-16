import { gitaChapters } from "./data/gita.js";

const STORAGE_KEY = "gita-reader-state-v1";
const elements = {
  chapterSelect: document.getElementById("chapterSelect"),
  prevChapter: document.getElementById("prevChapter"),
  nextChapter: document.getElementById("nextChapter"),
  verseCount: document.getElementById("verseCount"),
  chapterSummary: document.getElementById("chapterSummary"),
  transliterationToggle: document.getElementById("transliterationToggle"),
  notesToggle: document.getElementById("notesToggle"),
  searchInput: document.getElementById("searchInput"),
  versesContainer: document.getElementById("versesContainer"),
  tocList: document.getElementById("tocList"),
  tocCount: document.getElementById("tocCount"),
  progressBar: document.getElementById("progressBar"),
  progressText: document.getElementById("progressText"),
  resetState: document.getElementById("resetState"),
  srAnnouncer: document.getElementById("srAnnouncer"),
};

const state = {
  chapters: gitaChapters,
  currentChapterIndex: 0,
  showTransliteration: true,
  showNotes: true,
  bookmarks: new Set(),
  highlights: new Set(),
  notes: {},
  searchTerm: "",
  lastRead: { chapter: gitaChapters[0]?.number ?? 1, verse: 1 },
  filteredVerses: [],
  verseObserver: null,
  currentActiveVerse: null,
};

let saveTimer = null;

function init() {
  restoreState();
  renderChapterOptions();
  attachEventListeners();
  applyPreferences();
  const initialChapterIndex = determineInitialChapterIndex();
  setCurrentChapter(initialChapterIndex, {
    scrollToVerse:
      state.lastRead.chapter === state.chapters[initialChapterIndex]?.number
        ? state.lastRead.verse
        : null,
  });

  if (state.searchTerm) {
    elements.searchInput.value = state.searchTerm;
  }
}

function determineInitialChapterIndex() {
  const chapterNumber = state.lastRead?.chapter;
  const index = state.chapters.findIndex((chapter) => chapter.number === chapterNumber);
  return index >= 0 ? index : 0;
}

function restoreState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;

    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed.bookmarks)) {
      state.bookmarks = new Set(parsed.bookmarks);
    }
    if (Array.isArray(parsed.highlights)) {
      state.highlights = new Set(parsed.highlights);
    }
    if (parsed.notes && typeof parsed.notes === "object") {
      state.notes = parsed.notes;
    }
    if (typeof parsed.searchTerm === "string") {
      state.searchTerm = parsed.searchTerm;
    }
    if (parsed.lastRead && typeof parsed.lastRead === "object") {
      const { chapter, verse } = parsed.lastRead;
      if (typeof chapter === "number" && typeof verse === "number") {
        state.lastRead = { chapter, verse };
      }
    }
    if (typeof parsed.showTransliteration === "boolean") {
      state.showTransliteration = parsed.showTransliteration;
    }
    if (typeof parsed.showNotes === "boolean") {
      state.showNotes = parsed.showNotes;
    }
  } catch (error) {
    console.warn("Unable to restore reader state", error);
  }
}

function saveState() {
  if (saveTimer) {
    window.clearTimeout(saveTimer);
  }

  saveTimer = window.setTimeout(() => {
    const payload = {
      bookmarks: Array.from(state.bookmarks),
      highlights: Array.from(state.highlights),
      notes: state.notes,
      searchTerm: state.searchTerm,
      showTransliteration: state.showTransliteration,
      showNotes: state.showNotes,
      lastRead: state.lastRead,
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (error) {
      console.warn("Unable to persist reader state", error);
    }
  }, 160);
}

function applyPreferences() {
  document.body.classList.toggle("show-transliteration", state.showTransliteration);
  document.body.classList.toggle("show-notes", state.showNotes);
  elements.transliterationToggle.checked = state.showTransliteration;
  elements.notesToggle.checked = state.showNotes;
}

function renderChapterOptions() {
  elements.chapterSelect.innerHTML = "";
  state.chapters.forEach((chapter, index) => {
    const option = document.createElement("option");
    option.value = String(index);
    option.textContent = `${chapter.number}. ${chapter.name}`;
    elements.chapterSelect.appendChild(option);
  });
}

function setCurrentChapter(newIndex, { scrollToVerse = null, shouldAnnounce = false } = {}) {
  const boundedIndex = Math.max(0, Math.min(newIndex, state.chapters.length - 1));
  state.currentChapterIndex = boundedIndex;
  const chapter = state.chapters[boundedIndex];
  if (!chapter) {
    return;
  }

  elements.chapterSelect.value = String(boundedIndex);
  elements.verseCount.textContent = `${chapter.verses.length} verses`;
  elements.chapterSummary.textContent = chapter.summary ?? "";

  updateNavigationButtons();
  renderVerses(chapter);
  renderTableOfContents(chapter);
  setupScrollSpy();

  if (scrollToVerse) {
    window.requestAnimationFrame(() => {
      scrollToVerseElement(chapter.number, scrollToVerse);
    });
  }

  if (shouldAnnounce) {
    announce(`Chapter ${chapter.number}: ${chapter.name}`);
  }
}

function renderVerses(chapter) {
  const filtered = filterVerses(chapter, state.searchTerm);
  state.filteredVerses = filtered.map((verse) => verse.number);

  elements.versesContainer.innerHTML = "";

  if (filtered.length === 0) {
    state.currentActiveVerse = null;
    const noResult = document.createElement("div");
    noResult.className = "no-results";
    noResult.textContent = "No verses match your search in this chapter.";
    elements.versesContainer.appendChild(noResult);
    updateProgress(null);
    elements.tocCount.textContent = "0 found";
    return;
  }

  if (!state.filteredVerses.includes(state.currentActiveVerse)) {
    state.currentActiveVerse = state.filteredVerses[0] ?? null;
  }

  filtered.forEach((verse) => {
    const verseElement = createVerseElement(chapter, verse);
    elements.versesContainer.appendChild(verseElement);
  });

  elements.tocCount.textContent = `${filtered.length} verse${filtered.length === 1 ? "" : "s"}`;
  updateProgress(state.currentActiveVerse ?? filtered[0].number ?? null);
}

function filterVerses(chapter, query) {
  if (!query || !query.trim()) {
    return chapter.verses;
  }
  const normalized = query.trim().toLowerCase();
  return chapter.verses.filter((verse) => {
    const haystacks = [
      verse.sanskrit,
      verse.transliteration,
      verse.translation,
      Array.isArray(verse.keywords) ? verse.keywords.join(" ") : "",
    ];
    return haystacks.some((field) => field && field.toLowerCase().includes(normalized));
  });
}

function createVerseElement(chapter, verse) {
  const chapterNumber = chapter.number;
  const key = makeVerseKey(chapterNumber, verse.number);
  const isBookmarked = state.bookmarks.has(key);
  const isHighlighted = state.highlights.has(key);
  const note = getNote(chapterNumber, verse.number);

  const container = document.createElement("article");
  container.className = "verse";
  container.dataset.chapterNumber = String(chapterNumber);
  container.dataset.verseNumber = String(verse.number);
  container.id = `chapter-${chapterNumber}-verse-${verse.number}`;
  if (isBookmarked) {
    container.classList.add("is-bookmarked");
  }
  if (isHighlighted) {
    container.classList.add("is-highlighted");
  }

  container.innerHTML = `
    <header class="verse-header">
      <div class="verse-title">
        <span class="verse-number">Verse ${chapterNumber}:${verse.number}</span>
        <div class="verse-meta">
          <span>${chapter.subtitle ?? ""}</span>
          ${Array.isArray(verse.keywords) && verse.keywords.length > 0 ? `<span>• ${verse.keywords.join(", ")}</span>` : ""}
        </div>
      </div>
      <div class="verse-actions">
        <button class="verse-action" type="button" data-action="bookmark" data-active="${isBookmarked}">
          <span aria-hidden="true">🔖</span>
          Bookmark
        </button>
        <button class="verse-action" type="button" data-action="highlight" data-active="${isHighlighted}">
          <span aria-hidden="true">✨</span>
          Highlight
        </button>
      </div>
    </header>
    <p class="verse-sanskrit">${verse.sanskrit}</p>
    <p class="verse-transliteration">${verse.transliteration}</p>
    <p class="verse-translation">${verse.translation}</p>
    <section class="verse-notes">
      <span class="note-label">Notes</span>
      <textarea
        class="note-textarea"
        placeholder="Capture your reflections or cross-references"
        data-action="note"
        data-chapter-number="${chapterNumber}"
        data-verse-number="${verse.number}"
      >${note ?? ""}</textarea>
    </section>
  `;

  return container;
}

function renderTableOfContents(chapter) {
  elements.tocList.innerHTML = "";
  if (state.filteredVerses.length === 0) {
    const emptyState = document.createElement("p");
    emptyState.className = "no-results";
    emptyState.textContent = "No verses to display.";
    elements.tocList.appendChild(emptyState);
    return;
  }

  state.filteredVerses.forEach((verseNumber) => {
    const item = document.createElement("div");
    item.className = "toc-item";
    const button = document.createElement("button");
    button.type = "button";
    button.className = "toc-link";
    button.dataset.target = `chapter-${chapter.number}-verse-${verseNumber}`;
    button.dataset.verseNumber = String(verseNumber);
    button.innerHTML = `<span>Verse ${chapter.number}:${verseNumber}</span><span aria-hidden="true">↧</span>`;
    item.appendChild(button);
    elements.tocList.appendChild(item);
  });

  updateTOCHighlight(state.currentActiveVerse);
}

function setupScrollSpy() {
  if (state.verseObserver) {
    state.verseObserver.disconnect();
  }

  const verses = Array.from(elements.versesContainer.querySelectorAll(".verse"));
  if (verses.length === 0) {
    state.currentActiveVerse = null;
    updateTOCHighlight(null);
    return;
  }

  state.verseObserver = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .map((entry) => Number(entry.target.dataset.verseNumber))
        .sort((a, b) => a - b);

      if (visible.length === 0) {
        return;
      }

      const nextActive = visible[0];
      if (state.currentActiveVerse === nextActive) {
        return;
      }

      state.currentActiveVerse = nextActive;
      updateTOCHighlight(nextActive);
      updateProgress(nextActive);
      updateLastRead(nextActive);
    },
    {
      root: null,
      threshold: 0.55,
    },
  );

  verses.forEach((verse) => state.verseObserver.observe(verse));
}

function updateTOCHighlight(verseNumber) {
  const links = elements.tocList.querySelectorAll(".toc-link");
  links.forEach((link) => {
    link.classList.toggle("active", Number(link.dataset.verseNumber) === verseNumber);
  });
}

function updateProgress(activeVerseNumber) {
  const total = state.filteredVerses.length;
  if (!total || !activeVerseNumber) {
    elements.progressBar.style.width = "0%";
    elements.progressText.textContent = "0% read";
    return;
  }

  const currentIndex = state.filteredVerses.indexOf(activeVerseNumber);
  const progress = currentIndex >= 0 ? ((currentIndex + 1) / total) * 100 : 0;
  elements.progressBar.style.width = `${progress}%`;
  const percent = Math.round(progress);
  elements.progressText.textContent = `Verse ${currentIndex + 1} of ${total} • ${percent}% read`;
}

function updateLastRead(verseNumber) {
  const chapter = state.chapters[state.currentChapterIndex];
  if (!chapter) return;
  state.lastRead = { chapter: chapter.number, verse: verseNumber };
  saveState();
}

function attachEventListeners() {
  elements.chapterSelect.addEventListener("change", (event) => {
    const index = Number(event.target.value);
    setCurrentChapter(index, { shouldAnnounce: true });
  });

  elements.prevChapter.addEventListener("click", () => {
    setCurrentChapter(state.currentChapterIndex - 1, {
      shouldAnnounce: true,
      scrollToVerse: 1,
    });
  });

  elements.nextChapter.addEventListener("click", () => {
    setCurrentChapter(state.currentChapterIndex + 1, {
      shouldAnnounce: true,
      scrollToVerse: 1,
    });
  });

  elements.transliterationToggle.addEventListener("change", (event) => {
    state.showTransliteration = Boolean(event.target.checked);
    applyPreferences();
    saveState();
  });

  elements.notesToggle.addEventListener("change", (event) => {
    state.showNotes = Boolean(event.target.checked);
    applyPreferences();
    saveState();
  });

  elements.searchInput.addEventListener("input", (event) => {
    state.searchTerm = event.target.value;
    saveState();
    const chapter = state.chapters[state.currentChapterIndex];
    if (chapter) {
      renderVerses(chapter);
      renderTableOfContents(chapter);
      setupScrollSpy();
    }
  });

  elements.versesContainer.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-action]");
    if (!button) return;
    const verseElement = button.closest(".verse");
    if (!verseElement) return;

    const chapterNumber = Number(verseElement.dataset.chapterNumber);
    const verseNumber = Number(verseElement.dataset.verseNumber);
    const key = makeVerseKey(chapterNumber, verseNumber);
    const action = button.dataset.action;

    if (action === "bookmark") {
      const isActive = toggleBookmark(key);
      button.dataset.active = String(isActive);
      verseElement.classList.toggle("is-bookmarked", isActive);
      announce(
        `${isActive ? "Bookmarked" : "Removed bookmark for"} verse ${chapterNumber}:${verseNumber}`,
      );
    }

    if (action === "highlight") {
      const isActive = toggleHighlight(key);
      button.dataset.active = String(isActive);
      verseElement.classList.toggle("is-highlighted", isActive);
      announce(`${isActive ? "Highlighted" : "Removed highlight for"} verse ${chapterNumber}:${verseNumber}`);
    }
  });

  elements.versesContainer.addEventListener("input", (event) => {
    const textarea = event.target.closest("textarea[data-action='note']");
    if (!textarea) return;
    const chapterNumber = Number(textarea.dataset.chapterNumber);
    const verseNumber = Number(textarea.dataset.verseNumber);
    setNote(chapterNumber, verseNumber, textarea.value);
  });

  elements.tocList.addEventListener("click", (event) => {
    const button = event.target.closest(".toc-link");
    if (!button) return;
    const targetId = button.dataset.target;
    if (targetId) {
      document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });

  elements.resetState.addEventListener("click", () => {
    localStorage.removeItem(STORAGE_KEY);
    announce("Reader state cleared. Reverting to defaults.");
    window.location.reload();
  });
}

function toggleBookmark(key) {
  if (state.bookmarks.has(key)) {
    state.bookmarks.delete(key);
    saveState();
    return false;
  }
  state.bookmarks.add(key);
  saveState();
  return true;
}

function toggleHighlight(key) {
  if (state.highlights.has(key)) {
    state.highlights.delete(key);
    saveState();
    return false;
  }
  state.highlights.add(key);
  saveState();
  return true;
}

function makeVerseKey(chapterNumber, verseNumber) {
  return `${chapterNumber}:${verseNumber}`;
}

function getNote(chapterNumber, verseNumber) {
  return state.notes?.[chapterNumber]?.[verseNumber] ?? "";
}

function setNote(chapterNumber, verseNumber, value) {
  if (!state.notes[chapterNumber]) {
    state.notes[chapterNumber] = {};
  }
  state.notes[chapterNumber][verseNumber] = value;
  saveState();
}

function scrollToVerseElement(chapterNumber, verseNumber) {
  const el = document.getElementById(`chapter-${chapterNumber}-verse-${verseNumber}`);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    el.classList.add("is-scroll-target");
    window.setTimeout(() => {
      el.classList.remove("is-scroll-target");
    }, 1800);
  }
}

function updateNavigationButtons() {
  elements.prevChapter.disabled = state.currentChapterIndex === 0;
  elements.nextChapter.disabled = state.currentChapterIndex === state.chapters.length - 1;
}

function announce(message) {
  if (!elements.srAnnouncer) return;
  elements.srAnnouncer.textContent = "";
  window.setTimeout(() => {
    elements.srAnnouncer.textContent = message;
  }, 60);
}

init();
