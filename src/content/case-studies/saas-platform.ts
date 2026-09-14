import type { CaseStudy } from "@/lib/types";

/**
 * SaaS Platform — the second card and tile.
 *
 * Name, link and screenshot are the owner's (2026-08-24); the summary
 * is DRAFT pending approval. `name` is the project's Behance title
 * rather than the product name inside the screenshot, because the
 * published title is what the owner released the work under and
 * asserting a client's product name would be a claim the source does
 * not make (build-note 20). The specifics live in the summary. Moved
 * here from `src/content/work.ts` unchanged (decision-log #41).
 *
 * `slug` is the published title slugified (Taxonomy §8, §6). `title`
 * and `description` are the route's metadata; DRAFT. Nothing narrative
 * lives here until the owner supplies it (Rule 4.3; Unit 25).
 */
export const SAAS_PLATFORM = {
  slug: "saas-platform",
  id: "work-02",
  name: "SaaS Platform",
  summary: "A team workspace for tracking deliverables and milestones.",
  sourceHref: "https://www.behance.net/gallery/176781989/Saas-Platform",
  image: "/work/work-02.webp",
  alt: "A laptop showing a project planning dashboard with deliverable cards above a team timeline of milestones.",
  // No `focal`: the mockup is 2:1, wider than the 16/9 frame, so the
  // crop takes width and a vertical focal point would do nothing.
  // Measured mean luminance 0.87 — the brightest of the set by a
  // clear margin (88% of the frame in the top luminance band), and
  // the only one that glares under the base grade.
  tone: "bright",
  title: "SaaS Platform | NextSketch",
  description:
    "SaaS Platform: a team workspace for tracking deliverables and milestones. Selected work from NextSketch.",
} as const satisfies CaseStudy;
