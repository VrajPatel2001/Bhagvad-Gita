import Link from "next/link";

import { siteConfig } from "@/lib/site-config";

export function SiteFooter() {
  return (
    <footer className="border-t border-pearl-200 bg-sand-25/90">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 text-sm text-ink-600 md:flex-row md:items-center md:justify-between lg:px-6">
        <div>
          <p className="font-serif text-lg text-peacock-900">{siteConfig.footer.tagline}</p>
          <p className="mt-2 max-w-xl text-ink-500">
            {siteConfig.description}
          </p>
        </div>
        <nav className="flex flex-wrap items-center gap-4" aria-label="Footer navigation">
          {siteConfig.footer.links.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="inline-flex items-center gap-1 text-ink-500 transition hover:text-peacock-700 focus:outline-none focus-visible:rounded-full focus-visible:ring-2 focus-visible:ring-peacock-200"
            >
              <span aria-hidden className="text-sm">✦</span>
              {item.title}
            </Link>
          ))}
        </nav>
        <p className="text-xs text-ink-400">
          © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
