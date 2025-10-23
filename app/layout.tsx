import type { Metadata } from "next";
import { Manrope, Playfair_Display } from "next/font/google";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

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
        <div className="flex min-h-screen flex-col bg-[radial-gradient(circle_at_top,_rgba(255,239,214,0.7)_0%,_rgba(254,249,240,0.95)_45%,_#fbf8f3_100%)]">
          <SiteHeader />
          <main className="flex-1">
            <div className="mx-auto w-full max-w-6xl px-4 py-12 lg:px-6 lg:py-16">
              {children}
            </div>
          </main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
