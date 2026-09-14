import type { CaseStudy } from "@/lib/types";

/**
 * Parcell — the fourth card and tile.
 *
 * Name, link and screenshot are the owner's (2026-08-24); the summary
 * is DRAFT pending approval. Moved here from `src/content/work.ts`
 * unchanged (decision-log #41).
 *
 * `slug` is the published title slugified (Taxonomy §8, §6). `title`
 * and `description` are the route's metadata; DRAFT. Nothing narrative
 * lives here until the owner supplies it (Rule 4.3; Unit 25).
 */
export const PARCELL = {
  slug: "parcell",
  id: "work-04",
  name: "Parcell",
  summary: "A mobile app for discovering and collecting digital art.",
  sourceHref: "https://www.behance.net/gallery/176762755/Parcell",
  image: "/work/work-04.webp",
  alt: "Two phones showing a digital art app's sign-in screen and its browsing grid.",
  title: "Parcell | NextSketch",
  description:
    "Parcell: a mobile app for discovering and collecting digital art. Selected work from NextSketch.",
} as const satisfies CaseStudy;
