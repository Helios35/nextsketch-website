import type { CaseStudy } from "@/lib/types";

/**
 * Mascot — the first card in the rail and the first tile on `/work`.
 *
 * Name, link and screenshot are the owner's (supplied 2026-08-24); the
 * summary is DRAFT, written from the linked project and pending
 * approval (build-note 20). Moved here from the `WORK_ITEMS` inventory
 * in `src/content/work.ts` unchanged — one module per case study is the
 * settled shape (decision-log #41), so adding a study is adding a file
 * beside this one and a line in `index.ts`.
 *
 * `slug` is the published title slugified (Taxonomy §8, §6). `title`
 * and `description` are the route's metadata in the `PRICING.title`
 * house form; both DRAFT.
 *
 * Nothing narrative lives here yet, and nothing should until the owner
 * supplies it: results, metrics, client names and quotes are Rule 4.3
 * territory, and the template that renders them is Unit 25's.
 */
export const MASCOT = {
  slug: "mascot",
  id: "work-01",
  name: "Mascot",
  summary: "An AI companion device for kids, and the app parents run it.",
  sourceHref: "https://www.behance.net/gallery/197568297/Mascot",
  image: "/work/work-01.webp",
  alt: "A blue handheld kids device beside a phone showing its companion app, with mascot avatars and activity cards.",
  title: "Mascot | NextSketch",
  description:
    "Mascot: an AI companion device for kids, and the app parents run it. Selected work from NextSketch.",
} as const satisfies CaseStudy;
