import { ROUTES, sectionHref } from "@/lib/types";
import type { AccentName, ProcessPhase } from "@/lib/types";

/**
 * Canonical site copy — Messaging Kit §05 (Rule 4.1: edits are owner
 * decisions, logged). Every user-facing string on the site lives in
 * src/content/*.ts; components never hardcode copy.
 */

export const SITE = {
  name: "NextSketch",
  legalName: "Next Sketch LLC",
  email: "hello@nextsketch.com",
  /**
   * Meta copy drafted per PRD N4 (software product development
   * positioning) — not in Messaging Kit §05; pending owner approval,
   * see briefs/build-notes/01-foundation.md.
   */
  title: "NextSketch — Software Products from Idea to Production",
  description:
    "NextSketch builds software products and agentic systems from idea to production — and stays. A product development partner for founders and small-to-medium businesses.",
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
   * de-emphasized ghost variant rather than the hero's white advance
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
 * briefs/build-notes/02-page-shell.md.
 */
export const NOT_FOUND = {
  eyebrow: "404",
  headline: "This page doesn't exist.",
  body: "NextSketch lives on a single page now — everything you're looking for is there.",
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
 * - headline: decision-log #18 (2026-08-24), superseding Messaging Kit
 *   §05 Hero Option A ("From idea to production. And we stay."), which
 *   architecture row 2 had recorded as locked. Rule 4.1 no longer
 *   traces the hero to §05 — do not "correct" this back to Option A.
 * - accentWords: the two payoff words rendered in the gold brand accent;
 *   "stay" moved to "partner" with the headline, since the old word no
 *   longer appears and an unmatched word renders un-accented, which
 *   would have left the hero with one gold word instead of two;
 *   matched against `headline` punctuation-insensitively (if the headline
 *   changes, an unmatched word simply renders un-accented).
 * - supportingLine: Messaging Kit §03 Message 4 (The Relationship), verbatim.
 * - capabilities: the four canonical services (Taxonomy §1, exact casing),
 *   shown as the slow capability strip sanctioned in UX spec §Motion inventory
 *   — no invented numbers or social proof (Brand Philosophy §10, Rule 4.3).
 * - cta: the Rule 3.1 primary; opens the qualification modal.
 *
 * backgroundVideo/backgroundPoster are config, not copy — the
 * owner-supplied hero orbit footage (self-hosted, Redesign Unit 03),
 * closing the owner-owed background-asset swap that replaced the
 * interim Unsplash placeholder (build-note 08, Open item). The poster
 * is the clip's first frame — the reduced-motion / no-JS fallback.
 */
export const LANDING = {
  wordmark: SITE.name,
  headline: "From idea to production. Gain a real partner.",
  accentWords: ["production", "partner"],
  supportingLine:
    "You're not hiring a vendor. You're gaining a product partner.",
  capabilities: [
    "New Products from Scratch",
    "Rescue & Completion",
    "Agentic Systems Integration",
    "Ongoing Product Partnership",
  ],
  cta: "Start a Conversation",
  /** Accessible name for the decorative capability strip. */
  capabilitiesLabel: "What we build",
  backgroundVideo: "/hero-orbit.mp4",
  backgroundPoster: "/hero-orbit-poster.jpg",
} as const;

export const MANIFESTO = {
  /**
   * Section eyebrow — mono micro-label above the headline (Redesign
   * Unit 02). DRAFT in brand voice pending owner approval, as are the
   * other section eyebrows added this unit.
   */
  eyebrow: "The problem",
  headline:
    "Most firms build what you ask for. We help you figure out what you actually need.",
  body: [
    "Most software projects fail for the same reasons: the idea wasn't validated before building started, the firm handed off at launch and disappeared, or nobody understood the business well enough to build the right thing.",
    "We fix all three. We validate first. We build through a proven workflow. We don't leave when launch happens. We're a partner, not a vendor.",
  ],
} as const;

export const PROCESS = {
  /** Section eyebrow — DRAFT pending owner approval (Redesign Unit 02). */
  eyebrow: "How we work",
  headline: "Strategy. Build. Validate. Stay.",
  /**
   * Aside shown with the Validate phase. Originally the handwritten
   * margin annotation of the retired sketch system; the redesign
   * (Unit 02) reinterprets the same DRAFT text as the design system's
   * gold-italic aside — the one sanctioned italic. Still pending
   * owner approval.
   */
  annotation: "this is the part most firms skip",
  phases: [
    {
      order: "01",
      slug: "strategy",
      name: "Strategy",
      description:
        "We get into your business. Understand what you're trying to build. Validate the idea. Define exactly what needs to be built and why. No wasted effort — we move into build with clarity.",
      accent: "gold",
    },
    {
      order: "02",
      slug: "build",
      name: "Build",
      description:
        "We execute through our proven internal workflow using AI-accelerated development. Fast, clean, and built correctly the first time.",
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
      slug: "partner",
      name: "Partner",
      description:
        "We stay. Retainer-based. We evolve the product, manage what was built, and tackle what comes next — as long as the relationship is active.",
      accent: "sage",
    },
  ] as const satisfies readonly ProcessPhase[],
} as const;

/*
 * Selected-work (#work) copy moved to src/content/work.ts when the
 * section went live (decision-log #16, 2026-08-24) — it carries a
 * structured item inventory now, which is the src/content/services.ts
 * precedent for a section outgrowing this file. The retired
 * placeholder-tile strings went with the paper-era grid.
 */

/**
 * About (#about) copy — the solo "about me" (architecture row 7:
 * "New copy, voice per Brand Philosophy §8"). Not in Messaging Kit §05.
 *
 * `body` is owner-authored verbatim (2026-08-24), replacing the DRAFT
 * that had been written from documented positioning alone. It is now
 * real biography rather than restated brand copy, which is the point:
 * the section's job is authority, and the earlier text could only
 * assert the same claims the rest of the page already made.
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
  /**
   * Accessible description of the owner-supplied portrait
   * (public/placeholders/placeholder-about-01.jpg, delivered
   * 2026-07-06). DRAFT pending owner approval.
   */
  portraitAlt: "Nathan, the person behind NextSketch",
  headline: "NextSketch is one person. On purpose.",
  body: [
    "I'm Nathan. I started in industrial design, drawing and prototyping physical products that had to survive tooling, cost, and a real person's hands. That training stuck. It taught me to design inside constraints instead of pretending they aren't there, and that nothing counts until it ships and someone uses it.",
    "Digital was the same job with faster feedback. Agents were the next step: systems that do the work, not just display it. Different material, same discipline.",
    "When you work with NextSketch, you work with me. The person who learns your business, makes the build decisions, and answers for the result. No account layer, no handoff between departments, nothing lost in translation.",
    "NextSketch runs agent-native. The same embedded agents and AI-accelerated workflow I build for clients run this business every day. It's how one person ships what used to take a team. I eat my own cooking.",
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
  body: "Start with a conversation. We'll understand what you're trying to build, where you are, and whether NextSketch is the right partner. No pitch. No pressure. Just an honest assessment.",
  cta: "Start a Conversation",
} as const;

/** Accent assignment sanity surface for downstream units (Taxonomy §2). */
export const PROCESS_ACCENTS: Record<
  (typeof PROCESS.phases)[number]["slug"],
  AccentName
> = {
  strategy: "gold",
  build: "lavender",
  validate: "rose",
  partner: "sage",
};
