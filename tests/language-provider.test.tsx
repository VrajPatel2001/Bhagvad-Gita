import { beforeEach, describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { LanguageProvider, useLanguage } from "@/components/language-provider";
import { LANGUAGE_STORAGE_KEY } from "@/lib/language";
import type { GitaLanguage } from "@/data/gita/types";

function LanguageConsumer() {
  const { language, supportedLanguages, setLanguage } = useLanguage();

  return (
    <div>
      <p data-testid="active-language">{language}</p>
      <p data-testid="supported-count">{supportedLanguages.length}</p>
      <button type="button" onClick={() => setLanguage("hindi")}>Switch to Hindi</button>
      <button type="button" onClick={() => setLanguage("sanskrit")}>Switch to Sanskrit</button>
      <button type="button" onClick={() => setLanguage("french" as unknown as GitaLanguage)}>Switch to French</button>
    </div>
  );
}

describe("LanguageProvider", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("initializes with stored language preference when available", () => {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, "hindi");

    render(
      <LanguageProvider>
        <LanguageConsumer />
      </LanguageProvider>,
    );

    expect(screen.getByTestId("active-language")).toHaveTextContent("hindi");
    expect(Number(screen.getByTestId("supported-count").textContent)).toBeGreaterThanOrEqual(3);
  });

  it("updates the active language and persists the preference", async () => {
    const user = userEvent.setup();

    render(
      <LanguageProvider>
        <LanguageConsumer />
      </LanguageProvider>,
    );

    expect(screen.getByTestId("active-language")).toHaveTextContent("english");

    await user.click(screen.getByRole("button", { name: /switch to hindi/i }));
    expect(screen.getByTestId("active-language")).toHaveTextContent("hindi");
    expect(window.localStorage.getItem(LANGUAGE_STORAGE_KEY)).toBe("hindi");

    await user.click(screen.getByRole("button", { name: /switch to sanskrit/i }));
    expect(screen.getByTestId("active-language")).toHaveTextContent("sanskrit");
    expect(window.localStorage.getItem(LANGUAGE_STORAGE_KEY)).toBe("sanskrit");

    await user.click(screen.getByRole("button", { name: /switch to french/i }));
    expect(screen.getByTestId("active-language")).toHaveTextContent("sanskrit");
  });
});
