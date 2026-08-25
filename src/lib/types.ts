/**
 * Shared domain types. Canonical names and values come from
 * docs/06-taxonomy.md — never invent alternates.
 */

/** Section anchor IDs, exact, per Taxonomy §6. */
export const SECTION_IDS = [
  "top",
  "why",
  "process",
  "work",
  "services",
  "about",
  "voices",
  "fit",
  "faq",
  "start",
] as const;

export type SectionId = (typeof SECTION_IDS)[number];

/** Accent color pairs per Taxonomy §5; pairing rule: accent bg ⇒ paired -ink text. */
export const ACCENT_NAMES = ["gold", "lavender", "rose", "sage"] as const;

export type AccentName = (typeof ACCENT_NAMES)[number];

/** Service slugs per Taxonomy §1. */
export type ServiceSlug = "new-product" | "rescue" | "agentic" | "partnership";

export interface Service {
  readonly slug: ServiceSlug;
  readonly name: string;
  readonly description: string;
  readonly accent: AccentName;
}

/** Process phase slugs per Taxonomy §2, ordered, exactly four. */
export type ProcessPhaseSlug = "strategy" | "build" | "validate" | "partner";

export interface ProcessPhase {
  /** Two-digit display order, "01"–"04". */
  readonly order: "01" | "02" | "03" | "04";
  readonly slug: ProcessPhaseSlug;
  readonly name: string;
  readonly description: string;
  readonly accent: AccentName;
}

export interface FaqItem {
  readonly question: string;
  readonly answer: string;
}

/**
 * One card in the selected-work rail (#work). Content lives in
 * src/content/work.ts; Rule 4.3 forbids invented names or outcomes, so
 * every field here is owner-supplied.
 *
 * `image`/`alt` and `href` are optional on purpose, and independently:
 * a project whose screenshot is still owed renders the layout-final
 * ink placeholder in the same 16/9 frame (zero layout shift on
 * swap-in), and a project with no public URL renders as a non-linking
 * tile rather than a dead link. `alt` is required whenever `image` is
 * set — enforced by the union below, so a screenshot can never ship
 * without its accessible description.
 */
export type WorkItem = {
  /** Stable key; also the screenshot's file name under /public/work/. */
  readonly id: string;
  readonly name: string;
  readonly summary: string;
  /** Live product URL. Omitted when the work has no public link. */
  readonly href?: string;
} & (
  | {
      readonly image: string;
      readonly alt: string;
      /**
       * Which edge the 16/9 crop holds when the source is taller than
       * the frame. "center" (default) suits mockups whose subject is
       * vertically centered; "top" suits a full-page screenshot whose
       * content sits at the top over trailing whitespace.
       */
      readonly focal?: "center" | "top";
      /**
       * How hard the grading mask works on this screenshot. "light"
       * (default) suits anything from a mid-toned mockup to a mixed
       * one; "bright" is for a near-white screenshot that would
       * otherwise glare against the ink band.
       *
       * Measured, not guessed — the four shipped screenshots run
       * 0.40–0.92 mean luminance, and only the white dashboard (0.92)
       * needs the stronger hold-back. Under one flat mask its card
       * reads noticeably hotter than the rest; with "bright" the set
       * lands inside a 0.18 band.
       *
       * There is deliberately no "dark" variant. A genuinely near-black
       * screenshot would need one, but none of the current set is: the
       * CAD tool looks dark yet is bimodal — a near-black app inside a
       * light grey canvas — so lifting it would blow that canvas out
       * and make it the second-brightest card in the rail.
       */
      readonly tone?: "light" | "bright";
    }
  | {
      readonly image?: undefined;
      readonly alt?: undefined;
      readonly focal?: undefined;
      readonly tone?: undefined;
    }
);

/**
 * The routes the site serves (docs/03-site-architecture.md §Sitemap).
 * `/` is the single scrolling page; `/pricing` is the one standalone
 * route (decision-log #23). `/api/qualify` is POST-only and has no
 * page, so it is not a destination anything links to.
 */
export const ROUTES = {
  home: "/",
  pricing: "/pricing",
} as const;

/**
 * Root-relative anchor for a section — `/#work`, never `#work`.
 *
 * A bare hash is resolved against the *current* route, so `#work` on
 * `/pricing` means `/pricing#work`, which is nothing. Every nav and
 * footer link now leaves the page it is on, so all of them must be
 * root-relative (decision-log #23). On `/` the two forms behave
 * identically: same document, same fragment navigation, same
 * motion-gated smooth scroll.
 *
 * Generic rather than `(id: SectionId) => string` so the literal
 * survives — a mistyped anchor fails typecheck instead of shipping a
 * dead link, which is the guarantee the old `id`-plus-derived-hash
 * shape gave and a plain href string would have thrown away.
 */
export const sectionHref = <T extends SectionId>(id: T): `/#${T}` => `/#${id}`;

/** Pricing tier slugs per docs/06-taxonomy.md, ordered, exactly four. */
export type PricingTierSlug = "workflow" | "tool" | "rescue" | "custom";

/**
 * One tier on `/pricing` (decision-log #25). Copy lives in
 * `src/content/pricing.ts`; nothing here is rendered from a component
 * literal.
 *
 * `upfront` and `ongoing` are **display strings, not numbers**. Two of
 * the four tiers have no numeric upfront at all (one is retainer-only,
 * one is quoted), so a `number` would have forced a sentinel and every
 * consumer would have had to re-derive the label from it. The figure a
 * visitor reads is the figure in content.
 *
 * `features` is `readonly string[]` and may be empty: a tier renders no
 * list rather than an invented one (Rule 4.3). Bullets are owner-owed.
 */
export interface PricingTier {
  readonly slug: PricingTierSlug;
  readonly name: string;
  readonly description: string;
  /** Headline figure, e.g. "$3,998" / "No upfront" / "Quoted". */
  readonly upfront: string;
  /** Caption under the headline figure. */
  readonly upfrontNote: string;
  /** The retainer figure, e.g. "$298 per month". */
  readonly ongoing: string;
  /** Caption under the retainer figure — where the term is said out loud. */
  readonly ongoingNote: string;
  readonly features: readonly string[];
}
