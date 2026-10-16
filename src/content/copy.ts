import { SERVICES } from "@/content/services";
import { ROUTES, sectionHref } from "@/lib/types";
import type {
  AccentName,
  ProcessPhase,
  ProcessPhaseSlug,
  TeamMember,
} from "@/lib/types";

/**
 * Canonical site copy — Messaging Kit §05 (Rule 4.1: edits are owner
 * decisions, logged). Every user-facing string on the site lives in
 * src/content/*.ts; components never hardcode copy. Since the
 * two-offerings brief (2026-10-15, #53 to #59) much of what the home
 * page says traces to those rows rather than to §05; Rule 4.1 lists
 * which.
 */

export const SITE = {
  name: "NextSketch",
  legalName: "Next Sketch LLC",
  email: "hello@nextsketch.com",
  /**
   * The site's search title and description, rewritten in the words
   * buyers search for (decision-log #59, owner copy 2026-10-15). They
   * replace the 2026-06 drafts approved under #3, which predated #19
   * and carried its em dashes.
   */
  title: "NextSketch | Agentic Systems and AI Automation for Small Business",
  description:
    "We map how your business runs, then build AI agents into the work and keep them improving. AI automation and AI product development, based in Downers Grove, IL.",
} as const;

/**
 * Pricing, held as one object so the bar button and the menu row are
 * literally the same item rather than two strings that can drift
 * (decision-log #26). It appears twice on screen and once in source.
 */
const PRICING_ITEM = { href: ROUTES.pricing, label: "Pricing" } as const;

export const NAV = {
  /** Accessible name of the main nav landmark. */
  label: "Main",
  /**
   * The single item promoted to a button in the bar, beside the burger
   * (owner direction, 2026-08-25). Today that is Pricing: it is the one
   * destination that leaves the page, and the one a visitor goes
   * looking for on purpose, so it earns a surface of its own instead of
   * being one row down inside the menu.
   *
   * This **supersedes the 2026-07-06 "no CTA in the nav" direction**,
   * narrowly. That call was about conversion — the hero CTA and #start
   * carry it, and a third conversion button was redundant. This is
   * navigation to a page, not a conversion affordance, so it takes the
   * de-emphasized ghost variant rather than the hero's stone advance
   * surface, and the nav still has no conversion CTA.
   *
   * It stays in `items` as well, so the menu keeps its Pricing row.
   */
  featured: PRICING_ITEM,
  /**
   * Where both wordmarks point. Root-relative, so the lockup reaches
   * the top of the home page from `/pricing` too — a bare `#top`
   * there resolves to `/pricing#top`, which is nothing.
   */
  home: sectionHref("top"),
  /**
   * The menu items, in page order (decision-log #13; anchors per
   * Redesign Unit 02 brief). #start is reached via the CTA and the
   * footer, not a nav item. The "Why" label is DRAFT copy pending
   * owner approval (the held sections' old items are gone with them).
   *
   * #work leads (decision-log #16 / #21, 2026-08-24): the proof band
   * ships as the first section under the hero, so it also takes the
   * first slot — a visitor who came for evidence should be one click
   * from it, which is the whole reason the section exists. Shipped as
   * the builder's judgment call in PR #27 and **ratified as the
   * owner's decision** by #21, so it is not a call to quietly reverse.
   *
   * Pricing takes the last slot (decision-log #24, 2026-08-25). It is
   * the only item that leaves the page, and the one a visitor looks
   * for on purpose, so it reads as the end of the list rather than an
   * interruption in the middle of the page order.
   *
   * Items carry a finished `href`, not a `SectionId` the components
   * derive a hash from (decision-log #23). A route has no section id,
   * so the old shape could not express Pricing at all — and the
   * derived `#${id}` broke every other item the moment a second route
   * existed. `sectionHref` keeps the anchors typo-proof: the literal
   * survives, so a bad id still fails typecheck.
   */
  items: [
    { href: sectionHref("work"), label: "Work" },
    { href: sectionHref("why"), label: "Why" },
    { href: sectionHref("services"), label: "Services" },
    { href: sectionHref("process"), label: "Process" },
    { href: sectionHref("about"), label: "About" },
    PRICING_ITEM,
  ] as const satisfies readonly { href: string; label: string }[],
  cta: "Start a Conversation",
  /** Menu toggle labels (screen-reader copy). */
  menu: {
    open: "Open menu",
    close: "Close menu",
  },
} as const;

