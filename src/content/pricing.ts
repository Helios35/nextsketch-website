/**
 * Pricing page (`/pricing`) copy — decision-log #23 (2026-08-25).
 *
 * Pricing ships as a **standalone route, not a section**. Decision #16
 * named it "the next section in this effort"; the owner's 2026-08-24
 * instruction supersedes that with a nav item plus a separate page. A
 * static route is not a backend, so decision #8 is untouched: the site
 * still has exactly one server-side surface, `/api/qualify`.
 *
 * **Unit 22 ships the room, not the furniture.** The page is
 * layout-final and deliberately carries no prices, no tiers and no
 * feature bullets — those are owner-settled and land in Unit 23
 * (Rule 4.3: nothing invented, ever). Nothing here should be read as
 * a placeholder *for* a number; there are no numbers to placeholder.
 *
 * Every string below is DRAFT in brand voice pending owner approval —
 * the same posture as every other section eyebrow and headline on the
 * site (Rule 4.4). The headline states the Brand Philosophy §6
 * position (published pricing, no hourly, no surprise invoices)
 * without asserting a single figure the page cannot yet show, and the
 * body says plainly that the detail is coming rather than dressing an
 * empty page as finished.
 *
 * No em dashes in any of it (decision-log #19). That also drives the
 * `title` separator: `SITE.title` uses an em dash, but it is canonical
 * copy approved under decision #3 and predates #19 — a new string does
 * not get to inherit the exception, so this one uses a pipe. The
 * mismatch between the two titles is flagged for the owner, not
 * resolved here by editing approved copy.
 */
export const PRICING = {
  /** Browser tab and search-result title for the route. */
  title: "Pricing | NextSketch",
  description:
    "Pricing for NextSketch product engagements and the ongoing product partnership, published in plain numbers.",
  /** Mono micro-label above the heading (docs/04-ux-spec.md §Typography). */
  eyebrow: "Pricing",
  headline: "We publish what we charge.",
  body: "The full breakdown is being finalized and lands on this page shortly: what an engagement costs to start, what the ongoing partnership costs, and what is included in both. Plain numbers, on the page, before you talk to anyone.",
} as const;
