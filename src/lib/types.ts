import type { ProjectType } from "@/lib/schema";

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
/**
 * The four service slugs, kebab-case per docs/06-taxonomy.md §8 and
 * matching the display names one-for-one (decision-log #27).
 *
 * A slug is never a fossil of a retired name: `rescue`, `agentic` and
 * `partnership` were the 2026-06 names and outlived them by two
 * renames. These are what unit 26's service routes will be built on,
 * so they are the display names slugified and nothing else.
 *
 * Distinct from `ProjectType` in `src/lib/schema.ts`, which is the
 * stored payload vocabulary (snake_case, §3) and does **not** change
 * with a rename — the lead record's values are a contract.
 */
export type ServiceSlug =
  | "new-product"
  | "product-completion"
  | "product-support"
  | "agentic-system";

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
 * `/` is the scrolling home page; `/pricing` is the first standalone
 * route (decision-log #23) and the **two service routes** under
 * `/services/` are the next (**#30**). `/api/qualify` is POST-only and
 * has no page, so it is not a destination anything links to.
 *
 * The service routes are built by `serviceRoute` rather than listed
 * here, so the segment and the slug can never disagree. There is
 * deliberately **no `/services` index** — the home page's `#services`
 * section is the hub.
 */
export const ROUTES = {
  home: "/",
  pricing: "/pricing",
} as const;

/**
 * The two service routes (decision-log **#30**).
 *
 * The unit-26 brief specified four routes, one per service slug; the
 * owner reduced that to two pages, each covering a related group, with
 * an in-page anchored block per topic (owner direction, 2026-08-28).
 * So a service page slug is **not** a `ServiceSlug`: `product` groups
 * three of the four services, and `agentic-system` is one service sold
 * at two depths (Taxonomy §1 "Two kinds of agentic system", #29).
 *
 * `agentic-system` is spelled exactly like its `ServiceSlug`, which is
 * the point — that page is that service. `product` is a group name and
 * has no service slug behind it.
 */
export type ServicePageSlug = "product" | "agentic-system";

/**
 * Root-relative path for a service route — `/services/product`, never
 * a hand-written string. Generic so the literal survives, the same
 * guarantee `sectionHref` gives its anchors.
 */
export const serviceRoute = <P extends ServicePageSlug>(
  page: P,
): `/services/${P}` => `/services/${page}`;

/**
 * The anchored blocks a service route carries — the "sections covering
 * each topic clicked" (owner direction, 2026-08-28). Each is the `id`
 * of a real `<section>`, so `globals.css`'s `section[id]` scroll-margin
 * clears the fixed bar for free.
 *
 * The first three are the `ServiceSlug`s the `product` page groups. The
 * last two are the two depths `/pricing` sells the Agentic System
 * service at, kebab-cased from their tier names (§8) rather than from
 * the terse tier slugs (`workflow` / `tool`), because these are what a
 * visitor sees in the URL.
 */
export type ServiceBlockId =
  | "new-product"
  | "product-completion"
  | "product-support"
  | "ai-workflow-integration"
  | "internal-tool";

/**
 * Which route hosts each block. Total over `ServiceBlockId`, so a new
 * block that has not been given a page fails typecheck instead of
 * shipping a link to nowhere.
 */
export const SERVICE_BLOCK_PAGE: Record<ServiceBlockId, ServicePageSlug> = {
  "new-product": "product",
  "product-completion": "product",
  "product-support": "product",
  "ai-workflow-integration": "agentic-system",
  "internal-tool": "agentic-system",
};

/**
 * Root-relative anchor for a service block — `/services/product#new-product`.
 *
 * The unit-26 brief calls the bare hash the trap this unit multiplies:
 * `#new-product` written on `/services/agentic-system` resolves to
 * nothing. Nothing hand-writes one; the block id picks its own page out
 * of `SERVICE_BLOCK_PAGE`, so a link can never pair a block with a page
 * that does not carry it.
 */
export const serviceBlockHref = (block: ServiceBlockId): string =>
  `${serviceRoute(SERVICE_BLOCK_PAGE[block])}#${block}`;

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
  /**
   * The struck former figure shown beside `upfront`, e.g. "$5,000".
   * Optional and present on only the tiers the owner has discounted, so
   * a tier without one renders no strikethrough rather than an empty
   * slot. A display string like `upfront`, and it carries its own
   * currency symbol.
   */
  readonly upfrontWas?: string;
  /** Caption under the headline figure. */
  readonly upfrontNote: string;
  /** The retainer figure, e.g. "$298 per month". */
  readonly ongoing: string;
  /** Caption under the retainer figure — where the term is said out loud. */
  readonly ongoingNote: string;
  readonly features: readonly string[];
}

/**
 * One anchored block on a service route (decision-log **#30**) — the
 * §05 (or tier) description a visitor lands on when they click a topic,
 * plus the CTA that carries that topic into the modal.
 *
 * `need` is the canonical `ProjectType` the block's CTA preselects. It
 * is a field rather than a second slug-to-need map because the brief
 * binds this unit to the existing seam: every value is read out of
 * `SERVICE_NEED` or `PRICING_NEED` in content, so there is exactly one
 * mapping per vocabulary and this type only carries the result.
 *
 * `included` is `readonly string[]` and **may be empty**: a block with
 * no owner-approved bullets renders no list at all rather than an
 * invented one, and no empty frame either (Rule 4.3, and the empty
 * `PricingTier.features` precedent). Bullets are owner-owed.
 */
export interface ServicePageBlock {
  readonly id: ServiceBlockId;
  /** Canonical service or tier name — Taxonomy §1. Never reworded. */
  readonly name: string;
  /** Messaging Kit §05 or the tier's `/pricing` description, as-is (Rule 4.1). */
  readonly description: string;
  readonly need: ProjectType;
  readonly included: readonly string[];
}

/**
 * One service route's content (decision-log **#30**).
 *
 * **Three fields are optional because the copy behind them is
 * owner-owed, and each renders nothing until it lands** (Rule 4.3, the
 * brief's "render nothing in that slot — not a placeholder heading, not
 * an empty frame"):
 *
 * - `headline` — the one-line promise. Until it exists the `<h1>` falls
 *   back to `name`, which is canonical vocabulary rather than drafted
 *   copy, so the page is never headless and nothing invented ships.
 * - `accentPhrase` — the gold payoff word inside `headline`. Matched
 *   against the string, so it degrades to an unaccented heading exactly
 *   like every other section's `ACCENT_PHRASE`.
 * - `intro` — the supporting paragraph. Supplied on both routes: the
 *   agentic one is its §05 line, the product one is the group-level
 *   description approved by the owner on 2026-08-30. It stays optional
 *   so a future route without approved copy renders nothing rather than
 *   a placeholder.
 *
 * `need` is optional for the same reason it is optional on
 * `ModalTrigger`: a page covering one service preselects it, and a page
 * covering three preselects nothing rather than guessing one of them.
 */
export interface ServicePageContent {
  readonly slug: ServicePageSlug;
  /** Browser tab and search-result title, in the `PRICING.title` house form. */
  readonly title: string;
  readonly description: string;
  /** Mono micro-label above the heading (docs/04-ux-spec.md §Typography). */
  readonly eyebrow: string;
  /** Canonical name; the `<h1>` fallback until `headline` is approved. */
  readonly name: string;
  readonly headline?: string;
  readonly accentPhrase?: string;
  readonly intro?: string;
  readonly need?: ProjectType;
  /**
   * Labels for the hero's capability strip — the same marquee the
   * landing hero carries (`CapabilityStrip`), with this route's own
   * services in it (decision-log **#30**, owner direction 2026-08-30).
   * Canonical names only, referenced from `SERVICES` / `PRICING_TIERS`
   * rather than re-literalled, so a rename cannot leave the strip
   * behind.
   */
  readonly strip: readonly string[];
  readonly blocks: readonly ServicePageBlock[];
}
