"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";

import { LanguageSwitcher } from "./language-switcher";

type SiteHeaderProps = {
  onOpenChapterNav?: () => void;
};

function isNavItemActive(pathname: string, href: string): boolean {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader({ onOpenChapterNav }: SiteHeaderProps) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-pearl-200/70 bg-sand-25/85 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-4 sm:px-5 lg:px-6">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onOpenChapterNav?.()}
              className="inline-flex items-center gap-2 rounded-full border border-pearl-300 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-peacock-800 shadow-soft transition hover:border-peacock-300 hover:text-peacock-600 focus:outline-none focus:ring-2 focus:ring-peacock-200 lg:hidden"
            >
              <span aria-hidden className="text-lg leading-none text-peacock-700">
                ☰
              </span>
              Chapters
            </button>
            <Link href="/" className="flex items-center gap-2 text-lg font-semibold text-peacock-900">
              <span className="font-serif text-2xl font-semibold text-saffron-600">ॐ</span>
              <span className="font-serif text-lg sm:text-xl">{siteConfig.name}</span>
            </Link>
          </div>

          <nav className="hidden items-center gap-2 text-sm font-medium text-ink-600 md:flex md:gap-4">
            {siteConfig.navigation.map((item) => {
              const isActive = isNavItemActive(pathname, item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "rounded-full px-4 py-2 transition-colors",
                    isActive
                      ? "bg-lotus-100 text-peacock-900 shadow-soft"
                      : "hover:bg-sand-100 hover:text-peacock-900",
                  )}
                >
                  {item.title}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <Link
              href={siteConfig.cta.href}
              className="hidden shrink-0 items-center justify-center rounded-full bg-peacock-600 px-5 py-2 text-sm font-semibold text-sand-25 shadow-soft transition hover:bg-peacock-500 sm:inline-flex"
            >
              {siteConfig.cta.label}
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-sm text-ink-600 md:hidden">
          {siteConfig.navigation.map((item) => {
            const isActive = isNavItemActive(pathname, item.href);

            return (
              <Link
                key={`mobile-${item.href}`}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "whitespace-nowrap rounded-full px-3 py-1.5",
                  isActive
                    ? "bg-lotus-100 text-peacock-900 shadow-soft"
                    : "border border-transparent bg-white/60 text-ink-600 transition hover:border-pearl-300 hover:text-peacock-900",
                )}
              >
                {item.title}
              </Link>
            );
          })}
          <Link
            href={siteConfig.cta.href}
            className="ml-auto inline-flex flex-shrink-0 items-center justify-center rounded-full border border-peacock-200 bg-peacock-600 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.3em] text-sand-25 shadow-soft transition hover:bg-peacock-500"
          >
            {siteConfig.cta.label}
          </Link>
        </div>
      </div>
    </header>
  );
}
