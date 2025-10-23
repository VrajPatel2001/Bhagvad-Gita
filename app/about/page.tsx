import type { Metadata } from "next";

import Link from "next/link";

import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about the intention behind the Bhagavad Gita Learning Platform and the guiding principles that support your study.",
};

const guidingPrinciples = [
  {
    title: "Rooted in tradition",
    description:
      "Teachings are distilled from trusted commentaries while honoring the devotional lineages that have preserved the Gita for millennia.",
  },
  {
    title: "Designed for integration",
    description:
      "Reflection prompts, journaling cues, and suggested practices invite you to embody each teaching in daily life.",
  },
  {
    title: "Inclusive for seekers",
    description:
      "Guidance is presented with clarity and compassion for readers exploring the Gita from diverse backgrounds and experiences.",
  },
];

export default function AboutPage() {
  return (
    <div className="space-y-16">
      <section className="space-y-6">
        <h1 className="font-serif text-fluid-display text-peacock-900">Our intention</h1>
        <p className="max-w-3xl text-lg leading-relaxed text-ink-600">
          The Bhagavad Gita Learning Platform is a sanctuary for contemplative study. We combine
          timeless wisdom with thoughtful design to help you establish a rhythm of learning that
          nourishes intellect, heart, and action.
        </p>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        {guidingPrinciples.map((principle) => (
          <div
            key={principle.title}
            className="flex flex-col gap-3 rounded-3xl border border-pearl-200 bg-white/80 p-6 shadow-soft"
          >
            <h2 className="font-serif text-fluid-heading text-peacock-900">{principle.title}</h2>
            <p className="text-ink-600">{principle.description}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-8 rounded-3xl border border-pearl-200 bg-gradient-to-br from-lotus-50 to-sand-50 p-8 shadow-soft md:grid-cols-2">
        <div className="space-y-4">
          <h2 className="font-serif text-fluid-display text-peacock-900">How we support your practice</h2>
          <p className="text-ink-600">
            We are crafting a library of resources that uplift your study sessions—from chantable
            verses and pronunciation guides to reflective questions you can share with your
            community circles.
          </p>
          <p className="text-ink-600">
            Expect gentle reminders, seasonal study journeys, and opportunities to connect with
            fellow seekers walking a similar path.
          </p>
        </div>
        <div className="flex flex-col gap-4 rounded-2xl border border-pearl-300 bg-white/80 p-6 shadow-soft">
          <h3 className="font-serif text-fluid-heading text-peacock-900">Stay connected</h3>
          <p className="text-ink-600">
            We are preparing guiding materials, printable study companions, and facilitated group
            explorations. Be the first to know when they arrive.
          </p>
          <Link
            href="/resources"
            className="inline-flex items-center justify-center rounded-full bg-peacock-600 px-5 py-3 text-sm font-semibold text-sand-25 transition hover:bg-peacock-500"
          >
            Explore upcoming resources
          </Link>
        </div>
      </section>

      <section className="rounded-3xl border border-pearl-200 bg-white/75 p-8 shadow-soft">
        <h2 className="font-serif text-fluid-heading text-peacock-900">Values we hold close</h2>
        <ul className="mt-4 grid gap-3 text-ink-600 sm:grid-cols-2">
          <li className="rounded-2xl bg-sand-50/80 p-4">Study as sacred service</li>
          <li className="rounded-2xl bg-sand-50/80 p-4">Compassionate inquiry over debate</li>
          <li className="rounded-2xl bg-sand-50/80 p-4">Consistency over intensity</li>
          <li className="rounded-2xl bg-sand-50/80 p-4">Living the teachings with grace</li>
        </ul>
      </section>
    </div>
  );
}