/**
 * Footer-only strings. Social platform set narrowed to the two
 * accounts that carry real content (owner call 2026-07-27,
 * superseding docs/decision-log.md #4) — X/Twitter and Instagram are
 * held back until there is content to link to. Both hrefs are the
 * owner's real profiles, closing the URLs-owed launch-readiness item.
 */
export const FOOTER = {
  /** Accessible name of the footer nav landmark. */
  label: "Footer",
  socials: [
    { label: "LinkedIn", href: "https://www.linkedin.com/in/nathan-ivy" },
    { label: "Behance", href: "https://www.behance.net/nateivy" },
  ],
} as const;

/**
 * 404 copy — not in Messaging Kit §05; drafted in brand voice
 * (Brand Philosophy §8) — DRAFT pending owner approval, see
 * briefs/build-notes/02-page-shell.md. `body` is owner copy (#59,
 * 2026-10-15): the old line said the site was one page, which stopped
 * being true with `/pricing` (#23).
 */
export const NOT_FOUND = {
  eyebrow: "404",
  headline: "This page doesn't exist.",
  body: "That page isn't here. Head back to see what we build.",
  cta: "Go to the page",
} as const;

export const HERO = {
  /**
   * Messaging Kit §05 Hero Option A. **Superseded** by decision-log
   * #18 (2026-08-24) and retained here only because this whole `HERO`
   * const is dormant — the live hero reads `LANDING.headline`. Kept,
   * not deleted, per the log's convention for superseded material.
   */
  headline: "From idea to production. And we stay.",
  subheadline:
    "NextSketch takes software ideas from concept to production — and stays with you. We figure out what needs to be built, build it correctly, validate it works, and partner with you through what comes next. No handoff. No fluff. A real partner.",
  cta: "Start a Conversation",
  /**
   * Stat strip ships with placeholder numbers per docs/decision-log.md
   * #5 — visually real, numerically obviously unfinal. Real numbers
   * are owner-owed before launch. Labels are DRAFT copy (brand voice,
   * not Messaging Kit) pending owner approval — see
   * briefs/build-notes/03-sections-story.md.
   */
  stats: [
    { value: "00", label: "Products in production" },
    { value: "00+", label: "Ideas validated first" },
    { value: "00%", label: "Partners who stayed" },
    { value: "00", label: "Handoffs after launch" },
  ],
} as const;

/**
 * Landing hero (single-page site) — the dark cinematic re-skin of the
 * supplied template, mapped to NextSketch messaging. Every string here
 * traces to an approved source:
 * - headline: owner-supplied, verbatim (decision-log #51, 2026-10-14),
 *   superseding #18's "From idea to production. Gain a real partner.",
 *   which itself superseded Messaging Kit §05 Hero Option A ("From idea
 *   to production. And we stay."). Rule 4.1 no longer traces the hero
 *   to §05: do not "correct" this back to either earlier line.
 * - accentWords: the payoff rendered in the coral brand accent (#47).
 *   It moved with the headline (#51) to the headline's closing promise,
 *   "work in production", as one coral phrase: the old pair also sat at
 *   the end ("production" / "partner"). Kept at the end on purpose:
 *   coral holds 4.5:1 over the footage only inside the hero scrim's
 *   solid band, which the bottom lines sit in at every width; a coral
 *   word higher up (measured: "agentic") drops to 3.5:1 on some frames.
 *   Each entry is matched as a whole word against `headline`,
 *   punctuation-insensitively, so "in" colours only that one word; if
 *   the headline changes, an unmatched word simply renders un-accented.
 * - supportingLine: owner-supplied, verbatim (#51, 2026-10-14). It
 *   replaced a builder draft ("Not a demo, not a pilot…") the same day,
 *   which had replaced Messaging Kit §03 Message 4 (The Relationship).
 * - audienceLine: owner copy (#58, 2026-10-15), who the site is for. It
 *   sits under the supporting line, which is where it fit: the brief
 *   allowed it into the hero only if the hero still fit at 1024x768,
 *   and the right column is shorter than the headline column there, so
 *   it adds no height (build-note 36 has the measurements).
 * - capabilities: the two offerings (Taxonomy §1, exact casing, #53),
 *   shown as the slow capability strip sanctioned in UX spec §Motion
 *   inventory — no invented numbers or social proof (Brand Philosophy
 *   §10, Rule 4.3). **Read from `SERVICES`**, so the strip, the cards
 *   and `/pricing` cannot disagree, which is the one-vocabulary rule of
 *   #27/#28 carried onto the two names. The Messaging Kit (outside this
 *   repo) still carries older names: **do not "correct" these to it.**
 * - cta: the Rule 3.1 primary; opens the qualification modal.
 *
 * backgroundVideo/backgroundPoster are config, not copy — the
 * owner-supplied hero loop (self-hosted in /public, as the footage it
 * replaced was; decision-log #46, 2026-10-05), shipped exactly as
 * delivered. The poster is the clip's first frame — painted at once,
 * and the reduced-motion / no-JS view.
 */
