import type { AccentName, ProcessPhase, SectionId } from "@/lib/types";

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
    "NextSketch builds software products and agentic systems from idea to production — and stays. Book a free consultation today. A product development partner for founders and small-to-medium businesses.",
} as const;

export const NAV = {
  items: [
    { id: "process", label: "Process" },
    { id: "work", label: "Work" },
    { id: "services", label: "Services" },
    { id: "about", label: "About" },
    { id: "faq", label: "FAQ" },
  ] as const satisfies readonly { id: SectionId; label: string }[],
  cta: "Start a Conversation",
} as const;

export const HERO = {
  /** Headline Option A — locked in docs/03-site-architecture.md. */
  headline: "From idea to production. And we stay.",
  subheadline:
    "NextSketch takes software ideas from concept to production — and stays with you. We figure out what needs to be built, build it correctly, validate it works, and partner with you through what comes next. No handoff. No fluff. A real partner.",
  cta: "Start a Conversation",
} as const;

export const MANIFESTO = {
  headline:
    "Most firms build what you ask for. We help you figure out what you actually need.",
  body: [
    "Most software projects fail for the same reasons: the idea wasn't validated before building started, the firm handed off at launch and disappeared, or nobody understood the business well enough to build the right thing.",
    "We fix all three. We validate first. We build through a proven workflow. We don't leave when launch happens. We're a partner, not a vendor.",
  ],
} as const;

export const PROCESS = {
  headline: "Strategy. Build. Validate. Stay.",
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

export const FIT = {
  headline: "Built for founders and business owners who are ready to move.",
  body: [
    "We work with founders and small-to-medium businesses that have a real idea worth building or a half-built product worth finishing. You don't need to be technical. You need to have clarity on the problem and the authority to move.",
    "If you're still exploring whether AI or software applies to your business — we're probably not the right fit yet. Come back when you're ready to build.",
  ],
} as const;

export const FINAL_CTA = {
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
