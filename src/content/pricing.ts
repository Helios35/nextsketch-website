import { PRICES, SERVICE_NEED, SERVICES } from "@/content/services";
import type { QuickNeed } from "@/content/modal";
import type { PricingTier, PricingTierSlug, ServiceSlug } from "@/lib/types";

/**
 * Pricing page (`/pricing`) copy — decision-log #23 (the route),
 * **#25** (the tier structure, the term, and the naming), **#45** (the
 * 2026-09-25 price reset), **#56** (2026-10-15: two tiers, one per
 * offering, each listing what's included), **#75** (2026-11-04: the
 * product's build rate, and a two-month minimum on both offers) and
 * **#77** (2026-11-13: one monthly rate per offer while we work, two
 * months minimum, nothing upfront; the client owns what we built, and
 * ongoing work is priced separately, with no figure).
 *
 * Pricing ships as a **standalone route, not a section**. A static
 * route is not a backend, so decision #8 is untouched: the page
 * prerenders to static HTML, **sells nothing directly, and takes no
 * payment**. It qualifies. `/api/qualify` remains the entire
 * server-side footprint.
 *
 * Brand Philosophy §6 framed the offer as "a defined upfront build,
 * then a lighter ongoing partnership." Since #77 neither offer has an
 * upfront price or a set ongoing rate: each is one monthly rate while we
 * work, and what comes after is priced when it comes up (buyers compare
 * a monthly with no end to the software bill they pay today). Still
 * scoped, never hourly, so the client "knows exactly what they're paying
 * and what they're getting. No surprise invoices."
 *
 * **The term is said out loud, on every card and once above the grid.**
 * The monthly runs for two months at least on both tiers (#75, down from
 * the three of #25 and #45), and stops when the work is done (#77). A
 * price that hides a commitment is exactly the surprise invoice §6
 * rejects, so it is not tucked into a footnote. The page-level `term`
 * names no figure because the monthly differs by tier.
 *
 * **Two tiers since #56**, one per offering (#53): Agentic System
 * Integration and AI Product Development. Internal Tool retired from
 * the site, and the struck former prices retired with it (their label
 * and field are gone too): a discount that never expires stopped
 * reading as one. Every figure is read from `PRICES` in
 * `src/content/services.ts`, the one place a price lives. The two lines
 * the #77 brief gave word for word (the agentic description and
 * `ongoingWork`) are owner copy; every other line #77 changed or wrote
 * is DRAFT, and build-note 46 lists them for Nate's yes.
 *
 * No em dashes in any rendered string (decision-log #19); the doc
 * blocks in this file are exempt. `title` separates with a pipe.
 */