export const LANDING = {
  wordmark: SITE.name,
  headline:
    "We build agentic systems and digital products that work in production",
  accentWords: ["work", "in", "production"],
  supportingLine:
    "Software your business runs on that we maintain",
  audienceLine:
    "For small and medium businesses that want AI doing real work, not another demo.",
  capabilities: SERVICES.map((service) => service.name),
  cta: "Start a Conversation",
  /** Accessible name for the decorative capability strip. */
  capabilitiesLabel: "What we build",
  backgroundVideo: "/hero-loop.mp4",
  backgroundPoster: "/hero-loop-poster.jpg",
} as const;

/**
 * Why (#why) — process mapping (decision-log **#55**, owner-approved
 * 2026-10-15). The section keeps its slot right after Work, its `#why`
 * id and its "Why" nav label; what it argues changed. It no longer
 * traces to Messaging Kit §05: the old "most firms build what you ask
 * for" reframe is superseded by the thing that sets NextSketch apart,
 * mapping how a business really works before building anything.
 */
export const MANIFESTO = {
  /** Section eyebrow — mono micro-label above the headline. Owner copy (#55). */
  eyebrow: "Process mapping",
  headline: "Most firms drop agents in and hope. We map first.",
  /**
   * The headline's coral payoff phrase (docs/04-ux-spec.md
   * §Typography), matched against `headline` verbatim. Edit the two
   * together: a phrase that stops matching renders the headline
   * unaccented. Moved here from manifesto-section.tsx (build-note 34).
   */
  accentPhrase: "map first",
  body: [
    "We come from product and UX, so we start where good products start: how the work really happens. Using the same process maps UX teams use, we trace how a request moves from inbox to done and mark every step someone repeats by hand.",
    "That map shows where an agent saves real time and where it would just add noise. We build agents into those spots, check them against your live work, and keep tuning them every month. If the map shows nothing worth building, we'll tell you.",
  ],
} as const;

/**
 * Process — Map, Build, Validate, Optimize (decision-log **#55**, owner
 * copy 2026-10-15). Read by `/`'s Process section and by both service
 * routes' §How it works. It no longer traces to Messaging Kit §05:
 * Strategy became Map, Partner became Optimize, and Validate is
 * unchanged. Slugs follow the names (Taxonomy §2), so none is a fossil;
 * they appear in no URL and no payload.
 */
