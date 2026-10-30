import type {
  Level,
  LevelNumber,
  PricingTierSlug,
  ServiceSlug,
} from "@/lib/types";

/**
 * The five levels of AI in business — decision-log **#69** (owner call,
 * 2026-10-29 and 2026-10-30). The source for every level string is the
 * owner's "NextSketch Messaging: The 5 Levels of AI" (2026-10-29),
 * transcribed in `docs/five-levels-messaging.md`, and Rule 4.1 points
 * at it.
 *
 * - `name`, `line` and `examples` are the doc's words, verbatim.
 * - `means` is **builder DRAFT**, written from the doc's "How to tell
 *   them apart", and awaits Nate's yes.
 *
 * Levels 2 and 3 are Agentic System Integration, Levels 4 and 5 are AI
 * Product Development, and Level 1 is not sold: it is where most
 * businesses stop. Each level keeps one colour (`level-1` to `level-5`,
 * #67) and one shape (`LevelMark`) everywhere it appears.
 */
export const LEVELS = [
  {
    level: 1,
    name: "Chatting with AI",
    line: "You ask, it answers. You do the rest.",
    means:
      "Someone on your team asks, every time. Nothing happens until a person presses go.",
    examples: "Drafts, questions, summaries in ChatGPT or Claude",
    offer: null,
  },
  {
    level: 2,
    name: "AI automations",
    line: "Runs on a schedule. Nobody has to start it.",
    means:
      "Nobody has to ask. It runs on a timer, and a person approves what it did.",
    examples: "Morning inbox sort, weekly report, follow-ups",
    offer: "agentic-system",
  },
  {
    level: 3,
    name: "Integrating AI into your systems",
    line: "Reads and updates the tools you already use.",
    means:
      "It changes things inside your own tools (CRM, calendar, files, accounting), not just the text it writes.",
    examples: "Quotes and intake, data entry, CRM updates",
    offer: "agentic-system",
  },
  {
    level: 4,
    name: "Internal tools",
    line: "Software you own, with always-on agents.",
    means:
      "Software your business owns, running in the cloud even when nobody is at a desk.",
    examples: "Your own dashboard, 24/7 agents, phone and chat",
    offer: "product",
  },
  {
    level: 5,
    name: "Custom agentic systems",
    line: "Software your team and clients use.",
    means: "Your whole team uses it, and so do your own clients.",
    examples: "Client portals, full apps, agent teams",
    offer: "product",
  },
] as const satisfies readonly Level[];

/** One level by its number. */
export function levelOf(level: LevelNumber): Level {
  return LEVELS[level - 1];
}

/** The levels each offering covers, in order (#69). Level 1 is in neither. */
export const OFFER_LEVELS: Record<ServiceSlug, readonly LevelNumber[]> = {
  "agentic-system": [2, 3],
  product: [4, 5],
};

/** "Levels 2 and 3": how a covered range is said everywhere. Builder DRAFT. */
export function levelsLabel(offer: ServiceSlug): string {
  const [first, second] = OFFER_LEVELS[offer];
  return `Levels ${first} and ${second}`;
}

/** Labels shared by every surface that shows a level. Builder DRAFT. */
export const LEVEL_WORDS = {
  level: "Level",
  means: "What it means",
  examples: "Examples",
} as const;

/**
 * The levels band in Services (#69), above the two cards. The eyebrow,
 * headline and subline are the doc's approved post headline and
 * subline, verbatim; "Not sold" and "We start here" are builder DRAFT
 * (the doc's table says "Not sold", and its visual note marks where the
 * work starts). "Where most businesses stop" is the doc's own line for
 * Level 1.
 */
export const LEVELS_BAND = {
  eyebrow: "The 5 levels of AI in business",
  headline: "Where does your business sit?",
  subline: "Most businesses stop at Level 1. We help you climb.",
  notSold: "Not sold",
  stop: "Where most businesses stop",
  start: "We start here",
  /** The band's accessible name for the Level 1 group. */
  stopGroup: "Level 1, not sold: where most businesses stop",
} as const;

/**
 * The section each service route gains after its hero (#69): which
 * levels the page covers and what each means. Builder DRAFT, all of it.
 * The product page's intro names internal tools as part of what it
 * builds (#72).
 */
export const SERVICE_LEVELS: Record<
  ServiceSlug,
  { readonly headline: string; readonly accentPhrase: string; readonly intro: string }
> = {
  "agentic-system": {
    headline: "Agentic System Integration covers Levels 2 and 3.",
    accentPhrase: "Levels 2 and 3",
    intro:
      "Most businesses stop at Level 1, chatting with AI. We take you further: first work that runs on its own schedule, then agents that work inside the tools you already use.",
  },
  product: {
    headline: "AI Product Development covers Levels 4 and 5.",
    accentPhrase: "Levels 4 and 5",
    intro:
      "Past automations, the next step is software you own. We build internal tools with always-on agents, and custom agentic systems your team and your clients use.",
  },
};

/** The eyebrow over that section. The doc's approved headline, verbatim. */
export const SERVICE_LEVELS_EYEBROW = LEVELS_BAND.eyebrow;

/**
 * The line each `/pricing` tier gains under its name (#69), so the
 * price says what it buys in level terms. Builder DRAFT. The product
 * tier's names internal tools (#72).
 */
export const PRICING_LEVELS: Record<PricingTierSlug, string> = {
  workflow:
    "Covers Levels 2 and 3: AI automations and integrating AI into your systems.",
  custom: "Covers Levels 4 and 5: internal tools and custom agentic systems.",
};
