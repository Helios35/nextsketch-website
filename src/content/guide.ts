/**
 * The free guide card (decision-log #76): a toast that offers "The
 * Small Business Guide to AI" for a name and an email, after a scroll,
 * on every page but `/pricing`, once per visitor.
 *
 * Owner copy (the free guide brief, Part B, Nate 2026-11-12), word for
 * word. The failure line is split around the address only so the
 * address can be the escape-hatch link; rendered, it reads exactly as
 * Part B wrote it. The guide email's copy lives with the other emails
 * in `email.ts`.
 *
 * No dependencies on purpose: `next.config.ts` imports the asset paths
 * from here for the PDF's download name, so this file stays a leaf.
 */
export const GUIDE_OFFER = {
  eyebrow: "Free guide",
  heading: "The Small Business Guide to AI",
  body: "Where AI gives you back hours and money, in plain English. About a 10-minute read.",
  fields: {
    name: { label: "Name", maxLength: 100 },
    email: { label: "Email" },
  },
  submit: "Download the guide",
  smallPrint: "We'll email you a copy too.",
  /** The close control's accessible name (it shows only the ×). */
  close: "Close",
  success: "It's downloading now. A copy is on its way to your inbox.",
  /** "That didn't go through. Try again, or email hello@… and we'll send it over." */
  failure: {
    lead: "That didn't go through. Try again, or email",
    tail: "and we'll send it over.",
  },
} as const;

/**
 * The guide's two files, shipped brand assets under `/public/guides/`
 * (Taxonomy §7, kebab-case per §8). The delivered names carried the
 * illustration's character name; no public path and no download name
 * does. The PDF is installed byte-identical; the cover is the
 * delivered image resized from 1024px to 512px, nothing else changed.
 */
export const GUIDE_ASSETS = {
  pdf: "/guides/small-business-guide-to-ai.pdf",
  cover: "/guides/small-business-guide-to-ai-cover.png",
  /**
   * What the visitor's file is saved as, from the card's download and
   * from the email's link alike (the PDF is served with this name in
   * its Content-Disposition, `next.config.ts`).
   */
  downloadName: "The Small Business Guide to AI.pdf",
} as const;
