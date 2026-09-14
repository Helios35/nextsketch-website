import type { CaseStudy } from "@/lib/types";

/**
 * Agentic Platform — the third card and tile.
 *
 * Name, link and screenshot are the owner's (2026-08-24); the summary
 * is DRAFT pending approval. `name` is the Behance title, not the
 * product name inside the screenshot, for the reason `saas-platform.ts`
 * records. Moved here from `src/content/work.ts` unchanged
 * (decision-log #41).
 *
 * The screenshot takes the base grade despite reading as dark: it is
 * bimodal — a near-black app inside a light grey canvas — and lifting
 * it blows the canvas out (build-note 20). No `tone` on purpose.
 *
 * `slug` is the published title slugified (Taxonomy §8, §6). `title`
 * and `description` are the route's metadata; DRAFT. Nothing narrative
 * lives here until the owner supplies it (Rule 4.3; Unit 25).
 */
export const AGENTIC_PLATFORM = {
  slug: "agentic-platform",
  id: "work-03",
  name: "Agentic Platform",
  summary: "A CAD tool where an embedded agent drafts parts.",
  sourceHref: "https://www.behance.net/gallery/226572695/Agentic-Platform",
  image: "/work/work-03.webp",
  alt: "A laptop showing a dark 3D CAD workspace with a gear model beside an AI assistant panel.",
  title: "Agentic Platform | NextSketch",
  description:
    "Agentic Platform: a CAD tool where an embedded agent drafts parts. Selected work from NextSketch.",
} as const satisfies CaseStudy;
