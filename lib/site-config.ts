export const siteConfig = {
  name: "Bhagavad Gita Learning Platform",
  description:
    "A serene digital companion for seekers exploring the timeless wisdom of the Bhagavad Gita through guided study, reflection, and practice.",
  cta: {
    label: "Begin your study",
    href: "/chapters",
  },
  navigation: [
    {
      title: "Home",
      href: "/",
    },
    {
      title: "About",
      href: "/about",
    },
    {
      title: "Chapters",
      href: "/chapters",
    },
    {
      title: "Games",
      href: "/games",
    },
    {
      title: "Resources",
      href: "/resources",
    },
  ],
  footer: {
    tagline: "Illuminating the Gita for modern seekers.",
    links: [
      {
        title: "Practices",
        href: "/resources",
      },
      {
        title: "Interactive Games",
        href: "/games",
      },
      {
        title: "Community Guidance",
        href: "/about",
      },
      {
        title: "Study Path",
        href: "/chapters",
      },
    ],
  },
};

export type SiteConfig = typeof siteConfig;
