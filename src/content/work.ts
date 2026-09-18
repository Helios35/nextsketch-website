import { CASE_STUDIES } from "@/content/case-studies";
import { ROUTES } from "@/lib/types";
import type { PlatformBadge, WorkItem } from "@/lib/types";

/**
 * Selected-work (#work) copy — the proof band (owner direction
 * 2026-08-24: the site was converting poorly because nothing on it
 * demonstrated proof of work or authority). The section is reactivated
 * from the dormant set, which decision-log #13 required a new owner
 * decision to do — see docs/decision-log.md #16. Since #39 the band is
 * also the doorway to `/work`, the case study grid, and every card
 * lands on its own `/work/<slug>` route; the strings those two pages
 * need live at the bottom of this file.
 *
 * The item inventory no longer lives here. Each case study is its own
 * module under `src/content/case-studies/` (#41), and `WORK_ITEMS`
 * below is that list under the name the band has always read.
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

/**
 * Supporting line under the headline — owner-specified verbatim
 * (2026-08-24), replacing a DRAFT line that asserted every screen was
 * live and still running. Two of the four linked projects read as case
 * studies rather than shipped products, so that claim was not one this
 * section could stand behind; authorship is.
 *
 * NOTE: the brand renders here as "Next Sketch" (two words) because
 * that is the owner's exact wording. It diverges from
 * docs/06-taxonomy.md §8, which makes "NextSketch" binding for all
 * copy and reserves the spaced form for the legal name ("Next Sketch
 * LLC"). Flagged rather than silently corrected — it is a one-word
 * change either way, and the owner's call. Since decision-log #43 the
 * line also answers "What did we do?" on a case study page that omits
 * its own `question.body` (Mascot does), so the spaced form is on
 * three surfaces.
 */
export const WORK_INTRO = "Every screen is built and designed by Next Sketch";

/**
 * Per-card link label — owner-specified verbatim (2026-08-24). Since
 * #39 the card it labels lands on the project's own case study route
 * rather than its Behance page; the label reads the same for both.
 *
 * Deliberately NOT from the Rule 3.1 CTA set: that set is exhaustive
 * for *conversion* CTAs, and this control is navigation to the
 * project's case study, not a conversion action — the same reasoning
 * the off-ramp's "Stay in Touch" carve-out records in Rule 3.1. It is
 * also distinct from the Rule 3.2 banned read-on phrasing, which bans
 * one exact string this is not.
 */
export const WORK_LINK = "See More";

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
 * It lands on `/work`, the case study grid (owner decision 2026-09-12,
 * decision-log #39). Until then it opened the owner's Behance profile,
 * standing in for a page this site did not have; that URL is still the
 * footer's Behance social link, so nothing is lost. The label did not
 * change. `href` stays optional on the type: with it unset the card
 * renders its button in the system's documented disabled state rather
 * than as an anchor pointing nowhere.
 */
export const WORK_VIEW_ALL: { label: string; href?: string } = {
  label: "View all",
  href: ROUTES.work,
};

/** Placeholder caption shown on a card whose screenshot is still owed. */
export const WORK_PLACEHOLDER_LABEL = "Screenshot pending";

/**
 * The work inventory the band renders, in display order — the case
 * study list itself (decision-log #41), under the name `work-section.tsx`
 * has read since the band shipped. The four entries moved out of this
 * file into `src/content/case-studies/`, one module each, byte for
 * byte: names, links, screenshots, summaries and the per-image grading
 * notes travelled with them. Keeping the alias is what leaves the home
 * page's section component untouched (verified against the built HTML:
 * the home markup is identical except for the card destinations, #39).
 *
 * What still governs every entry, wherever it lives:
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
export const WORK_ITEMS: readonly WorkItem[] = CASE_STUDIES;

/**
 * `/work` — the case study grid (decision-log #39): page metadata plus
 * the intro band's copy.
 *
 * The eyebrow, headline and intro are the proof band's own strings,
 * reused rather than redrafted. The grid *is* the band in full — a
 * visitor arrives from the band's "View all" — and the headline is
 * owner-specified copy (2026-08-24) while no page-specific line exists
 * yet. A line of the page's own is an owner call, not a builder's
 * draft. `title` and `description` are DRAFT in the `PRICING.title`
 * house form; the description restates the approved headline and
 * claims nothing the band does not.
 */
export const WORK_PAGE = {
  title: "Work | NextSketch",
  description:
    "Selected work from NextSketch. Real products doing the job they were built to do.",
  eyebrow: WORK_EYEBROW,
  headline: WORK_HEADLINE,
  intro: WORK_INTRO,
  /**
   * Accessible name for the grid landmark (screen-reader only). The
   * grid is a region with no visible heading of its own — the page's
   * <h1> already names it — so it needs one that is not the eyebrow.
   */
  gridHeading: "All case studies",
} as const;

/**
 * `/work/[slug]` — the strings the case study routes render that are
 * not a study's own content (decision-log #39, #43, #44). A study with
 * a `page` renders the full page; one without renders the layout-final
 * placeholder it has had since #39, which is what `pending` is for.
 * DRAFT in brand voice pending owner approval.
 *
 * `back`, `visit` and `source` are navigation, not conversion CTAs, so
 * the Rule 3.1 set does not bind them (the `WORK_LINK` reasoning).
 * `visit` renders only for a live project (`liveHref`, owner rule
 * 2026-09-14, #44); none is today, so the string ships unused on
 * purpose. `source` names the platform because every published page
 * is on it; if a study is ever published elsewhere, this label is what
 * changes.
 */
export const CASE_STUDY_PAGE = {
  /** Mono micro-label above the study's name. */
  eyebrow: "Case study",
  /** The placeholder route's body: the detail is coming, and where the work is meanwhile. */
  pending:
    "The full case study is coming. Until it lands, the rest of the work is one click away.",
  /** Navigation back to the grid. */
  back: "All work",
  /** Off-site link to the live product. Live projects only (#44). */
  visit: "Visit website",
  /** Off-site link to the study's published page; rendered only when it has one. */
  source: "View on Behance",
  /** Screen-reader suffix on the off-site links, which open a new tab. */
  newTab: "opens in a new tab",
  /**
   * Accessible name for the header's chip row (screen-reader only, the
   * `/work` grid's `sr-only` heading pattern): the chips have no
   * visible label of their own.
   */
  chipsLabel: "Service and platform",
  /** The band of other studies near the end of the page. */
  othersEyebrow: "More work",
  othersHeading: "Other projects",
} as const;

/**
 * The platform badges a case study's chip row draws from (owner
 * direction, 2026-09-14; decision-log #44): the six labels the owner
 * set, keyed by the `PlatformBadge` vocabulary so a study declares keys
 * and the words are written once, here. A study carries one or more.
 * Total over the type, so a new key without a label fails typecheck
 * rather than rendering blank.
 */
export const PLATFORM_BADGES: Record<PlatformBadge, string> = {
  "web-app": "Web App",
  saas: "SaaS",
  "mobile-app": "Mobile App",
  device: "Device",
  "agentic-platform": "Agentic Platform",
  "internal-tool": "Internal Tool",
};
