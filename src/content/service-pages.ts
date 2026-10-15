import { PRICING, PRICING_TIERS } from "@/content/pricing";
import { PRICES, SERVICE_NEED, SERVICES } from "@/content/services";
import type {
  ServicePageBlock,
  ServicePageContent,
  ServicePageSlug,
  ServiceSlug,
} from "@/lib/types";

/**
 * The two service routes' content — decision-log **#30** (the routes),
 * reshaped by **#53** (2026-10-15): one offering per route.
 *
 * - `/services/agentic-system` is **Agentic System Integration**. Its
 *   blocks are four example jobs (#57), each saying what the agent does
 *   and what we map first, and the page lists what's included and what
 *   the monthly covers. The two depths of #29 (AI Workflow Integration,
 *   Internal Tool) retired with their blocks and anchors.
 * - `/services/product` is **AI Product Development**, one offer with
 *   three ways in: build from scratch, finish what someone started, and
 *   ongoing product team. They reuse the three existing blocks and their
 *   anchors (`#new-product`, `#product-completion`, `#product-support`),
 *   so a shared or bookmarked link still lands where it did.
 *
 * Every rendered string here is owner copy from the two-offerings brief
 * (2026-10-15), shipped verbatim; nothing is DRAFT any more. Names are
 * referenced, never copied: the eyebrows are the offerings' names, the
 * agentic block names are the offering's `examples`, the monthly list is
 * the agentic tier's, the prices are `PRICES`', and each ribbon is its
 * page's block names. A rename lands everywhere at once.
 *
 * `need` on every CTA comes from `SERVICE_NEED`, so the page, its
 * blocks, its card and its tier preselect the same need.
 *
 * No em dashes in any rendered string (decision-log #19); this doc
 * block is exempt. Titles separate with a pipe, like `PRICING.title`.
 */

/**
 * Lookups by slug. `satisfies` a mapped type over each slug union, so a
 * mis-paired key and entry fails typecheck rather than silently
 * rendering the wrong offering under the right name.
 */
const SERVICE = {
  "agentic-system": SERVICES[0],
  product: SERVICES[1],
} satisfies {
  [S in ServiceSlug]: Extract<(typeof SERVICES)[number], { slug: S }>;
};

const AGENTIC_TIER = PRICING_TIERS[0] satisfies Extract<
  (typeof PRICING_TIERS)[number],
  { slug: "workflow" }
>;

/** Labels the routes render around their lists (#57). Owner copy. */
export const SERVICE_PAGE_LABELS = {
  mapFirst: "What we map first",
  included: "What you get",
  monthlyCovers: PRICING.monthlyCoversLabel,
} as const;

const EXAMPLES = SERVICE["agentic-system"].examples;

/**
 * The four example jobs (#57), in owner order. Each block is the job's
 * name, what the agent does, and what we map first, plus a visual slot
 * (`service-block-visual.tsx`; the visuals are the next brief's).
 */
const AGENTIC_BLOCKS = [
  {
    id: "email-triage",
    name: EXAMPLES[0],
    description:
      "An agent reads every email that comes in, sorts it, drafts the replies, and flags the few you actually need to look at.",
    mapFirst:
      "How mail really flows: who handles what, which messages matter, and the replies you send over and over.",
    need: SERVICE_NEED["agentic-system"],
    included: [],
  },
  {
    id: "weekly-reporting",
    name: EXAMPLES[1],
    description:
      "An agent pulls the numbers from your tools every week and hands you the report you used to build by hand.",
    mapFirst: "Where your numbers live, and how you build the report today, by hand.",
    need: SERVICE_NEED["agentic-system"],
    included: [],
  },
  {
    id: "quoting-and-intake",
    name: EXAMPLES[2],
    description:
      "A request comes in. An agent gathers the details, drafts the quote or fills the intake form, and routes it to the right person.",
    mapFirst:
      "Your quoting steps: what gets asked, what gets checked, and where requests stall.",
    need: SERVICE_NEED["agentic-system"],
    included: [],
  },
  {
    id: "document-and-data-entry",
    name: EXAMPLES[3],
    description:
      "An agent reads invoices, forms, and PDFs and puts the data where it belongs, so nobody is copying and pasting.",
    mapFirst:
      "Which documents come in, what you pull from them, and where it has to land.",
    need: SERVICE_NEED["agentic-system"],
    included: [],
  },
] as const satisfies readonly ServicePageBlock[];

/**
 * The three ways into AI Product Development (#53), on the anchors the
 * retired service slugs gave them. All three preselect the one product
 * need: the quick door offers the offering, not the way in.
 */
