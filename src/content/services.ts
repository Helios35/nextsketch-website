import type { ProjectType } from "@/lib/schema";
import type { Service, ServiceSlug } from "@/lib/types";

/**
 * The four canonical services — names, slugs, and accent pairs per
 * docs/06-taxonomy.md §1; descriptions verbatim from Messaging Kit §05.
 */

/** Section eyebrow — DRAFT pending owner approval (Redesign Unit 02). */
export const SERVICES_EYEBROW = "What we build";

export const SERVICES_HEADLINE =
  "Software products and agentic systems — built for how your business actually works.";

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
    name: "New Products from Scratch",
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
    name: "Agentic Systems Integration",
    description:
      "Your product or operations need intelligence built in. We assess where agents create real value and build them in — not because it's trendy, but because it solves the problem.",
    accent: "lavender",
  },
  {
    slug: "partnership",
    name: "Ongoing Product Partnership",
    description:
      "The product is live. Now it needs to grow. We stay on retainer to evolve it, maintain it, and build what comes next.",
    accent: "sage",
  },
] as const satisfies readonly Service[];
