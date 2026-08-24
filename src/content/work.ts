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
 * Rule 4.3 (no invented project names or outcomes) is binding: names,
 * screenshots and links are the owner's, and the summaries describe
 * only what each product is. An item with no `image` renders the
 * layout-final ink placeholder instead, so a later screenshot swaps in
 * with zero layout shift (docs/06-taxonomy.md §7).
 */

/** Section eyebrow — DRAFT pending owner approval. */
export const WORK_EYEBROW = "Work in production";

/**
 * Display headline, owner-specified verbatim (2026-08-24) — the em
 * dash and "in production" both dropped. It still echoes the Validate
 * phase's "working software doing the job it was built to do", so the
 * proof band restates the promise as evidence rather than introducing
 * a new claim.
 *
 * "Real Products" takes the gold payoff treatment in the section
 * component (docs/04-ux-spec.md §Typography — at most a couple of
 * words). That phrase is a judgment call, not owner-specified: the
 * old accent ("in production") is gone with the rewrite, and the
 * system requires one payoff phrase per headline. It follows the
 * owner's own capitalisation, which is the emphasis they marked.
 */
export const WORK_HEADLINE =
  "Real Products doing the job they were built to do";

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
  /** The trailing card is not a numbered work, so it names itself. */
  goToViewAll: "Go to view all",
} as const;

/**
 * The rail's trailing card — a single control to the full archive
 * instead of a screenshot (owner direction 2026-08-24).
 *
 * Points at the owner's Behance profile (supplied 2026-08-24) — the
 * same URL the footer's Behance social link already uses. `href` stays
 * optional on the type: with it unset the card renders its button in
 * the system's documented disabled state rather than as an anchor
 * pointing nowhere.
 */
export const WORK_VIEW_ALL: { label: string; href?: string } = {
  label: "View all",
  href: "https://www.behance.net/nateivy",
};

/** Placeholder caption shown on a card whose screenshot is still owed. */
export const WORK_PLACEHOLDER_LABEL = "Screenshot pending";

/**
 * The work inventory, in display order.
 *
 * Names and links are the owner's, supplied 2026-08-24; the summaries
 * are DRAFT, written from each linked project and pending approval.
 *
 * `name` is the project's own Behance title rather than the product
 * name shown inside the screenshot (Genioo, Caddy), because the
 * Behance title is what the owner published the work under — and
 * asserting a client's product name on a card would be a claim the
 * source doesn't make. Two of the four are therefore generic ("SaaS
 * Platform", "Agentic Platform") and the specifics live in the
 * summary. Easy to swap if the owner prefers the product names.
 *
 * Summaries say only what each product *is*, never how it performed:
 * the linked pages carry no written description at all (tags and
 * imagery only), so any outcome claim would be invented (Rule 4.3).
 * They also sit near 60 characters so they hold two lines at the
 * narrowest card width, which is the length the owner specified.
 *
 * Screenshots are shipped brand assets, not placeholders, so they land
 * in `/public/work/{id}.{ext}` (kebab-case per Taxonomy §8) — the
 * same treatment the hero and backdrop footage got in Unit 03, in
 * whatever format the owner supplied rather than re-encoded. Any
 * source resolution works: the card frame is a fixed 16/9 box and the
 * image crops via object-cover, so every card matches regardless of
 * the screenshot's real dimensions (owner requirement, 2026-08-24).
 */
export const WORK_ITEMS = [
  {
    id: "work-01",
    name: "Mascot",
    summary: "An AI companion device for kids, and the app parents run it.",
    href: "https://www.behance.net/gallery/197568297/Mascot",
    image: "/work/work-01.webp",
    alt: "A blue handheld kids device beside a phone showing its companion app, with mascot avatars and activity cards.",
  },
  {
    id: "work-02",
    name: "SaaS Platform",
    summary: "A team workspace for tracking deliverables and milestones.",
    href: "https://www.behance.net/gallery/176781989/Saas-Platform",
    image: "/work/work-02.webp",
    alt: "A laptop showing a project planning dashboard with deliverable cards above a team timeline of milestones.",
    // No `focal`: the mockup is 2:1, wider than the 16/9 frame, so the
    // crop takes width and a vertical focal point would do nothing.
    // Measured mean luminance 0.87 — the brightest of the set by a
    // clear margin (88% of the frame in the top luminance band), and
    // the only one that glares under the base grade.
    tone: "bright",
  },
  {
    id: "work-03",
    name: "Agentic Platform",
    summary: "A CAD tool where an embedded agent drafts parts.",
    href: "https://www.behance.net/gallery/226572695/Agentic-Platform",
    image: "/work/work-03.webp",
    alt: "A laptop showing a dark 3D CAD workspace with a gear model beside an AI assistant panel.",
  },
  {
    id: "work-04",
    name: "Parcell",
    summary: "A mobile app for discovering and collecting digital art.",
    href: "https://www.behance.net/gallery/176762755/Parcell",
    image: "/work/work-04.webp",
    alt: "Two phones showing a digital art app's sign-in screen and its browsing grid.",
  },
] as const satisfies readonly WorkItem[];