export const PROCESS = {
  /** Section eyebrow. Drafted in Redesign Unit 02; owner copy since #55. */
  eyebrow: "How we work",
  headline: "Map. Build. Validate. Optimize.",
  /**
   * The headline's coral payoff phrase, matched against `headline`
   * verbatim; the period rides along so the final beat lands as one
   * coral unit. Shared by `/`'s Process section and the service routes'
   * §How it works, so both land the same word. Moved here from those
   * two components (build-note 34).
   */
  accentPhrase: "Optimize.",
  /**
   * The aside, in the design system's coral-italic treatment (the one
   * sanctioned italic). Originally the handwritten margin note of the
   * retired sketch system. It moved from Validate to Map with #55, and
   * `annotationPhase` says where it renders so neither component
   * carries the phase as a literal.
   */
  annotation: "this is the part most firms skip",
  annotationPhase: "map" satisfies ProcessPhaseSlug,
  phases: [
    {
      order: "01",
      slug: "map",
      name: "Map",
      description:
        "We map your process, your team, and how the work really gets done. Every step someone repeats by hand gets marked. That's where agents go, and where they don't.",
      accent: "gold",
    },
    {
      order: "02",
      slug: "build",
      name: "Build",
      description:
        "We build what we mapped, with an AI-accelerated workflow. Agents go into the tools you already use, or into a new product built around them.",
      accent: "lavender",
    },
    {
      order: "03",
      slug: "validate",
      name: "Validate",
      description:
        "We confirm it works. In production. Not in a demo. Working software doing the job it was built to do.",
      accent: "rose",
    },
    {
      order: "04",
      slug: "optimize",
      name: "Optimize",
      description:
        "We stay. Every month we watch what's running, fix what breaks when your tools change, and tune the agents so they keep getting better.",
      accent: "sage",
    },
  ] as const satisfies readonly ProcessPhase[],
} as const;

/**
 * The proof band directly under the hero, above Work (decision-log
 * **#58**). Three short claims, owner copy 2026-10-15; a band, not a
 * section, so it takes no index, no heading and no nav item.
 */
export const PROOF = [
  "Live in weeks, not quarters",
  "Prices on the page",
  "We stay after launch",
] as const;

/*
 * Selected-work (#work) copy moved to src/content/work.ts when the
 * section went live (decision-log #16, 2026-08-24) — it carries a
 * structured item inventory now, which is the src/content/services.ts
 * precedent for a section outgrowing this file. The retired
 * placeholder-tile strings went with the paper-era grid.
 */

/**
 * About (#about) copy: the team you work with (decision-log #63, owner
 * copy 2026-10-15, the about-team brief's Part B verbatim). Not in
 * Messaging Kit §05. It was the solo "about me" until #63: NextSketch
 * is a small team now, so no line here says or implies one person.
 *
 * `team` is the list the section maps (Nate and Julie for now). Adding
 * a person is a row here plus their clip and poster under
 * `/public/team/` (`TeamMember`, src/lib/types.ts); the component does
 * not change. `video` and `poster` are asset paths (config, not copy),
 * kept beside the person they show, as `LANDING.backgroundVideo` is.
 *
 * `body` paragraphs 1 and 2 are owner-authored verbatim (2026-08-24)
 * and unchanged by #63: Nathan's own story, in his voice, which is why
 * they stay in the first person. Paragraphs 3 and 4 moved to "we" with
 * #63. The 2026-08-24 text replaced a DRAFT written from documented
 * positioning alone; it is real biography rather than restated brand
 * copy, which is the point: the section's job is authority.
 *
 * Rule 3.4 exemption — decision-log #20 (2026-08-24). The first
 * paragraph names the retired physical-design discipline that the
 * retired-brand sweep bans by name (docs/05-business-rules.md §3.4,
 * enforced by scripts/check-banned-terms.mjs). That ban stops the
 * retired *service line* reappearing as a current offer; here the
 * phrase is biography — where Nathan trained, not what NextSketch
 * sells. §3.4 now records that distinction, and the gate carries one
 * exemption scoped to this file and asserted to appear exactly once:
 * the same clause in a service card still fails, and rewording this
 * paragraph fails too rather than leaving a bypass open. See the
 * ALLOWED list in scripts/check-banned-terms.mjs.
 *
 * The closing paragraph was removed at the owner's direction; where
 * its "we stay" promise lands is an open owner call (#20).
 *
 * (This comment deliberately does not spell the term out: the gate
 * scans this file, and a bare occurrence here would fail the build —
 * which is the exemption's narrowness demonstrating itself.)
 */
