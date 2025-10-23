import { describe, expect, it, vi } from "vitest";

const createMockMode = (label: string) =>
  ({ mode, level, onExit }: { mode: { name: string }; level: { label: string }; onExit: () => void }) => (
    <div data-testid={`mock-mode-${label}`}>
      <p>{mode.name}</p>
      <p>{level.label}</p>
      <button type="button" onClick={onExit}>
        Leave mode
      </button>
    </div>
  );

vi.mock("@/components/games/modes/quiz-mode", () => ({
  QuizMode: createMockMode("quiz"),
}));

vi.mock("@/components/games/modes/chapter-match-mode", () => ({
  ChapterMatchMode: createMockMode("chapter-match"),
}));

vi.mock("@/components/games/modes/translation-match-mode", () => ({
  TranslationMatchMode: createMockMode("translation-match"),
}));

vi.mock("@/components/games/modes/fill-blank-mode", () => ({
  FillBlankMode: createMockMode("fill-blank"),
}));

vi.mock("@/components/games/modes/memory-mode", () => ({
  MemoryMode: createMockMode("memory"),
}));

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { GamesExperience } from "@/components/games/games-experience";

describe("GamesExperience", () => {
  it("allows selecting and exiting a game mode", async () => {
    const user = userEvent.setup();

    render(<GamesExperience />);

    expect(screen.getByRole("heading", { name: /core educational games catalog/i })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /gentle start/i }));

    const activeMode = await screen.findByTestId("mock-mode-quiz");
    expect(activeMode).toHaveTextContent("Wisdom Quiz");
    expect(activeMode).toHaveTextContent("Gentle Start");
    expect(screen.queryByRole("heading", { name: /core educational games catalog/i })).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /leave mode/i }));

    expect(screen.getByRole("heading", { name: /core educational games catalog/i })).toBeInTheDocument();
  });
});
