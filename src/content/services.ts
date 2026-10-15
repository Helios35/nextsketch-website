import type { QuickNeed } from "@/content/modal";
import { serviceRoute } from "@/lib/types";
import type { Service, ServiceSlug } from "@/lib/types";

/**
 * The two offerings — decision-log **#53** (2026-10-15). Agentic System
 * Integration leads; AI Product Development follows. Names, slugs and
 * payload values per docs/06-taxonomy.md §1. Every rendered string here
 * is owner copy from the two-offerings brief (2026-10-15), shipped
 * verbatim.
 *
 * **What retired.** The four services of #27 (New Product, Product
 * Completion, Product Support, Agentic System) and the two agentic
 * depths of #29 (AI Workflow Integration, Internal Tool) leave every
 * surface a visitor can read. Product Completion and Product Support
 * fold into AI Product Development as ways in, and keep their blocks
 * and anchors on `/services/product`. Internal Tool comes off the site
 * because NextSketch is building an installable product of its own:
 * the waitlist band below is where it shows.
 *
 * **What did not move.** Routes, the `/services/product` anchors and
 * the stored payload values (`new_product`, `rescue`, `agentic`,
 * `partnership`): no lead data migrates and no old link 404s. An
 * offering's slug is its page's slug (`agentic-system`, `product`), so a
 * display name no longer mirrors its slug word for word.
 *
 * Decision-log #19 (no em dashes in rendered site copy) binds every
 * string here; the doc blocks are exempt.
 */

/**
 * Section eyebrow. Drafted in Redesign Unit 02; the two-offerings brief
 * (2026-10-15) carries it as owner copy, so it is no longer DRAFT.
 */
export const SERVICES_EYEBROW = "What we build";

/** Owner copy, 2026-10-15 (#53). Supersedes the #19 headline. */
export const SERVICES_HEADLINE =
  "Agentic systems and AI products, built for how your business actually works.";

/**
 * The headline's coral payoff phrase (docs/04-ux-spec.md §Typography),
 * matched against `SERVICES_HEADLINE` verbatim. Edit the two together.
 * Moved here from services-section.tsx (build-note 34).
 */
export const SERVICES_ACCENT_PHRASE = "actually works";

/**
 * Per-card CTA (owner direction 2026-08-04): opens the qualification
 * modal with that card's offering preselected. Owner first asked for
 * the generic read-on phrasing that Rule 3.2 bans by name (the gate
 * scans this directory, so it is not repeated here); owner picked this
 * replacement from the Rule 3.1 required set. It is the set member
 * unused elsewhere, so it does not dilute the hero's primary CTA.
 */
export const SERVICES_CTA = "Build With Us";

/**
 * The published figures, once (#53, #56). The home cards ("a month"),
 * the service routes ("upfront, then … a month") and `/pricing` ("per
 * month") word them differently, so each composes its own string from
 * these rather than repeating a figure that could then drift: a price
 * change is one edit here.
 */
export const PRICES = {
  "agentic-system": { upfront: "$3,998", monthly: "$2,998" },
  product: { upfront: "$12,000", monthly: "$10,000" },
} as const satisfies Record<ServiceSlug, { upfront: string; monthly: string }>;

/**
 * Offering slug -> the quick-door need its CTAs preselect.
 *
 * Typed to `QuickNeed`, the door's own options, so a card, tier or
 * block can never preselect a value the door does not show. Every CTA
 * on `/services/product` reads the `product` entry: Build from scratch,
 * Finish what someone started and Ongoing product team are three ways
 * into one offering, and the door offers that offering once. Display
 * slugs are kebab-case (§8) and payload values snake_case (§3), so the
 * mapping stays spelled out.
 */
export const SERVICE_NEED: Record<ServiceSlug, QuickNeed> = {
  "agentic-system": "agentic",
  product: "new_product",
};

/**
 * Offering slug -> the route its card opens (decision-log **#30**,
 * corrected 2026-08-30): **every card opens its route at the top**, on
 * the hero. Since #53 an offering's slug is its page's slug, so this is
 * `serviceRoute` applied to each; it stays a total map over
 * `ServiceSlug`, so a new offering without a destination fails
 * typecheck instead of shipping a card that goes nowhere.
 *
 * The block anchors still work for a shared or bookmarked link, and
 * `serviceBlockHref` remains the only typo-proof way to build one.
 */
export const SERVICE_PAGE_HREF: Record<ServiceSlug, string> = {
  "agentic-system": serviceRoute("agentic-system"),
  product: serviceRoute("product"),
};

/**
 * The two cards, in owner order (#53). `examples` is the agentic
 * page's four example jobs (#57): the card previews their names and
 * the page's blocks and ribbon read them from here.
 */
export const SERVICES = [
  {
    slug: "agentic-system",
    name: "Agentic System Integration",
    subtitle: "AI automation for the work you already do",
    description:
      "We plug AI agents into the work your team already does (emails, reports, moving tasks along) and keep them running and improving every month.",
    price: [
      `${PRICES["agentic-system"].upfront} upfront`,
      `${PRICES["agentic-system"].monthly} a month`,
    ],
    examples: [
      "Email triage",
      "Weekly reporting",
      "Quoting and intake",
      "Document and data entry",
    ],
  },
  {
    slug: "product",
    name: "AI Product Development",
    subtitle: "New software with AI agents built in",
    description:
      "We build your product from scratch in 6 to 8 weeks, or finish one someone else started, with AI agents built in, and we stay on as your product team.",
    price: [
      `${PRICES.product.upfront} upfront`,
      `${PRICES.product.monthly} a month`,
    ],
  },
] as const satisfies readonly Service[];

/**
 * The waitlist band inside Services, under the cards (decision-log
 * **#58**). Owner copy, 2026-10-15. The product it names is the
 * installable tool that took Internal Tool's place (#53).
 *
 * "Join the Waitlist" is a **non-conversion carve-out from Rule 3.1**,
 * the way the off-ramp's "Stay in Touch" is: it asks for interest in a
 * product that does not exist yet, so a conversion CTA would promise
 * the wrong thing. The capture runs through the modal's seam, guards
 * and failure fallback (Rules 2.4, 2.7, 2.8) and carries its own signal
 * label, `[Waitlist]`. There is no auto-reply: the on-page confirmation
 * is the whole acknowledgement.
 */
export const SERVICES_WAITLIST = {
  eyebrow: "Coming soon",
  line: "An AI tool you install in your business. Join the waitlist and we'll tell you when it's ready.",
  fieldLabel: "Your email",
  submit: "Join the Waitlist",
  success: "You're on the list. We'll email you when it's ready.",
} as const;
