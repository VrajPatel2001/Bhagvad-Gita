import Link from "next/link";

import { chapters } from "@/data/chapters";
import { siteConfig } from "@/lib/site-config";

const highlights = [
  {
    title: "Verse-by-verse guidance",
    description:
      "Absorb the essence of each teaching with commentary grounded in classical wisdom and modern reflection prompts.",
  },
  {
    title: "Meditation & practice cues",
    description:
      "Integrate insights into daily life through gentle practices that cultivate clarity, devotion, and courageous action.",
  },
  {
    title: "Curated study journeys",
    description:
      "Follow themed learning paths curated for seekers at every stage, from first-time readers to seasoned practitioners.",
  },
];

export default function Home() {
  return (
    <div className="space-y-16 lg:space-y-24">
      <section className="grid gap-12 lg:grid-cols-[1.25fr_1fr] lg:items-center">
        <div className="space-y-6">
          <span className="inline-flex items-center justify-center rounded-full bg-lotus-100 px-4 py-1 text-sm font-semibold text-saffron-700 shadow-soft">
            Discover the song of the divine
          </span>
          <h1 className="font-serif text-4xl leading-tight text-peacock-900 sm:text-5xl lg:text-6xl">
            Cultivate wisdom with the Bhagavad Gita
          </h1>
          <p className="max-w-xl text-lg leading-relaxed text-ink-600">
            {siteConfig.description}
          </p>
          <div className="flex flex-col gap-3 text-sm text-ink-600 sm:text-base">
            {highlights.map((item) => (
              <div key={item.title} className="flex gap-3 rounded-2xl border border-pearl-200/80 bg-white/80 p-4 shadow-soft">
                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-saffron-500" aria-hidden />
                <div>
                  <p className="font-semibold text-peacock-900">{item.title}</p>
                  <p className="text-ink-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-4 pt-3">
            <Link
              href={siteConfig.cta.href}
              className="inline-flex items-center justify-center rounded-full bg-peacock-600 px-6 py-3 text-sm font-semibold text-sand-25 shadow-soft transition hover:bg-peacock-500"
            >
              {siteConfig.cta.label}
            </Link>
            <Link
              href="/about"
              className="text-sm font-semibold text-peacock-900 underline-offset-8 hover:underline"
            >
              Learn more about our approach
            </Link>
          </div>
        </div>
        <div className="relative overflow-hidden rounded-3xl border border-pearl-200 bg-gradient-to-br from-lotus-50 via-sand-25 to-peacock-50 p-8 shadow-soft">
          <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-saffron-200/40 blur-3xl" aria-hidden />
          <div className="absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-peacock-200/40 blur-3xl" aria-hidden />
          <div className="relative space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-peacock-700">
              "Yoga of insight"
            </p>
            <p className="font-serif text-3xl leading-snug text-peacock-900">
              "The mind that is not shaken by adversity, nor elated by happiness, lives in perfect peace."
            </p>
            <p className="text-sm text-ink-500">— Bhagavad Gita, Chapter 2</p>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-serif text-3xl text-peacock-900 sm:text-4xl">A glimpse of the journey</h2>
            <p className="text-ink-600">
              Explore curated chapter highlights to anchor your study sessions.
            </p>
          </div>
          <Link
            href="/chapters"
            className="inline-flex items-center justify-center rounded-full border border-pearl-300 bg-white/70 px-4 py-2 text-sm font-semibold text-peacock-800 shadow-soft transition hover:bg-peacock-50"
          >
            View all chapters
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {chapters.map((chapter) => (
            <div
              key={chapter.number}
              className="group relative flex h-full flex-col gap-3 overflow-hidden rounded-3xl border border-pearl-200 bg-white/85 p-6 shadow-soft transition hover:border-peacock-200 hover:shadow-lg"
            >
              <span className="inline-flex w-fit rounded-full bg-sand-100 px-3 py-1 text-xs font-semibold tracking-wide text-peacock-800">
                Chapter {chapter.number}
              </span>
              <h3 className="font-serif text-2xl text-peacock-900">{chapter.title}</h3>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-saffron-600">
                {chapter.theme}
              </p>
              <p className="text-ink-600">{chapter.summary}</p>
              <Link
                href="/chapters"
                className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-peacock-800 transition group-hover:text-peacock-600"
              >
                Read chapter overview
                <span aria-hidden className="translate-y-[1px] transition group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="overflow-hidden rounded-3xl border border-pearl-200 bg-gradient-to-br from-peacock-900 via-peacock-700 to-peacock-600 p-10 text-sand-25 shadow-soft">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-3">
            <h2 className="font-serif text-3xl leading-tight sm:text-4xl">
              Align study, contemplation, and service.
            </h2>
            <p className="max-w-2xl text-sand-100/80">
              Join upcoming releases featuring guided meditations, journaling companions, and community circles held in the spirit of seva.
            </p>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link
              href="/resources"
              className="inline-flex items-center justify-center rounded-full bg-sand-25 px-6 py-3 text-sm font-semibold text-peacock-800 shadow-soft transition hover:bg-lotus-100"
            >
              Explore resources
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center justify-center rounded-full border border-sand-25/40 px-6 py-3 text-sm font-semibold text-sand-25 transition hover:border-sand-25"
            >
              Meet the guides
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
