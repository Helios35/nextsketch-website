import type { ProjectType } from "@/lib/schema";
import type { PricingTier, PricingTierSlug } from "@/lib/types";

/**
 * Pricing page (`/pricing`) copy — decision-log #23 (the route),
 * **#25** (the tier structure, the term, and the naming) and **#27**
 * (two tiers renamed onto the site's one service vocabulary).
 *
 * Pricing ships as a **standalone route, not a section**. Decision #16
 * named it "the next section in this effort"; the owner's 2026-08-24
 * instruction supersedes that with a nav item plus a separate page. A
 * static route is not a backend, so decision #8 is untouched: the page
 * prerenders to static HTML, **sells nothing directly, and takes no
 * payment**. It qualifies. `/api/qualify` remains the entire
 * server-side footprint.
 *
 * Structure traces to Brand Philosophy §6, which is the authority here:
 * "a defined upfront build, then a lighter ongoing partnership."
 * Scoped, never hourly, so the client "knows exactly what they're
 * paying and what they're getting. No surprise invoices." The intro
 * below is that principle in the site's voice, not a new claim.
 *
 * **The term is said out loud, on every card and once above the grid.**
 * $298 per month, required for the first three months, optional after
 * (owner call, 2026-08-25, reducing an initial twelve). A price that
 * hides a commitment is exactly the surprise invoice §6 rejects, so it
 * is not tucked into a footnote.
 *
 * **Product Completion carries no required term at all** — a two month
 * trial with no contractual obligation (owner call, same date). It is
 * the tier whose visitor has already been burned by one firm, so asking
 * them to commit before seeing anything works is the wrong ask. The
 * page-level term names the exception rather than stating a blanket
 * commitment its own cards contradict.
 *
 * Naming: the first tier is **"AI Workflow Integration"** (owner call,
 * 2026-08-25). The owner's working name for it ended in the word Rule
 * 3.2 bans and Brand Philosophy §8 calls out by name ("we build agentic
 * systems, not the other thing"), so the working name would have failed
 * the build on sight. Rule 3.3's sanctioned vocabulary is "embedded
 * agents" and "agentic systems", which is what the tier copy uses.
 *
 * This comment deliberately does not spell that word out. The gate
 * scans this file's raw text, comments included, so a bare occurrence
 * here fails the build even while explaining why it is banned — which
 * is the `copy.ts` precedent, and the rule demonstrating itself. It
 * caught exactly this on the first build of this file.
 *
 * No em dashes in any rendered string (decision-log #19); the doc
 * blocks in this file are exempt. `title` separates with a pipe rather
 * than the em dash `SITE.title` uses — that one is canonical copy
 * approved under #3 and predates #19, and a new string does not
 * inherit the exception.
 */
