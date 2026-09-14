import type { CaseStudy } from "@/lib/types";

/**
 * SaaS Platform — the second card and tile, and the second case study
 * rendered by the template (decision-log #42).
 *
 * Name, link and screenshot are the owner's (2026-08-24); the summary
 * is DRAFT pending approval. `name` is the project's Behance title
 * rather than the product name inside the screenshot, because the
 * published title is what the owner released the work under and
 * asserting a client's product name would be a claim the source does
 * not make (build-note 20). The specifics live in the summary. One
 * module per case study (#41).
 *
 * **Everything below `description` is DRAFT starter copy**, written
 * 2026-09-14 at the owner's direction on the reference page's
 * structure, grounded in the one known screenshot (deliverable cards
 * above a team timeline of milestones, on a laptop) and the summary.
 * No client, no numbers, no results (Rule 4.3); intent written as
 * intent. The owner edits it here and nowhere else. Every image slot
 * is a placeholder until imagery arrives; each `alt` describes what
 * the real image should show. `slug` is the published title slugified
 * (Taxonomy §8, §6); `title` and `description` are DRAFT metadata.
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
  intro:
    "A web-based team workspace for tracking deliverables and milestones, designed and built by NextSketch.",
  need: "new_product",
  meta: [
    { label: "Industry", value: "Project planning" },
    { label: "Scope", value: "Design and build" },
    { label: "Platform", value: "Web" },
  ],
  hero: {
    alt: "The project planning dashboard on a laptop, with deliverable cards above a team timeline of milestones.",
  },
  blocks: [
    {
      type: "text",
      label: "The challenge",
      statement:
        "Teams needed one place to see what they owed and when, without a list of deliverables in one tool and a timeline in another.",
      body: [
        "Deliverables and milestones are different kinds of information. One is a set of discrete items, the other a sequence in time. Showing both as one plan, not two lists, was the problem to solve.",
      ],
    },
    {
      type: "pair",
      images: [
        { alt: "The deliverable cards on the dashboard." },
        { alt: "The team timeline of milestones on the dashboard." },
      ],
    },
    {
      type: "image",
      image: {
        alt: "The full project planning dashboard in a desktop browser.",
      },
    },
    {
      type: "text",
      label: "The goal",
      statement:
        "The goal was a planning dashboard a team could open and read in a single pass, then act on without leaving it.",
      body: [
        "That meant restraint: a workspace built around two jobs and kept plain enough that neither gets in the way of the other, on the desktop screens where planning happens.",
      ],
    },
    {
      type: "pair",
      images: [
        { alt: "A single deliverable card." },
        { alt: "A stretch of the team timeline with its milestones." },
      ],
    },
    {
      type: "text",
      label: "What we built",
      statement:
        "We designed and built every screen: a project planning dashboard with deliverable cards above a team timeline of milestones.",
      body: [
        "Each deliverable is a card. The timeline lays the milestones out in sequence beneath them, so the work and its timing sit in the same view and a team tracks both in one product.",
      ],
    },
    {
      type: "image",
      image: {
        alt: "The workspace on a desktop screen, populated with deliverable cards and milestones.",
      },
    },
  ],
} as const satisfies CaseStudy;
