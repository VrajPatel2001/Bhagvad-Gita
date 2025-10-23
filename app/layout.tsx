import type { Metadata } from "next";
import { Manrope, Playfair_Display } from "next/font/google";

import { AppShell } from "@/components/app-shell";
import { LanguageProvider } from "@/components/language-provider";

import "./globals.css";

const manrope = Manrope({
  variable: "--font-sans",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Bhagavad Gita Learning Platform",
    template: "%s · Bhagavad Gita Learning Platform",
  },
  description:
    "Explore the Bhagavad Gita through guided study, reflective practice, and curated learning journeys.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${manrope.variable} ${playfair.variable} bg-sand-25 text-ink-700 antialiased`}
      >
        <LanguageProvider>
          <AppShell>{children}</AppShell>
        </LanguageProvider>
      </body>
    </html>
  );
}