export const PRICING = {
  /** Browser tab and search-result title for the route. */
  title: "Pricing | NextSketch",
  description:
    "Scoped upfront engagements and a $298 monthly product partnership, published in plain numbers. No hourly billing and no surprise invoices.",
  /** Mono micro-label above the heading (docs/04-ux-spec.md §Typography). */
  eyebrow: "Pricing",
  headline: "NextSketch puts the price upfront.",
  /**
   * Brand Philosophy §6 in the site's voice. "No meter running during
   * meetings" and "no surprise invoices" are §6 verbatim.
   */
  intro:
    "Every engagement has two parts: a scoped upfront build, then a monthly partnership that keeps the product alive. You know both numbers before you commit. No hourly billing, no meter running during meetings, no surprise invoices.",
  /**
   * The commitment, stated plainly and before the cards. Owner-settled
   * (#25). This is the sentence the brief exists to protect.
   */
  term:
    "The $298 monthly partnership is required for the first three months. After that it is optional, and staying on is your call. Product Completion is the exception: it starts as a two month trial with no contractual obligation.",
  /**
   * Accessible name for the tier grid (screen-reader only). The grid is
   * a landmark region with no visible heading of its own — the page's
   * <h1> already names it — so it needs one that is not the eyebrow.
   */
  tiersHeading: "Pricing tiers",
  /** Mono micro-labels inside each card. */
  upfrontLabel: "Upfront",
  /**
   * Screen-reader prefix for the struck former price. The strikethrough
   * is a purely visual signal, so without this a non-sighted visitor
   * hears two prices with nothing to tell them which one they pay.
   */
  upfrontWasLabel: "Down from",
  ongoingLabel: "Ongoing",
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
 * Tier slug -> the canonical project type its CTA preselects in the
 * modal's "What do you need?" selector. The `SERVICE_NEED` precedent in
 * `src/content/services.ts`, applied to the tiers.
 *
 * **Two entries were wrong and are corrected here (decision-log #29,
 * 2026-08-28).** `tool` preselected `new_product` and `custom`
 * preselected `partnership`, so a visitor clicked a tier and landed on
 * an option that did not match it. This is a shipped bug fixed, not a
 * change of mind — and the paragraph that stood here previously argued
 * the `custom` mapping was deliberate and told the reader not to
 * correct it, which is what kept it alive. Decision-log #25 records the
 * old mapping as as-built only and never ratified that reasoning.
 *
 * **The top two tiers share `agentic` on purpose.** They differ in
 * depth, not category: AI Workflow Integration is agents and custom
 * tools dropped into processes the business already runs, at workflow
 * level with no product wrapped around them; Internal Tool is a full
 * product with a real interface and agents behind it, something the
 * client owns and their team logs into. The modal asks a visitor what
 * they need, not how deep they want to go — the depth is what the two
 * price points express. Positioning language, so it lives in Taxonomy
 * §1 as well as here.
 *
 * Still spelled out rather than derived: display slugs are kebab-case
 * (§8), payload values snake_case (§3), and two tiers legitimately
 * share one type. Typed as a total map over PricingTierSlug, so a new
 * tier without a need fails typecheck rather than shipping a button
 * that preselects nothing.
 *
 * **The tier slugs are not renamed with the names** (#27 scope).
 * `custom` now carries "New Product" and `rescue` carries "Product
 * Completion", so both are fossils of retired names. Recorded rather
 * than resolved: renaming them is a separate owner call.
 */
export const PRICING_NEED: Record<PricingTierSlug, ProjectType> = {
  workflow: "agentic",
  tool: "agentic",
  rescue: "rescue",
  custom: "new_product",
};

/**
 * Per-tier CTA labels, both from the Rule 3.1 exhaustive set.
 *
 * "Qualify Your Project" carries the three scoped tiers and "Let's See
 * if We're a Fit" carries the quoted New Product tier (`custom`). Both
 * were the set's two unused members, so neither dilutes the hero's
 * primary ("Start a Conversation") or the services cards' ("Build With
 * Us") — the same reasoning `SERVICES_CTA` used when it picked its
 * label.
 *
 * That tier needed the different label because its scope is not
 * defined yet: "Qualify Your Project" presumes a project to qualify,
 * and §6 permits a quote only where "scope genuinely requires it".
 * The owner's shorthand for this CTA was "call", and every natural
 * phrasing of that is a Rule 3.2 banned term, so nothing here is
 * invented — both strings come straight out of the sanctioned set.
 */
export const PRICING_CTA = "Qualify Your Project";
export const PRICING_CTA_CUSTOM = "Let's See if We're a Fit";

/**
 * The four tiers, in owner-settled order (#25). **"Save Your Project"
 * and "Custom Product" were renamed to Product Completion and New
 * Product by #27**, onto the same four names the cards, the hero strip
 * and the modal now use. Nothing else about these entries moved: not a
 * price, not a struck former price, not a description, not a note, not
 * the order, not the empty `features` arrays.
 *
 * Descriptions for the last two tiers trace to Brand Philosophy §4
 * ("What We Build"), reworded only to fit the card measure and to drop
 * §4's em dashes (#19). A rename is not permission to reword canonical
 * copy (Rule 4.1), and none of it is reworded here. **Flagged for the
 * owner:** the New Product tier's description still opens "Scope that
 * does not fit the tiers above", which read naturally under the name
 * "Custom Product" and reads less naturally under this one. Left alone
 * deliberately; that is a copy decision, not a naming one.
 *
 * The first two are **owner-authored scope** (2026-08-25) and
 * deliberately diverge from §4, because §4's service lines are broader
 * than these tiers: "AI Workflow Integration" is strictly agents
 * integrated into existing business processes, not the customer-facing
 * half of §4's Agentic Systems Integration; and "Internal Tool"
 * (renamed from "AI Tool", same call) is a platform the client owns and
 * runs internally, not §4's New Products from Scratch. §4 is the
 * authority on voice here, not on scope.
 *
 * The workflow tier's copy says "embedded agents", never the phrase
 * Brand Philosophy §12 and Taxonomy §9 retired for exactly this idea.
 * The tier *name* keeps the word Workflow because that is the owner's
 * settled commercial name; the retired phrase is the two-word one, and
 * it does not appear.
 *
 * **`features` is empty on every tier, deliberately.** The bullets are
 * drafted and posted for owner approval; until that lands, each card
 * renders no list rather than an invented one (Rule 4.3, and the
 * brief's explicit "draft them, then stop"). The component already
 * lays out the list, so approved bullets drop straight in here and
 * nowhere else.
 */
export const PRICING_TIERS = [
  {
    slug: "workflow",
    name: "AI Workflow Integration",
    /**
     * Owner-directed reframe, 2026-08-31 (decision-log #36): this tier
     * is agentic work that needs **no custom tool**. Claude or OpenAI,
     * integrated into what already runs. The custom-tool depth is the
     * `tool` tier below; the two descriptions carry that split.
     */
    description:
      "Claude or OpenAI agents integrated into the work your business already does: checking emails, running reports, moving tasks along. No custom tool to build, nothing new to babysit.",
    upfront: "$3,998",
    upfrontWas: "$5,000",
    upfrontNote: "Scoped upfront. Strategy, build and validation.",
    ongoing: "$298 per month",
    ongoingNote: "Required the first three months, optional after.",
    features: [],
  },
  {
    slug: "tool",
    name: "Internal Tool",
    /**
     * Owner-directed reframe, 2026-08-31 (decision-log #36): this tier
     * always means a **custom tool**, with custom agents where the job
     * demands them. "Agent crews" is the deliberate nod to the
     * CrewAI/LlamaIndex class of build without naming a vendor.
     */
    description:
      "A custom tool built for your specific business processes, from a dashboard Claude plugs into to purpose-built agent crews. A real tool that you own, built around how your team actually works.",
    upfront: "$7,998",
    upfrontWas: "$10,000",
    upfrontNote: "Scoped upfront. Strategy, build and validation.",
    ongoing: "$298 per month",
    ongoingNote: "Required the first three months, optional after.",
    features: [],
  },
  {
    slug: "rescue",
    name: "Product Completion",
    description:
      "Someone got you 70% there and disappeared. We assess what was built, validate the direction, and get you to launch.",
    upfront: "Quoted",
    upfrontNote: "The partnership starts on day one instead.",
    ongoing: "$298 per month",
    ongoingNote: "Two month trial. No contractual obligation.",
    features: [],
  },
  {
    slug: "custom",
    name: "New Product",
    description:
      "Scope that does not fit the tiers above. We define it with you first, then price it to the deliverable, so you get a flat rate that does not change. We deliver a working product in 6–8 weeks.",
    upfront: "Quoted",
    upfrontNote: "Priced once the scope is defined with you.",
    ongoing: "Quoted monthly",
    ongoingNote: "Scoped to what the product needs.",
    features: [],
  },
] as const satisfies readonly PricingTier[];
