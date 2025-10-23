export type Chapter = {
  number: number;
  title: string;
  theme: string;
  summary: string;
};

export const chapters: Chapter[] = [
  {
    number: 1,
    title: "Arjuna's Despair",
    theme: "Confronting inner conflict",
    summary:
      "Arjuna is overcome by doubt and sorrow on the battlefield of Kurukshetra, setting the stage for the teachings to come.",
  },
  {
    number: 2,
    title: "The Yoga of Knowledge",
    theme: "Awakening to dharma",
    summary:
      "Krishna introduces the eternal nature of the soul and the balanced path of selfless action rooted in wisdom.",
  },
  {
    number: 3,
    title: "The Yoga of Action",
    theme: "Selfless service",
    summary:
      "True action is performed without attachment to results, aligning personal duty with the greater good.",
  },
  {
    number: 4,
    title: "The Yoga of Wisdom",
    theme: "Divine insight",
    summary:
      "Krishna reveals the sacred lineage of knowledge and the transformative power of disciplined practice.",
  },
];
