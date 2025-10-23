"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-pearl-200/70 bg-sand-25/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 transition-colors sm:flex-row sm:items-center sm:justify-between sm:gap-6 lg:px-6">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold text-peacock-900">
          <span className="font-serif text-2xl font-semibold text-saffron-600">
            ॐ
          </span>
          <span className="font-serif text-lg sm:text-xl">{siteConfig.name}</span>
        </Link>
        <nav className="flex flex-wrap items-center gap-2 text-sm font-medium text-ink-600 sm:flex-1 sm:justify-center sm:gap-4 md:gap-5">
          {siteConfig.navigation.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "rounded-full px-4 py-2 transition-colors",
                  isActive
                    ? "bg-lotus-100 text-peacock-900 shadow-soft"
                    : "hover:bg-sand-100 hover:text-peacock-900"
                )}
              >
                {item.title}
              </Link>
            );
          })}
        </nav>
        <div className="flex justify-end">
          <Link
            href={siteConfig.cta.href}
            className="inline-flex items-center justify-center rounded-full bg-peacock-600 px-5 py-2 text-sm font-semibold text-sand-25 shadow-soft transition hover:bg-peacock-500"
          >
            {siteConfig.cta.label}
          </Link>
        </div>
      </div>
    </header>
  );
}
