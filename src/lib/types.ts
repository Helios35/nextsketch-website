import type { QuickNeed } from "@/content/modal";

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

/**
 * The dead per-service / per-phase accent data names (Taxonomy §5,
 * RETIRED). None is a colour token since decision-log #47; the data is
 * never rendered (coral `brand` is the one accent).
 */
export const ACCENT_NAMES = ["gold", "lavender", "rose", "sage"] as const;

export type AccentName = (typeof ACCENT_NAMES)[number];

/**
 * The two offerings' slugs, per docs/06-taxonomy.md §1 (decision-log
 * #53). Agentic System Integration is `agentic-system` and AI Product
 * Development is `product`: each is the route slug that offering's
 * page already had (#30), so no URL moved. A display name no longer
 * mirrors its slug word for word.
 *
 * The four service slugs of #27 retire as offering keys. Three live on
 * as the `/services/product` block anchors (`ServiceBlockId`, below),
 * which is where a shared or bookmarked link still points.
 *
 * Distinct from `ProjectType` in `src/lib/schema.ts`, which is the
 * stored payload vocabulary (snake_case, §3) and does **not** change
 * with a rename — the lead record's values are a contract.
 */
export type ServiceSlug = "agentic-system" | "product";

/**
 * One offering on the home page's Services cards (#53). Copy lives in
 * `src/content/services.ts`.
 *
 * The dead `accent` field retired with the four services it carried:
 * it was never rendered (#47), and two new offerings would have needed
 * invented values to keep it.
 */
export interface Service {
  readonly slug: ServiceSlug;
  readonly name: string;
  /** The line under the name: what the offering is, in buyer words. */
  readonly subtitle: string;
  readonly description: string;
  /** The card's price row, upfront first, composed from `PRICES`. */
  readonly price: readonly string[];
  /**
   * The example jobs the card previews (#57). They are the names of
   * the blocks on that offering's page, read from here by
   * `src/content/service-pages.ts`, so the two cannot drift.
   */
  readonly examples?: readonly string[];
}

/** Process phase slugs per Taxonomy §2, ordered, exactly four (#55). */
export type ProcessPhaseSlug = "map" | "build" | "validate" | "optimize";

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
 * placeholder (a `secondary` frame with a mono label) in the same 16/9
 * frame (zero layout shift on swap-in), and a project with no public
 * URL renders as a non-linking tile rather than a dead link. `alt` is
 * required whenever `image` is set — enforced by the union below, so a
 * screenshot can never ship without its accessible description.
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
       * otherwise glare against the dark `background` band.
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
 * One person in About's team list (decision-log #63). The list lives in
 * `ABOUT.team` (src/content/copy.ts), and the section maps it, so adding
 * a person is a row there plus their two files under `/public/team/`:
 * no component changes (closes build-note 34's F13 for About).
 *
 * Every field is required, so a person can never render without a name,
 * a title, the avatar's accessible name or the still that reduced-motion
 * and no-JS visitors see.
 */
export type TeamMember = {
  /** Stable key; also the base of the person's file names under /public/team/. */
  readonly id: string;
  /** Always shown beneath the card, with the title. */
  readonly name: string;
  readonly title: string;
  /** The avatar's accessible name: who the person is, said in one line. */
  readonly alt: string;
  /**
   * The back of the card: who the person is, written to fill it, about
   * 250 characters. Shown on every card 276px or wider (from `sm:`), and
   * the card's accessible description at every width.
   */
  readonly bio: string;
  /**
   * The same in about 100 characters, for the back of a phone's card
   * (148px at a 360px screen, below `sm:`), which cannot hold `bio`.
   */
  readonly bioShort: string;
  /** Muted clip that loops natively: `/team/{id}.mp4`, shipped as delivered. */
  readonly video: string;
  /** The clip's first frame: `/team/{id}-poster.jpg`, the reduced-motion and no-JS view. */
  readonly poster: string;
};

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
 * Under #30 a page slug was therefore not a `ServiceSlug`.
 *
 * **Since #53 it is again.** The site sells two offerings, one per
 * page, and each offering's slug is its page's slug, so the two names
 * are one union. `ServicePageSlug` stays as the name the routing code
 * reads.
 */
export type ServicePageSlug = ServiceSlug;

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
 * The first three are the `product` page's three ways in (#53). They
 * keep the anchors the retired service slugs gave them, so a shared or
 * bookmarked `/services/product#product-support` still lands on its
 * block. The last four are the agentic page's example jobs (#57),
 * kebab-cased from their names (§8) because a visitor sees them in the
 * URL. The two agentic depths' anchors (`ai-workflow-integration`,
 * `internal-tool`) retired with their blocks; a link to either still
 * opens the page, at the top.
 */
export type ServiceBlockId =
  | "new-product"
  | "product-completion"
  | "product-support"
  | "email-triage"
  | "weekly-reporting"
  | "quoting-and-intake"
  | "document-and-data-entry";

/**
 * Which route hosts each block. Total over `ServiceBlockId`, so a new
 * block that has not been given a page fails typecheck instead of
 * shipping a link to nowhere.
 */
