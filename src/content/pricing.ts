import { PRICES, SERVICE_NEED, SERVICES } from "@/content/services";
import type { QuickNeed } from "@/content/modal";
import type { PricingTier, PricingTierSlug, ServiceSlug } from "@/lib/types";

/**
 * Pricing page (`/pricing`) copy — decision-log #23 (the route),
 * **#25** (the tier structure, the term, and the naming), **#45** (the
 * 2026-09-25 price reset), **#56** (2026-10-15: two tiers, one per
 * offering, each listing what's included and what the monthly covers)
 * and **#75** (2026-11-04: the product in three parts, and a two-month
 * minimum on both offers).
 *
 * Pricing ships as a **standalone route, not a section**. A static
 * route is not a backend, so decision #8 is untouched: the page
 * prerenders to static HTML, **sells nothing directly, and takes no
 * payment**. It qualifies. `/api/qualify` remains the entire
 * server-side footprint.
 *
 * Structure traces to Brand Philosophy §6: "a defined upfront build,
 * then a lighter ongoing partnership." Since #75 the product's build is
 * itself monthly, so its upfront figure is a setup, and the lighter rate
 * is support. Scoped, never hourly, so the client "knows exactly what
 * they're paying and what they're getting. No surprise invoices."
 *
 * **The term is said out loud, on every card and once above the grid.**
 * The monthly is required for the first two months on both tiers (#75,
 * down from the three of #25 and #45). A price that hides a commitment
 * is exactly the surprise invoice §6 rejects, so it is not tucked into a
 * footnote. The page-level `term` names no figure because the monthly
 * differs by tier.
 *
 * **Two tiers since #56**, one per offering (#53): Agentic System
 * Integration and AI Product Development. Internal Tool retired from
 * the site, and the struck former prices retired with it (their label
 * and field are gone too): a discount that never expires stopped
 * reading as one. Every figure is read from `PRICES` in `src/content/services.ts`,
 * the one place a price lives. The copy in this file is owner copy from
 * the two-offerings brief (2026-10-15), shipped verbatim, except the
 * lines marked DRAFT below, which build-note 44 lists for Nate's yes.
 *
 * No em dashes in any rendered string (decision-log #19); the doc
 * blocks in this file are exempt. `title` separates with a pipe.
 */
export const PRICING = {
  /** Browser tab and search-result title for the route (#59). */
  title: "Pricing: AI Automation and AI Product Development | NextSketch",
  /** DRAFT (#75): the product's build is no longer upfront. */
  description:
    "Published prices for AI automation and AI product development: a scoped upfront price, then a monthly rate. No hourly billing, no surprise invoices.",
  /** Mono micro-label above the heading (docs/04-ux-spec.md §Typography). */
  eyebrow: "Pricing",
  headline: "NextSketch puts the price upfront.",
  /**
   * The headline's coral payoff word (docs/04-ux-spec.md §Typography),
   * matched against `headline` verbatim. Moved here from
   * pricing/page.tsx (build-note 34).
   */
  accentPhrase: "upfront",
  /**
   * Brand Philosophy §6 in the site's voice, rewritten for the monthly
   * fee (#56) and for the product's two monthly rates (#75, DRAFT). "No
   * meter running during meetings" and "no surprise invoices" are §6
   * verbatim.
   */
  intro:
    "Every engagement starts with a scoped upfront price, then a monthly rate. AI Product Development has two: a build rate while we build and a lower support rate after launch. You know every number before you commit. No hourly billing, no meter running during meetings, no surprise invoices.",
  /**
   * The commitment, stated plainly and before the cards. Owner-settled
   * (#25), two months since #75 (DRAFT wording). It names no figure
   * because the monthly differs by tier.
   */
  term:
    "The monthly is required for the first two months on both offers. After that, staying on is your call.",
  /**
   * Accessible name for the tier grid (screen-reader only). The grid is
   * a landmark region with no visible heading of its own — the page's
   * <h1> already names it — so it needs one that is not the eyebrow.
   */
  tiersHeading: "Pricing tiers",
  /** Mono micro-labels inside each card. */
  upfrontLabel: "Upfront",
  ongoingLabel: "Ongoing",
  /** The product tier's three parts (#75). DRAFT. */
  setupLabel: "Setup",
  buildLabel: "Build",
  supportLabel: "Support",
  featuresLabel: "Included",
  /** The second list's label (#56). Also heads the agentic page's list. */
  monthlyCoversLabel: "What the monthly covers",
  /** The product tier's second list (#75). DRAFT. */
  supportCoversLabel: "What support covers",
  /**
   * Closing line under the grid. Says the page sells nothing directly,
   * which is decision #8 showing through to the visitor rather than
   * being an internal-only constraint.
   */
  footnote:
    "Nothing is bought on this page. Every button opens the same short qualifier so we can see the shape of the work before either of us commits.",
} as const;

