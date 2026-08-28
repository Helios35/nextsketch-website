import { PRICING_NEED, PRICING_TIERS } from "@/content/pricing";
import { SERVICE_NEED, SERVICES } from "@/content/services";
import type { PricingTierSlug, ServicePageContent, ServicePageSlug, ServiceSlug } from "@/lib/types";

/**
 * The two service routes' content — decision-log **#30** (2026-08-28).
 *
 * **Two pages, not four.** The unit-26 brief specified four routes, one
 * per service slug. The owner reduced that to two, each covering a
 * related group, with an anchored block per topic so a card still lands
 * a visitor on the thing they clicked (owner direction, 2026-08-28):
 *
 * - `/services/product` — New Product, Product Completion, Product Support.
 * - `/services/agentic-system` — the Agentic System service, at the two
 *   depths `/pricing` sells it at (Taxonomy §1 "Two kinds of agentic
 *   system", #29): **AI Workflow Integration** and **Internal Tool**.
 *
 * **Every rendered string in this file already existed.** Nothing here
 * is written, reworded or paraphrased:
 *
 * - Block names and descriptions on `/services/product` are the four
 *   canonical services' — Taxonomy §1 names and Messaging Kit §05
 *   descriptions, read straight out of `SERVICES`. A route is not
 *   permission to reword canonical copy (Rule 4.1), so they are
 *   *referenced*, never copied: a second literal of a §05 line in a
 *   second file is a drift waiting to happen.
 * - Block names and descriptions on `/services/agentic-system` are the
 *   two tiers', read out of `PRICING_TIERS`. `/pricing` is untouched;
 *   this reads it.
 * - `need` on every block comes from `SERVICE_NEED` / `PRICING_NEED`.
 *   The brief binds this unit to the existing seam — no new mapping,
 *   no new modal entry point — so the two maps stay the only place a
 *   name is turned into a `ProjectType`.
 *
 * **What is owner-owed, and therefore absent** (Rule 4.3, and the
 * brief's "render nothing in that slot — not a placeholder heading, not
 * an empty frame"). Drafts for all of it are in
 * `briefs/build-notes/26-service-routes.md`, awaiting approval:
 *
 * - `headline` / `accentPhrase` — the one-line promise per page. Unset,
 *   so each `<h1>` falls back to `name`: canonical vocabulary, not
 *   drafted copy. This is the empty-`features` posture applied to a
 *   heading a page cannot legally render nothing for.
 * - `intro` on `/services/product` — there is no approved *group*
 *   description for three services, so that hero carries none. The
 *   agentic route's is its §05 line, which covers the whole page.
 * - `included` on all five blocks — the "what you get" bullets. Empty,
 *   so each block renders no list rather than an invented one. The
 *   component already lays the list out, so approved bullets drop in
 *   here and nowhere else, exactly like the `/pricing` tiers.
 *
 * `title` and `description` are the exception the brief names out loud:
 * "Real metadata on all four. Own title and description each, in the
 * `PRICING.title` house form. These are the first pages anyone will
 * land on from search." Both are **DRAFT pending owner approval**, on
 * the `SITE.title` precedent (drafted in brand voice, flagged, later
 * ratified as decision #3). They are the only authored strings here.
 *
 * No em dashes in any rendered string (decision-log #19); this doc
 * block is exempt. Titles separate with a pipe, matching `PRICING.title`
 * rather than `SITE.title`'s em dash, which predates #19.
 */

/**
 * Lookups by slug. `satisfies` a mapped type over each slug union, so a
 * mis-paired key and entry fails typecheck rather than silently
 * rendering the wrong service under the right name. That is not
 * paranoia: `SERVICES` is ordered New Product, Product Completion,
 * **Agentic System**, Product Support, so the array order and the page
 * order genuinely differ, and a positional read would be wrong.
 */
const SERVICE = {
  "new-product": SERVICES[0],
  "product-completion": SERVICES[1],
  "agentic-system": SERVICES[2],
  "product-support": SERVICES[3],
} satisfies {
  [S in ServiceSlug]: Extract<(typeof SERVICES)[number], { slug: S }>;
};

const TIER = {
  workflow: PRICING_TIERS[0],
  tool: PRICING_TIERS[1],
} satisfies {
  [S in Extract<PricingTierSlug, "workflow" | "tool">]: Extract<
    (typeof PRICING_TIERS)[number],
    { slug: S }
  >;
};

/**
 * Mono micro-label above each block's bullet list. Deliberately
 * `PRICING.featuresLabel`'s word rather than a second one: the owner
 * asked for the pricing card's `Included` list, and two labels for one
 * list is how the service names drifted in the first place (#27).
 */
export const SERVICE_PAGE_INCLUDED_LABEL = "Included";

/**
 * The two pages, keyed by route slug. Total over `ServicePageSlug`, so
 * a third route cannot be added without content.
 */
export const SERVICE_PAGES: Record<ServicePageSlug, ServicePageContent> = {
  product: {
    slug: "product",
    /** DRAFT pending owner approval. */
    title: "Product Development | NextSketch",
    /** DRAFT pending owner approval. */
    description:
      "New products built from an idea, half built products taken to launch, and live products kept growing. NextSketch builds software from idea to production, and stays.",
    /**
     * The page groups three services, so the eyebrow and the fallback
     * heading are the group word out of the canonical Services headline
     * ("Products and agentic systems, built for how your business
     * actually works") rather than an authored page name. The two
     * routes are that sentence's two halves.
     */
    eyebrow: "Products",
    name: "Products",
    /**
     * No `need`: three services share this page and preselecting one of
     * them would guess. The hero CTA opens the modal with nothing
     * chosen, which is what every CTA on the site except a card's does.
     * Each block below carries its own.
     */
    blocks: [
      {
        id: "new-product",
        name: SERVICE["new-product"].name,
        description: SERVICE["new-product"].description,
        need: SERVICE_NEED["new-product"],
        included: [],
      },
      {
        id: "product-completion",
        name: SERVICE["product-completion"].name,
        description: SERVICE["product-completion"].description,
        need: SERVICE_NEED["product-completion"],
        included: [],
      },
      {
        id: "product-support",
        name: SERVICE["product-support"].name,
        description: SERVICE["product-support"].description,
        need: SERVICE_NEED["product-support"],
        included: [],
      },
    ],
  },
  "agentic-system": {
    slug: "agentic-system",
    /** DRAFT pending owner approval. */
    title: "Agentic Systems | NextSketch",
    /** DRAFT pending owner approval. */
    description:
      "Embedded agents built into the processes your business already runs, or an internal tool your team logs into with agents behind it. NextSketch builds agentic systems that solve a real problem.",
    /** Taxonomy §1 casing, exact. This page is that one service. */
    eyebrow: SERVICE["agentic-system"].name,
    name: SERVICE["agentic-system"].name,
    /** Messaging Kit §05, as written. It covers the whole page. */
    intro: SERVICE["agentic-system"].description,
    need: SERVICE_NEED["agentic-system"],
    /**
     * The two depths, in `/pricing` order. Both preselect `agentic`
     * (#29): the modal asks what a visitor needs, not how deep they
     * want to go, and the depth is what the two price points express.
     */
    blocks: [
      {
        id: "ai-workflow-integration",
        name: TIER.workflow.name,
        description: TIER.workflow.description,
        need: PRICING_NEED.workflow,
        included: [],
      },
      {
        id: "internal-tool",
        name: TIER.tool.name,
        description: TIER.tool.description,
        need: PRICING_NEED.tool,
        included: [],
      },
    ],
  },
};
