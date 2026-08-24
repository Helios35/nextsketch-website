import type { WorkItem } from "@/lib/types";

/**
 * Selected-work (#work) copy and item inventory — the proof band
 * (owner direction 2026-08-24: the site was converting poorly because
 * nothing on it demonstrated proof of work or authority). The section
 * is reactivated from the dormant set, which decision-log #13 required
 * a new owner decision to do — see docs/decision-log.md #16.
 *
 * No canonical copy exists for this section (Messaging Kit §05 does
 * not cover it and architecture row 5 deferred to the placeholder
 * spec), so every string here is DRAFT in brand voice pending owner
 * approval — the same status as the other section eyebrows and the
 * modal/email copy (Rule 4.4).
 *
 * Rule 4.3 (no invented project names or outcomes) is binding and is
 * why WORK_ITEMS ships as owner-owed entries rather than plausible
 * filler: the names, summaries, screenshots and links below are the
 * owner's to supply. Until an item has an `image`, its card renders
 * the layout-final ink placeholder, so the real screenshot swaps in
 * with zero layout shift (docs/06-taxonomy.md §7).
 */

/** Section eyebrow — DRAFT pending owner approval. */
export const WORK_EYEBROW = "Work in production";

/**
 * Display headline. "in production" takes the gold payoff treatment in
 * the section component (docs/04-ux-spec.md §Typography) and echoes
 * the hero's locked promise ("From idea to production") and the
 * Validate phase's "working software doing the job it was built to
 * do" — the proof band restates the promise as evidence rather than
 * introducing a new claim. DRAFT pending owner approval.
 */
export const WORK_HEADLINE =
  "Real products in production — doing the job they were built to do.";

/** Supporting line under the headline. DRAFT pending owner approval. */
export const WORK_INTRO =
  "Every screen here is live software. Built, shipped, and still running.";

/**
 * Per-card link label. Deliberately NOT from the Rule 3.1 CTA set:
 * that set is exhaustive for *conversion* CTAs, and this control is
 * navigation to a live product, not a conversion action — the same
 * reasoning the off-ramp's "Stay in Touch" carve-out records in Rule
 * 3.1. It also avoids the Rule 3.2 banned read-on phrasing by name.
 * DRAFT pending owner approval.
 */
export const WORK_LINK = "See it live";

/** Accessible names for the rail and its controls (screen-reader copy). */
export const WORK_RAIL = {
  label: "Selected work",
  previous: "Previous work",
  next: "Next work",
  /** `{n}` is replaced with the 1-based card number. */
  goTo: "Go to work {n}",
} as const;

/** Placeholder caption shown on a card whose screenshot is still owed. */
export const WORK_PLACEHOLDER_LABEL = "Screenshot pending";

/**
 * The work inventory, in display order.
 *
 * OWNER-OWED (2026-08-24): `name`, `summary`, `image`, `alt` and the
 * optional `href` are the owner's to supply — the screenshots were
 * promised once the section structure existed. The four entries below
 * hold the layout at its final shape; they carry no invented project
 * names or outcomes (Rule 4.3), which is why `name` reads as an
 * explicit slot rather than a plausible client name.
 *
 * Screenshots are shipped brand assets, not placeholders, so they land
 * in `/public/work/{id}.jpg` (kebab-case per Taxonomy §8) — the same
 * treatment the hero and backdrop footage got in Unit 03. Any source
 * resolution works: the card frame is a fixed 16/9 box and the image
 * center-crops from the top via object-cover, so every card matches
 * regardless of the screenshot's real dimensions (owner requirement,
 * 2026-08-24).
 */
export const WORK_ITEMS = [
  {
    id: "work-01",
    name: "Project one",
    summary:
      "Owner-owed: one line on what this product does and who it does it for.",
    image: "/work/work-01.jpg",
    alt: "A blue handheld kids device beside a phone showing its companion app, with mascot avatars and activity cards.",
  },
  {
    id: "work-02",
    name: "Project two",
    summary:
      "Owner-owed: one line on what this product does and who it does it for.",
    image: "/work/work-02.jpg",
    alt: "A project planning dashboard with deliverable cards above a team timeline of milestones.",
    // Content sits at the top over trailing whitespace — a centered
    // crop would cut the header and the cards under it.
    focal: "top",
  },
  {
    id: "work-03",
    name: "Project three",
    summary:
      "Owner-owed: one line on what this product does and who it does it for.",
    image: "/work/work-03.jpg",
    alt: "A dark 3D CAD workspace showing a gear model beside an AI assistant panel.",
    // The one already-dark screenshot — the light mask would erase it.
    tone: "dark",
  },
  {
    id: "work-04",
    name: "Project four",
    summary:
      "Owner-owed: one line on what this product does and who it does it for.",
    image: "/work/work-04.jpg",
    alt: "Two phones showing a media app's sign-in screen and its browsing grid.",
  },
] as const satisfies readonly WorkItem[];
