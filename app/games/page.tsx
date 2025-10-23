import { Metadata } from "next";

import { GamesExperience } from "@/components/games/games-experience";

export const metadata: Metadata = {
  title: "Educational Games Catalog · Bhagavad Gita Learning Platform",
  description:
    "Explore interactive learning games grounded in the Bhagavad Gita—quiz wisdom, match verses, align translations, complete phrases, and pair memories.",
};

export default function GamesPage() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 py-12 sm:px-5 lg:px-6">
      <GamesExperience />
    </div>
  );
}
