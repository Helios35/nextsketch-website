import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { QualificationModalProvider } from "@/components/qualification-modal-provider";
import { SITE } from "@/content/copy";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
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
 * Root layout. The site is now a single dark landing hero, so the
 * shell is just the ink page surface and the qualification-modal
 * provider (every CTA opens the modal); the multi-section SiteNav and
 * SiteFooter are no longer mounted.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-ink font-sans text-white">
        <QualificationModalProvider>{children}</QualificationModalProvider>
        <Analytics />
      </body>
    </html>
  );
}
