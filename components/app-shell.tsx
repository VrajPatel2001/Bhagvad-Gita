"use client";

import { useCallback, useEffect, useState } from "react";

import { ChapterNavigation } from "@/components/chapter-navigation";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { cn } from "@/lib/utils";

const MOBILE_NAV_ID = "chapter-navigation-panel";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [isNavigationOpen, setIsNavigationOpen] = useState(false);

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
    if (!isNavigationOpen || typeof window === "undefined") {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setIsNavigationOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isNavigationOpen]);

  const openNavigation = useCallback(() => setIsNavigationOpen(true), []);
  const closeNavigation = useCallback(() => setIsNavigationOpen(false), []);

  return (
    <div className="flex min-h-screen flex-col bg-[radial-gradient(circle_at_top,_rgba(255,239,214,0.7)_0%,_rgba(254,249,240,0.95)_45%,_#fbf8f3_100%)]">
      <a
        href="#main-content"
        className="fixed left-4 top-4 z-[70] inline-flex -translate-y-32 items-center rounded-full bg-peacock-700 px-4 py-2 text-sm font-semibold text-sand-25 shadow-soft transition focus:translate-y-0 focus:outline-none focus:ring-2 focus:ring-saffron-400"
      >
        Skip to main content
      </a>
      <SiteHeader
        onOpenChapterNav={openNavigation}
        isChapterNavOpen={isNavigationOpen}
        mobileNavigationId={MOBILE_NAV_ID}
      />
      <div className="flex flex-1">
        <aside className="hidden lg:flex lg:w-80 lg:flex-shrink-0 lg:border-r lg:border-pearl-200/70">
          <ChapterNavigation />
        </aside>
        <main id="main-content" className="flex-1" tabIndex={-1}>
          <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 lg:px-10 lg:py-14">{children}</div>
        </main>
      </div>
      <SiteFooter />

      <div className="lg:hidden">
        <div
          className={cn(
            "fixed inset-0 z-40 bg-ink-800/40 backdrop-blur-sm transition-opacity duration-300",
            isNavigationOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
          )}
          role="presentation"
          aria-hidden={!isNavigationOpen}
          onClick={closeNavigation}
        />
        <div
          id={MOBILE_NAV_ID}
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