/**
 * Tier slug -> the quick-door need its CTA preselects. The offerings'
 * own `SERVICE_NEED`, read through each tier's offering, so a tier and
 * the card for the same offering can never preselect different needs
 * (#29 was exactly that bug). Typed to `QuickNeed`, the door's own
 * options.
 *
 * **The tier slugs are not renamed** (#53: slugs unchanged). `workflow`
 * carries Agentic System Integration and `custom` carries AI Product
 * Development, both fossils of retired tier names, recorded rather than
 * resolved.
 */
export const PRICING_NEED: Record<PricingTierSlug, QuickNeed> = {
  workflow: SERVICE_NEED["agentic-system"],
  custom: SERVICE_NEED.product,
};

/**
 * Tier slug -> the offering it sells, which is what the tier's offer
 * tab reads (#67), so a tier carries the same colour as its offering's
 * card and route. The same pairing `PRICING_NEED` spells out above.
 */
export const PRICING_OFFER: Record<PricingTierSlug, ServiceSlug> = {
  workflow: "agentic-system",
  custom: "product",
};

/**
 * Per-tier CTA labels, both from the Rule 3.1 exhaustive set and both
 * unchanged by #56. "Qualify Your Project" carries the agentic tier and
 * "Let's See if We're a Fit" carries AI Product Development (`custom`).
 * Neither dilutes the hero's primary ("Start a Conversation") or the
 * services cards' ("Build With Us").
 */
export const PRICING_CTA = "Qualify Your Project";
export const PRICING_CTA_CUSTOM = "Let's See if We're a Fit";

/**
 * The two tiers, in owner order (#56): agentic first, like everything
 * else since #53. Names are the offerings' (`SERVICES`), so a rename
 * cannot leave a tier behind; figures are `PRICES`'.
 *
 * `features` is the "Included" list and `monthlyCovers` the list under
 * `coversLabel`. Together they close the long-open "tier feature bullets"
 * item and the "what the monthly buys" one.
 *
 * **The product tier is setup, build and support (#75).** Build runs two
 * months minimum, support starts after launch and adds no new features,
 * and new features later mean the build rate for those months, then back
 * to support. Its list is the head of the after-launch list in Nate's
 * Strata proposal, led by tuning; the product route carries the rest
 * (`src/content/service-pages.ts`). A project someone else started takes
 * this same card: its setup covers assessing what's already built, which
 * is what keeps "the same published price as a new build" true. Every
 * line new to this tier is DRAFT.
 */
export const PRICING_TIERS = [
  {
    slug: "workflow",
    name: SERVICES[0].name,
    description:
      "AI automation for the work you already do. We map how your team works, then plug Claude or OpenAI agents into it: email triage, weekly reports, quotes and intake, data entry. No custom tool to build, nothing new to babysit.",
    upfrontLabel: PRICING.upfrontLabel,
    upfront: PRICES["agentic-system"].upfront,
    upfrontNote: "Scoped upfront. Process mapping, build and validation.",
    ongoingLabel: PRICING.ongoingLabel,
    ongoing: `${PRICES["agentic-system"].monthly} per month`,
    ongoingNote: "Required the first two months, optional after.",
    features: [
      "A map of how the work runs today",
      "Agents built into the tools you already use",
      "Validated on your real work",
    ],
    coversLabel: PRICING.monthlyCoversLabel,
    monthlyCovers: [
      "Watching what's running, so problems get caught early",
      "Fixes when your tools or data change",
      "Tuning the agents so they keep getting better",
      "Mapping the next step worth handing to an agent",
    ],
  },
  {
    slug: "custom",
    name: SERVICES[1].name,
    description:
      "New software with AI agents built in. Two starting points, one price: a new product built from scratch and live in 6 to 8 weeks, or a product someone got 70% of the way there before disappearing.",
    upfrontLabel: PRICING.setupLabel,
    upfront: PRICES.product.upfront,
    upfrontNote:
      "One time. Includes process mapping and discovery. On a project someone else started, it also covers assessing what's already built.",
    ongoingLabel: PRICING.buildLabel,
    ongoing: `${PRICES.product.monthly} per month`,
    ongoingNote:
      "While we build. Two months minimum, which lines up with the 6 to 8 week build.",
    support: {
      label: PRICING.supportLabel,
      figure: `${PRICES.product.support} per month`,
      note: "Starts after launch, and staying on is your call. Covers tuning and keeping things running, but no new features. New features later go back to the build rate for those months, then back to support.",
    },
    features: [
      "A mapped scope you sign off on",
      "A working product in production in 6 to 8 weeks",
      "Everything handed over: code, accounts, deployment",
    ],
    coversLabel: PRICING.supportCoversLabel,
    monthlyCovers: [
      "Tuning the agents so they keep getting better",
      "Bug fixes and monitoring",
      "Security patches and updates",
      "Upkeep when outside tools change",
    ],
  },
] as const satisfies readonly PricingTier[];
