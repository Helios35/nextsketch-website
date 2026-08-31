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
 * - `headline` / `accentPhrase` — the one-line promise per page. The
 *   **agentic page's landed 2026-08-31** (owner-approved, #37); the
 *   product page's is still owner-owed and unset, so its `<h1>` falls
 *   back to `name`: canonical vocabulary, not drafted copy — the
 *   empty-`features` posture applied to a heading a page cannot
 *   legally render nothing for.
 * `intro` is supplied on **both** routes and both are owner-approved:
 * the product one is the group-level description approved 2026-08-30;
 * the agentic one is bespoke as of 2026-08-31 (#37 — problem, approach,
 * honesty), no longer the §05 reference, which still renders on the
 * home card. Neither is DRAFT.
 *
 * **`included` was empty on all five blocks and is no longer.** The
 * owner asked for the "what you get" band to be built against a
 * supplied two-column reference (2026-08-28, second session), and a
 * layout with nothing in it cannot be reviewed. The bullets are the
 * ones drafted for approval in `briefs/build-notes/26-service-routes.md`
 * and are **DRAFT pending owner approval**, flagged the way every other
 * drafted string in this repo is (`NOT_FOUND`, `SERVICES_EYEBROW`,
 * `PROCESS.eyebrow`, the `work.ts` summaries). They are deliverables,
 * not adjectives, per the owner's brief, and four per column so the
 * columns balance the way the reference's do. Edit them here and
 * nowhere else; a block whose array is emptied again renders no list
 * and no frame, exactly as before.
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
     * The group-level description. **Owner-approved 2026-08-30**, so it
     * is canonical rather than DRAFT: it was drafted in build-note 26
     * against the gap Rule 4.3 had left open, posted for approval, and
     * approved verbatim bar one word — "stalled" became "has stalled",
     * because the three clauses were not parallel without it.
     *
     * Nothing in it is new positioning. "70%" is the Product Completion
     * §05 line's own figure, already rendered on this page and the home
     * page; "we validate first" and "and stay" are Rule 3.3's sanctioned
     * vocabulary. No em dash (#19).
     */
    intro:
      "Three ways in, one way of working. Whether the product does not exist yet, has stalled at 70%, or is live and needs to keep growing, we validate first, build it correctly, and stay.",
    /**
     * The hero strip: the three services this route covers, in page
     * order. Taxonomy §1 names, referenced not copied.
     */
    strip: [
      SERVICE["new-product"].name,
      SERVICE["product-completion"].name,
      SERVICE["product-support"].name,
    ],
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
        included: [
          "A validated scope you sign off on before we build",
          "A working product in production, not a demo",
          "Everything handed over: code, accounts, deployment",
          "A partner still there the week after launch",
        ],
      },
      {
        id: "product-completion",
        name: SERVICE["product-completion"].name,
        description: SERVICE["product-completion"].description,
        need: SERVICE_NEED["product-completion"],
        included: [
          "A written assessment of what was built and what to keep",
          "The direction validated before more money goes in",
          "Remaining work scoped and priced as one flat figure",
          "Two months to decide whether we stay",
        ],
      },
      {
        id: "product-support",
        name: SERVICE["product-support"].name,
        description: SERVICE["product-support"].description,
        need: SERVICE_NEED["product-support"],
        included: [
          "A retainer that covers evolution, not just uptime",
          "Monthly work agreed with you, never billed by the hour",
          "The product maintained, monitored and kept current",
          "Whatever comes next, built by the people who built it",
        ],
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
    /**
     * The one-line promise — **owner-approved 2026-08-31** (decision-log
     * #37, the avolis.ai comparison), so the `<h1>` no longer falls
     * back to the canonical name. Find, build, stay: the process in one
     * breath. The product page's promise is still owner-owed and still
     * falls back.
     */
    headline: "We find where agents pay off, build them in, and stay.",
    accentPhrase: "stay",
    /**
     * Bespoke to this page — **owner-approved 2026-08-31** (#37), no
     * longer the §05 reference (that line still renders on the home
     * card; the two slots do different jobs now). Problem, approach,
     * honesty: the failure mode named (wrong tools, pilots that never
     * ship), the assessment, and the no-pitch commitment.
     */
    intro:
      "Most teams guessing at AI buy the wrong tools and stall in pilots that never ship. We assess where agents actually pay off, then build them into the work itself. If agents will not pay off in your business, we will tell you.",
    /**
     * The hero strip: the two depths this route sells the service at
     * (Taxonomy §1 "Two kinds of agentic system", #29). Tier names,
     * referenced not copied.
     */
    strip: [TIER.workflow.name, TIER.tool.name],
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
        /**
         * Reframed with the tier split (owner direction, 2026-08-31,
         * #36): this depth needs no custom tool, so the old "custom
         * tools where an agent alone will not do the job" bullet moved
         * conceptually to the block below, where custom tools live.
         * Still DRAFT pending owner approval.
         */
        included: [
          "An assessment of where agents actually pay off in your day to day",
          "Claude or OpenAI integrations built into the tools you already use",
          "Everyday tasks handled: checking emails, running reports, moving work along",
          "Validated in production, on your real work",
        ],
      },
      {
        id: "internal-tool",
        name: TIER.tool.name,
        description: TIER.tool.description,
        need: PRICING_NEED.tool,
        /** Reframed with the tier split (#36). DRAFT pending approval. */
        included: [
          "A custom tool your team logs into, built around how they work",
          "Agents behind a real interface, not a chat window",
          "Custom agent crews where the job demands them",
          "Yours to own, with everything handed over",
        ],
      },
    ],
  },
};
