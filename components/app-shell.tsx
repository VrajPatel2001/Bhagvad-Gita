"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { ChapterNavigation } from "@/components/chapter-navigation";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { cn } from "@/lib/utils";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [isNavigationOpen, setIsNavigationOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedElement = useRef<HTMLElement | null>(null);
  const navigationId = "chapter-navigation-drawer";

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = isNavigationOpen ? "hidden" : previousOverflow;

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isNavigationOpen]);

  useEffect(() => {
    if (!isNavigationOpen) {
      if (previouslyFocusedElement.current) {
        previouslyFocusedElement.current.focus();
        previouslyFocusedElement.current = null;
      }
      return;
    }

    if (typeof document === "undefined") {
      return;
    }

    const drawerElement = drawerRef.current;

    if (!drawerElement) {
      return;
    }

    const focusableElements = getFocusableElements(drawerElement);
    const firstFocusable = focusableElements[0] ?? drawerElement;
    firstFocusable.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeNavigation();
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      if (!focusableElements.length) {
        event.preventDefault();
        return;
      }

      const first = focusableElements[0];
      const last = focusableElements[focusableElements.length - 1];

      if (event.shiftKey) {
        if (document.activeElement === first) {
          event.preventDefault();
          last.focus();
        }
      } else if (document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeNavigation, isNavigationOpen]);

  const openNavigation = useCallback(() => {
    if (typeof document !== "undefined") {
      const activeElement = document.activeElement;
      if (activeElement instanceof HTMLElement) {
        previouslyFocusedElement.current = activeElement;
      }
    }

    setIsNavigationOpen(true);
  }, []);
  const closeNavigation = useCallback(() => setIsNavigationOpen(false), []);

  return (
    <div className="flex min-h-screen flex-col bg-[radial-gradient(circle_at_top,_rgba(255,239,214,0.7)_0%,_rgba(254,249,240,0.95)_45%,_#fbf8f3_100%)] pb-safe">
      <SiteHeader
        onOpenChapterNav={openNavigation}
        onCloseChapterNav={closeNavigation}
        isChapterNavOpen={isNavigationOpen}
        navigationId={navigationId}
      />
      <div className="flex flex-1">
        <aside className="hidden lg:flex lg:w-80 lg:flex-shrink-0 lg:border-r lg:border-pearl-200/70">
          <ChapterNavigation />
        </aside>
        <main className="flex-1">
          <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 lg:px-10 lg:py-14">{children}</div>
        </main>
      </div>
      <SiteFooter />

      <div className="lg:hidden">
        <div
          className={cn(
            "fixed inset-0 z-40 bg-ink-800/40 backdrop-blur-sm transition-opacity duration-300",
            isNavigationOpen ? "opacity-100 pointer-events-auto" : "pointer-events-none opacity-0",
          )}
          onClick={closeNavigation}
        />
        <div
          ref={drawerRef}
          id={navigationId}
          className={cn(
            "fixed inset-y-0 left-0 z-50 w-[85vw] max-w-sm transform transition-transform duration-300 ease-in-out",
            isNavigationOpen ? "translate-x-0" : "-translate-x-full",
          )}
          role="dialog"
          aria-modal="true"
          aria-label="Chapter navigation"
          aria-hidden={!isNavigationOpen}
          tabIndex={-1}
        >
          <ChapterNavigation variant="mobile" onNavigate={closeNavigation} onDismiss={closeNavigation} />
        </div>
      </div>
    </div>
  );
}

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const focusableSelectors =
    'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';
  return Array.from(container.querySelectorAll<HTMLElement>(focusableSelectors)).filter(
    (element) => !element.hasAttribute("disabled") && element.getAttribute("aria-hidden") !== "true",
  );
}