const PRODUCT_BLOCKS = [
  {
    id: "new-product",
    name: "Build from scratch",
    description:
      "You have an idea. We map it, define the scope, and build it into a working product in production in 6 to 8 weeks, with AI agents built in where they pay off.",
    need: SERVICE_NEED.product,
    included: [
      "A mapped scope you sign off on before we build",
      "A working product in production, not a demo",
      "Everything handed over: code, accounts, deployment",
      "A team still there the week after launch",
    ],
  },
  {
    id: "product-completion",
    name: "Finish what someone started",
    description:
      "Someone got you 70% there and disappeared. We assess what was built, map where it needs to go, and get you to launch.",
    need: SERVICE_NEED.product,
    included: [
      "A written assessment of what was built and what to keep",
      "The direction checked before more money goes in",
      "The same published price as a new build",
      "Three months together, then staying on is your call",
    ],
  },
  {
    id: "product-support",
    name: "Ongoing product team",
    description:
      "The product is live. Now it needs to grow. After the first three months, your monthly becomes your ongoing product team: new features, AI improvements, and upkeep.",
    need: SERVICE_NEED.product,
    included: [
      "A team that covers growth, not just uptime",
      "Work agreed with you each month, never billed by the hour",
      "The product maintained, monitored and kept current",
      "Whatever comes next, built by the people who built it",
    ],
  },
] as const satisfies readonly ServicePageBlock[];

/**
 * The two pages, keyed by route slug, agentic first (#53). Total over
 * `ServicePageSlug`, so a third route cannot be added without content.
 */
export const SERVICE_PAGES: Record<ServicePageSlug, ServicePageContent> = {
  "agentic-system": {
    slug: "agentic-system",
    /** Buyer words (#59). */
    title: "Agentic System Integration: AI Automation for Small Business | NextSketch",
    description:
      "We map how your business runs, then build AI agents into the work you already do: email, reports, quotes and data entry. Kept running and improving every month.",
    eyebrow: SERVICE["agentic-system"].name,
    name: SERVICE["agentic-system"].name,
    /**
     * The one-line promise, owner-approved 2026-08-31 (#37) and
     * unchanged by #53. Find, build, stay: the process in one breath.
     */
    headline: "We find where agents pay off, build them in, and stay.",
    accentPhrase: "stay",
    leadLine: "AI automation for the work you already do.",
    /**
     * Problem, approach, honesty (#37), rewritten around the map (#55):
     * we map how the work runs before building anything.
     */
    intro:
      "Most teams guessing at AI buy the wrong tools and stall in pilots that never ship. We map how your work really runs first, then build agents into the exact steps where they pay off. If the map shows nothing worth building, we'll tell you.",
    price: `${PRICES["agentic-system"].upfront} upfront, then ${PRICES["agentic-system"].monthly} a month. The monthly is required for the first three months, optional after.`,
    strip: AGENTIC_BLOCKS.map((block) => block.name),
    need: SERVICE_NEED["agentic-system"],
    blocks: AGENTIC_BLOCKS,
    offer: {
      included: [
        "A map of how the work runs today, and where agents pay off",
        "Claude or OpenAI agents built into the tools you already use",
        "Everyday work handled: emails, reports, quotes, data entry",
        "Validated in production, on your real work",
      ],
      /** The agentic tier's list, word for word, so it is read from there. */
      monthlyCovers: AGENTIC_TIER.monthlyCovers,
    },
  },
  product: {
    slug: "product",
    /** Buyer words (#59). */
    title: "AI Product Development: New Software With AI Built In | NextSketch",
    description:
      "New software products with AI agents built in, live in 6 to 8 weeks, or finished after someone else stalled. Then we stay on as your product team.",
    eyebrow: SERVICE.product.name,
    name: SERVICE.product.name,
    /** Owner copy (#53), closing the h1 owed since #30. */
    headline: "We build products with agents inside, take them live, and stay.",
    accentPhrase: "stay",
    leadLine: "New software with AI agents built in.",
    intro:
      "Three ways in, one way of working. Start from an idea, finish a product someone else got 70% of the way, or keep a live product growing. We map the business first, build it correctly, and stay on as your product team.",
    price: `${PRICES.product.upfront} upfront, then ${PRICES.product.monthly} a month. The monthly covers the build for the first three months. After that it's your ongoing product team.`,
    strip: PRODUCT_BLOCKS.map((block) => block.name),
    /**
     * One offering now, so the hero and close preselect it too. Under
     * #30 they preselected nothing, because three services shared the
     * page and picking one would have guessed.
     */
    need: SERVICE_NEED.product,
    blocks: PRODUCT_BLOCKS,
  },
};
