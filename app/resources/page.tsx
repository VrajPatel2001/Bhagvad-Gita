import type { Metadata } from "next";

import Link from "next/link";

export const metadata: Metadata = {
  title: "Resources",
  description:
    "Find curated study materials, practice templates, and supportive tools for your Bhagavad Gita exploration.",
};

const resourceCollections = [
  {
    title: "Meditation & chanting",
    description:
      "Audio guidance and chantable verses designed to help you attune to the devotional mood of each chapter.",
    status: "Arriving soon",
  },
  {
    title: "Reflection journals",
    description:
      "Printable and digital journaling companions with prompts for svadhyaya (self-study).",
    status: "In preparation",
  },
  {
    title: "Facilitator guides",
    description:
      "Structured outlines for leading small group discussions rooted in compassion and shared inquiry.",
    status: "In design",
  },
];

export default function ResourcesPage() {
  return (
    <div className="space-y-12">
      <section className="space-y-4">
        <h1 className="font-serif text-fluid-display text-peacock-900">Study resources</h1>
        <p className="max-w-2xl text-lg text-ink-600">
          This evolving library gathers tools that make it easier to engage deeply with the Gita.
          Everything is created with a focus on accessibility, contemplative tone, and beautiful
          craftsmanship.
        </p>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        {resourceCollections.map((collection) => (
          <div
            key={collection.title}
            className="flex flex-col gap-4 rounded-3xl border border-pearl-200 bg-white/85 p-6 shadow-soft"
          >
            <div>
              <h2 className="font-serif text-fluid-heading text-peacock-900">{collection.title}</h2>
              <p className="mt-2 text-sm font-semibold uppercase tracking-[0.25em] text-saffron-600">
                {collection.status}
              </p>
            </div>
            <p className="text-ink-600">{collection.description}</p>
          </div>
        ))}
      </section>

      <section className="rounded-3xl border border-pearl-200 bg-gradient-to-br from-peacock-900 via-peacock-700 to-peacock-600 p-8 text-sand-25 shadow-soft">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-serif text-fluid-display">Share your intentions</h2>
            <p className="mt-2 max-w-2xl text-sand-100/80">
              Tell us what would support your practice—audio recitations, study circles, or guided
              meditations. Your input shapes the roadmap.
            </p>
          </div>
          <Link
            href="/about"
            className="inline-flex items-center justify-center rounded-full bg-sand-25 px-6 py-3 text-sm font-semibold text-peacock-800 shadow-soft transition hover:bg-lotus-100"
          >
            Connect with the team
          </Link>
        </div>
      </section>
    </div>
  );
}