export const ABOUT = {
  /** Section eyebrow — DRAFT pending owner approval (Redesign Unit 02). */
  eyebrow: "Who you work with",
  headline: "A small, senior-led team. On purpose.",
  /**
   * The headline's coral payoff phrase, matched against `headline`
   * verbatim and without the trailing period, so the full stop stays
   * linen. Moved here from about-section.tsx (build-note 34).
   */
  accentPhrase: "On purpose",
  intro:
    "NextSketch is a small, senior-led team based in Downers Grove, IL. You work with the same people from the first call to launch, and after.",
  /**
   * The team, in the order the row shows them. `alt` is each avatar's
   * accessible name, owner copy like the rest; `name` and `title` show
   * beneath the avatar once it turns (decision-log #63).
   */
  team: [
    {
      id: "nate",
      name: "Nate",
      title: "Founder",
      alt: "Nate, Founder of NextSketch",
      video: "/team/nate.mp4",
      poster: "/team/nate-poster.jpg",
    },
    {
      id: "julie",
      name: "Julie",
      title: "Client Partner",
      alt: "Julie, Client Partner at NextSketch",
      video: "/team/julie.mp4",
      poster: "/team/julie-poster.jpg",
    },
  ] satisfies readonly TeamMember[],
  body: [
    "I'm Nathan. I started in industrial design, drawing and prototyping physical products that had to survive tooling, cost, and a real person's hands. That training stuck. It taught me to design inside constraints instead of pretending they aren't there, and that nothing counts until it ships and someone uses it.",
    "Digital was the same job with faster feedback. Agents were the next step: systems that do the work, not just display it. Different material, same discipline.",
    "When you work with NextSketch, you work with the people who learn your business, make the build decisions, and answer for the result. No account layer, no handoff between departments, nothing lost in translation.",
    "NextSketch runs agent-native. The same agents and AI-accelerated workflow we build for clients run this business every day. We use what we sell.",
  ],
} as const;

/**
 * Testimonials (#voices) strings — placeholder blocks until original
 * clients re-approve rewritten quotes (Rule 4.2; docs/decision-log.md
 * sprint plan Decision 7). Headline is DRAFT in brand voice;
 * placeholderLabel is the UX spec's placeholder-state text. Both
 * pending owner approval — see briefs/build-notes/04-sections-proof.md.
 */
export const TESTIMONIALS = {
  headline: "In their words",
  placeholderLabel: "Client quote — pending approval",
} as const;

/**
 * FAQ (#faq) section heading — the six Q&As themselves are canonical
 * (src/content/faq.ts, verbatim per Rule 4.1), but no heading exists
 * for the section in Messaging Kit §05 (architecture row 10 names
 * only the Q&As). Headline is DRAFT in brand voice pending owner
 * approval — see briefs/build-notes/05-sections-convert.md.
 */
export const FAQ = {
  headline: "Common questions",
} as const;

export const FIT = {
  headline: "Built for founders and business owners who are ready to move.",
  body: [
    "We work with founders and small-to-medium businesses that have a real idea worth building or a half-built product worth finishing. You don't need to be technical. You need to have clarity on the problem and the authority to move.",
    "If you're still exploring whether AI or software applies to your business — we're probably not the right fit yet. Come back when you're ready to build.",
  ],
} as const;

export const FINAL_CTA = {
  /** Section eyebrow — DRAFT pending owner approval (Redesign Unit 02). */
  eyebrow: "The next step",
  headline: "Ready to build? Let's figure out if we're the right fit.",
  /**
   * The headline's coral payoff phrase, matched against `headline`
   * verbatim. Shared by `/`'s Final CTA and the service routes' close.
   * Moved here from those two components (build-note 34).
   */
  accentPhrase: "right fit",
  body: "Start with a conversation. We'll understand what you're trying to build, where you are, and whether NextSketch is the right partner. No pitch. No pressure. Just an honest assessment.",
  cta: "Start a Conversation",
} as const;

/**
 * Accent assignment sanity surface for downstream units (Taxonomy §2).
 * Dormant dead data (build-note 34, F10): never rendered. Its keys
 * follow the phase slugs (#55) only so it keeps compiling.
 */
export const PROCESS_ACCENTS: Record<
  (typeof PROCESS.phases)[number]["slug"],
  AccentName
> = {
  map: "gold",
  build: "lavender",
  validate: "rose",
  optimize: "sage",
};
