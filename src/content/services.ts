import type { ProjectType } from "@/lib/schema";
import type { Service, ServiceSlug } from "@/lib/types";

/**
 * The four canonical services — slugs and accent pairs per
 * docs/06-taxonomy.md §1; descriptions from Messaging Kit §05.
 *
 * Decision-log #19 (2026-08-24) — no em dashes in rendered site copy,
 * a standing rule. It rewrote the section headline and replaced the one
 * em dash inside the `agentic` description with a comma. Both are edits
 * to canonical §05 copy, so Rule 4.1 now traces the headline to #19
 * rather than to the Kit; the four descriptions are otherwise §05 as
 * written. Em dashes remain in the doc blocks here — developer notes,
 * not site copy, and explicitly exempt under #19. The rule is not
 * enforced mechanically: adding an em-dash scan to the banned-terms
 * gate is an open owner call.
 *
 * Names shortened to the card forms (owner decision 2026-08-04) so
 * each card heading holds one line at every breakpoint — the long
 * forms wrapped to two lines in the four-column layout. This is a
 * deliberate divergence from Taxonomy §1, which still records the long
 * forms as CURRENT, and from LANDING.capabilities in copy.ts, where
 * the hero strip keeps the long forms (a marquee has the room, and the
 * owner scoped this change to the cards). Both are owner calls to
 * reconcile — flagged, not silently resolved.
 */

/** Section eyebrow — DRAFT pending owner approval (Redesign Unit 02). */
export const SERVICES_EYEBROW = "What we build";

export const SERVICES_HEADLINE =
  "Products and agentic systems, built for how your business actually works.";

/**
 * Per-card CTA (owner direction 2026-08-04): opens the qualification
 * modal with that card's service preselected. Owner first asked for
 * the generic read-on phrasing that Rule 3.2 bans by name (the gate
 * scans this directory, so it is not repeated here); owner picked this
 * replacement from the Rule 3.1 required set. It is the set member
 * unused elsewhere, so it does not dilute the hero's primary CTA.
 */
export const SERVICES_CTA = "Build With Us";

/**
 * Service slug -> the canonical project type its CTA preselects in the
 * quick door's "What do you need?" selector. The two vocabularies are
 * near-identical but not interchangeable ("new-product" vs
 * "new_product"), and Taxonomy §3 names `partnership` where the modal
 * shows "Product support" — so the mapping is spelled out rather than
 * derived from the slug. Typed as a total map over ServiceSlug: a new
 * service without a need fails typecheck instead of shipping a CTA
 * that preselects nothing.
 */
export const SERVICE_NEED: Record<ServiceSlug, ProjectType> = {
  "new-product": "new_product",
  rescue: "rescue",
  agentic: "agentic",
  partnership: "partnership",
};

export const SERVICES = [
  {
    slug: "new-product",
    name: "New Product",
    description:
      "You have an idea. We validate it, define the scope, and build it into a working product in production.",
    accent: "gold",
  },
  {
    slug: "rescue",
    name: "Rescue & Completion",
    description:
      "Someone got you 70% there and disappeared. We assess what was built, validate the direction, and get you to launch.",
    accent: "rose",
  },
  {
    slug: "agentic",
    name: "Agentic Systems",
    description:
      "Your product or operations need intelligence built in. We assess where agents create real value and build them in, not because it's trendy, but because it solves the problem.",
    accent: "lavender",
  },
  {
    slug: "partnership",
    name: "Ongoing Partnership",
    description:
      "The product is live. Now it needs to grow. We stay on retainer to evolve it, maintain it, and build what comes next.",
    accent: "sage",
  },
] as const satisfies readonly Service[];