export const SERVICE_BLOCK_PAGE: Record<ServiceBlockId, ServicePageSlug> = {
  "new-product": "product",
  "product-completion": "product",
  "product-support": "product",
  "email-triage": "agentic-system",
  "weekly-reporting": "agentic-system",
  "quoting-and-intake": "agentic-system",
  "document-and-data-entry": "agentic-system",
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

/**
 * Pricing tier slugs, one per offering (decision-log #53, #56). They
 * are unchanged by the move to two tiers, so `workflow` carries Agentic
 * System Integration and `custom` carries AI Product Development: both
 * are fossils of retired tier names, recorded rather than renamed. The
 * `tool` and `rescue` slugs retired with their tiers.
 */
export type PricingTierSlug = "workflow" | "custom";

/**
 * One tier on `/pricing` (decision-log #25, reshaped by #56). Copy
 * lives in `src/content/pricing.ts`; nothing here is rendered from a
 * component literal.
 *
 * `upfront` and `ongoing` are **display strings, not numbers**. They
 * were chosen when two tiers had no numeric upfront (one retainer-only,
 * one quoted); every tier carries a figure since #45, and the strings
 * stay because they already carry their own currency symbol and unit.
 * The figure a visitor reads is the figure in content.
 *
 * The struck former price (`upfrontWas`) retired with #56: a discount
 * that never expires stopped reading as one.
 */
export interface PricingTier {
  readonly slug: PricingTierSlug;
  readonly name: string;
  readonly description: string;
  /** Headline figure, e.g. "$3,998" / "$12,000". */
  readonly upfront: string;
  /**
   * Caption under the headline figure. Optional since #45: a tier
   * without an approved caption renders none rather than an invented
   * line (Rule 4.3).
   */
  readonly upfrontNote?: string;
  /** The retainer figure, e.g. "$2,998 per month". */
  readonly ongoing: string;
  /** Caption under the retainer figure — where the term is said out loud. */
  readonly ongoingNote: string;
  /** "Included": what the upfront build delivers (#56). */
  readonly features: readonly string[];
  /** "What the monthly covers" (#56). */
  readonly monthlyCovers: readonly string[];
}

/**
 * One anchored block on a service route (decision-log **#30**) — what a
 * visitor lands on when they click a topic, plus the CTA that carries
 * it into the modal.
 *
 * `need` is the quick-door value the block's CTA preselects. It is a
 * field rather than a second slug-to-need map because every value is
 * read out of `SERVICE_NEED` in content, so there is exactly one
 * mapping and this type only carries the result. It is typed to the
 * quick door's own options (`QuickNeed`), so a CTA can never preselect
 * a value the door does not show.
 *
 * `included` is `readonly string[]` and **may be empty**: a block with
 * no bullets renders no list at all, and no empty frame either (Rule
 * 4.3). `mapFirst` is the agentic example blocks' "What we map first"
 * line (#57); a block without one renders no panel.
 */
export interface ServicePageBlock {
  readonly id: ServiceBlockId;
  readonly name: string;
  /** What the block delivers or what the agent does, in one paragraph. */
  readonly description: string;
  readonly mapFirst?: string;
  readonly need: QuickNeed;
  readonly included: readonly string[];
}

/**
 * One service route's content (decision-log **#30**; one offering per
 * route since **#53**).
 *
 * **Optional fields render nothing when absent** (Rule 4.3: "render
 * nothing in that slot — not a placeholder heading, not an empty
 * frame"):
 *
 * - `headline` — the one-line promise. Without it the `<h1>` falls back
 *   to `name`, which is canonical vocabulary rather than drafted copy,
 *   so the page is never headless. Both routes carry one since #53.
 * - `accentPhrase` — the coral payoff word inside `headline`. Matched
 *   against the string, so it degrades to an unaccented heading exactly
 *   like every other section's `ACCENT_PHRASE`.
 * - `leadLine`, `intro`, `price` — the hero's lead line, supporting
 *   paragraph and published price (#53, #56).
 * - `offer` — the "What you get" and "What the monthly covers" lists,
 *   the agentic page's (#57).
 *
 * `need` is optional for the same reason it is optional on
 * `ModalTrigger`; both routes carry one since each is one offering.
 */
export interface ServicePageContent {
  readonly slug: ServicePageSlug;
  /** Browser tab and search-result title, in the `PRICING.title` house form. */
  readonly title: string;
  readonly description: string;
  /** Mono micro-label above the heading (docs/04-ux-spec.md §Typography). */
  readonly eyebrow: string;
  /** Canonical name; the `<h1>` fallback when there is no `headline`. */
  readonly name: string;
  readonly headline?: string;
  readonly accentPhrase?: string;
  readonly leadLine?: string;
  readonly intro?: string;
  readonly price?: string;
  readonly need?: QuickNeed;
  /**
   * Labels for the hero's capability strip — the same marquee the
   * landing hero carries (`CapabilityStrip`), with this route's own
   * block names in it (decision-log **#30**, owner direction
   * 2026-08-30). Read from the blocks rather than re-literalled, so a
   * rename cannot leave the strip behind.
   */
  readonly strip: readonly string[];
  readonly blocks: readonly ServicePageBlock[];
  readonly offer?: {
    readonly included: readonly string[];
    readonly monthlyCovers: readonly string[];
  };
}