export const PRICING = {
  /** Browser tab and search-result title for the route (#59). */
  title: "Pricing: AI Automation and AI Product Development | NextSketch",
  /** DRAFT (#77): one monthly rate per offer, nothing upfront. */
  description:
    "Published prices for AI automation and AI product development. One monthly rate while we work, two months minimum, nothing upfront. No hourly billing, no surprise invoices.",
  /** Mono micro-label above the heading (docs/04-ux-spec.md §Typography). */
  eyebrow: "Pricing",
  /**
   * Left as it was (an open owner item, #75 call 4 and the #77 brief):
   * "upfront" means the price is out in the open, beside two cards that
   * now both say "nothing upfront".
   */
  headline: "NextSketch puts the price upfront.",
  /**
   * The headline's coral payoff word (docs/04-ux-spec.md §Typography),
   * matched against `headline` verbatim. Moved here from
   * pricing/page.tsx (build-note 34).
   */
  accentPhrase: "upfront",
  /**
   * Brand Philosophy §6 in the site's voice, rewritten for one monthly
   * rate per offer (#77, DRAFT). "No meter running during meetings" and
   * "no surprise invoices" are §6 verbatim. The ownership clause is the
   * #77 brief's short version, which says it of both offers.
   */
  intro:
    "Both offers are one monthly rate while we work, with two months minimum and nothing upfront. When the work is done, you own what we built, and anything after that is priced when it comes up. No hourly billing, no meter running during meetings, no surprise invoices.",
  /**
   * The commitment, stated plainly and before the cards. Owner-settled
   * (#25), two months since #75, and since #77 it says the monthly ends
   * with the work, so nothing reads as a plan that carries on (DRAFT
   * wording). It names no figure because the monthly differs by tier.
   */
  term: "Both offers bill monthly while we work, two months minimum. When the work is done, the monthly stops.",
  /**
   * Accessible name for the tier grid (screen-reader only). The grid is
   * a landmark region with no visible heading of its own — the page's
   * <h1> already names it — so it needs one that is not the eyebrow.
   */
  tiersHeading: "Pricing tiers",
  /** Mono micro-labels over each card's price (#77). DRAFT. */
  workLabel: "While we work",
  buildLabel: "While we build",
  /** What a tier's price is per (#75; both tiers since #77). */
  perMonth: "per month",
  /** Mono micro-label over each card's second band (#77). DRAFT. */
  afterLabel: "After the build",
  /**
   * Owner copy, word for word (#77, Nate, 2026-11-13). On both cards, and
   * under the agentic route's "After the build" list. No figure and no
   * "starting at", anywhere.
   */
  ongoingWork: "Ongoing work is priced separately.",
  featuresLabel: "Included",
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
 * **One price each since #77:** the monthly while we work, two months
 * minimum, nothing upfront, and its caption saying what the months
 * cover. Then the "After the build" band, which carries no figure: the
 * product tier's ownership line, then `PRICING.ongoingWork` on both.
 * `features` is the one list left, "Included", and it says what the paid
 * months deliver. The agentic tier's "What the monthly covers" list and
 * the product tier's "What support covers" list are gone: both described
 * work after the build, which is now priced separately. The agentic
 * route keeps its four lines as its own "After the build" list
 * (`src/content/service-pages.ts`).
 *
 * A project someone else started still takes the product card: the
 * monthly covers assessing what's already built, which is what keeps
 * "the same published price as a new build" true.
 */
export const PRICING_TIERS = [
  {
    slug: "workflow",
    name: SERVICES[0].name,
    /** Owner copy, word for word (#77, Nate, 2026-11-13). */
    description:
      "We start with your AI strategy. We map your systems, your processes and how work actually moves through your business, then build agents into the places they save the most time.",
    headlinePriceLabel: PRICING.workLabel,
    headlinePrice: PRICES["agentic-system"].monthly,
    headlinePriceUnit: PRICING.perMonth,
    /** DRAFT (#77). */
    headlinePriceNote:
      "Nothing upfront, two months minimum. Covers the strategy, the process mapping, the build and validation.",
    /** The first line is DRAFT (#77); the other three are #56's. */
    features: [
      "Your AI strategy, and where agents save the most time",
      "A map of how the work runs today",
      "Agents built into the tools you already use",
      "Validated on your real work",
    ],
  },
  {
    slug: "custom",
    name: SERVICES[1].name,
    description:
      "New software with AI agents built in. Two starting points, one price: a new product built from scratch and live in 6 to 8 weeks, or a product someone got 70% of the way there before disappearing.",
    headlinePriceLabel: PRICING.buildLabel,
    headlinePrice: PRICES.product.monthly,
    headlinePriceUnit: PRICING.perMonth,
    /** DRAFT (#77): #75's build caption, from "Nothing upfront". */
    headlinePriceNote:
      "Nothing upfront, two months minimum, which lines up with the 6 to 8 week build. Includes process mapping and discovery, and on a project someone else started, assessing what's already built.",
    /** DRAFT (#77). */
    ownership: "You own what we built.",
    features: [
      "A mapped scope you sign off on",
      "A working product in production in 6 to 8 weeks",
      "Everything handed over: code, accounts, deployment",
    ],
  },
] as const satisfies readonly PricingTier[];
