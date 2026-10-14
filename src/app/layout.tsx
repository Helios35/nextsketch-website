import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Playfair_Display } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { ApolloTracker } from "@/components/apollo-tracker";
import { QualificationModalProvider } from "@/components/qualification-modal-provider";
import { SITE } from "@/content/copy";
import "./globals.css";

/*
 * fin's three families (docs/04-ux-spec.md §Typography, decision-log
 * #47): Inter for the interface and every figure, Playfair Display for
 * display headings and the brand voice (its italic carries the hero's
 * supporting line), JetBrains Mono for labels. All variable fonts,
 * self-hosted at build by next/font: zero runtime requests to a font
 * CDN and no layout shift.
 */
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair-display",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: SITE.title,
  description: SITE.description,
};

/**
 * Root layout: the page surface (fin's dark `background`, the site's
 * only theme since decision-log #47), the fonts, and the
 * qualification-modal provider (every CTA opens the modal). Nav and
 * footer are mounted per page, not here.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfairDisplay.variable} ${jetbrainsMono.variable} h-full bg-background antialiased`}
    >
      {/* The page surface lives on <html> (the canvas) so a fixed
          -z-10 page backdrop (the coral glow on /pricing and the service
          routes, page-glow.tsx) paints above it while staying below
          all in-flow content. */}
      <body className="flex min-h-full flex-col font-sans text-foreground">
        <QualificationModalProvider>{children}</QualificationModalProvider>
        {/* Both trackers sit together for readability, but they mount
            differently: <Analytics /> is the first-party cookieless
            pageview tracker and renders here, while <ApolloTracker />
            self-hoists into <head> (beforeInteractive) regardless of
            where it sits in this tree. */}
        <Analytics />
        <ApolloTracker />
      </body>
    </html>
  );
}
