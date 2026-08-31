import type { ProjectType } from "@/lib/schema";
import { serviceRoute } from "@/lib/types";
import type { Service, ServiceSlug } from "@/lib/types";

/**
 * The four canonical services — names and slugs per
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
 * **One vocabulary, everywhere (decision-log #27, 2026-08-28.)** The
 * four names are the quick door's "What do you need?" labels: New
 * Product, Product Completion, Product Support, Agentic System. The
 * modal is the reference because it is the only surface a visitor
 * reaches after choosing, so a name it does not use is a name that
 * disappears mid-conversion — a visitor who picked "Ongoing
 * Partnership" on a card was then asked to choose "Product support".
 *
 * This closes the 2026-08-04 divergence, where the cards took short
 * forms while Taxonomy §1 and LANDING.capabilities kept long ones and
 * the split was flagged rather than resolved. All three now agree,
 * and §1 is the record.
 *
 * The slugs were renamed with the names (#27), so a slug is never a
 * fossil of a retired one. `ProjectType` in `schema.ts` is untouched:
 * the stored payload vocabulary is a contract, and this unit changes
 * only what the site calls things.
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
 * quick door's "What do you need?" selector.
 *
 * **Rekeyed, not re-derived, by the #27 rename.** Every card still
 * preselects exactly what it preselected before; only the keys moved.
 * The two vocabularies are near-identical but not interchangeable and
 * the mapping stays spelled out: display slugs are kebab-case (§8) and
 * payload values snake_case (§3), and `product-support` stores as
 * `partnership` — a stored value that predates the rename and does not
 * move with it, because the lead record is a contract.
 *
 * Typed as a total map over ServiceSlug: a new service without a need
 * fails typecheck instead of shipping a CTA that preselects nothing.
 */
export const SERVICE_NEED: Record<ServiceSlug, ProjectType> = {
  "new-product": "new_product",
  "product-completion": "rescue",
  "product-support": "partnership",
  "agentic-system": "agentic",
};

/**
 * Service slug -> the service route that card opens. Decision-log
 * **#30** (2026-08-28), **corrected 2026-08-30**.
 *
 * **Every card opens its route at the top.** The first cut sent the
 * three product cards to their block anchors, because the owner's
 * 2026-08-28 direction was that a click "goes to the sections covering
 * each topic clicked". That was built before the routes had a hero
 * worth landing on: measured from `/`, a card put the visitor at
 * scrollY 544 with the `<h1>` 199px above the fold, so the ribbon, the
 * heading, the CTAs and the graphic were all skipped on arrival. The
 * owner corrected it (2026-08-30) — **the page loads on the hero.**
 *
 * That also makes all four cards behave the same way. Only the product
 * three ever carried anchors; `agentic-system` always pointed at its
 * route root, because that page *is* that service and its two blocks
 * are depths of it — which is why the inconsistency showed up on one
 * page and not the other.
 *
 * **The block anchors are untouched and still work.** They remain real
 * `<section id>` targets, so a shared or bookmarked
 * `/services/product#product-support` still lands on that block;
 * nothing on the site generates one any more. `serviceBlockHref` stays
 * exported for exactly that reason: it is the only typo-proof,
 * root-relative way to build one, and deleting it would leave the next
 * caller hand-writing the hash this unit exists to prevent.
 *
 * Typed as a total map over ServiceSlug: a new service without a
 * destination fails typecheck instead of shipping a card that goes
 * nowhere, the same guarantee `SERVICE_NEED` gives above.
 */
export const SERVICE_PAGE_HREF: Record<ServiceSlug, string> = {
  "new-product": serviceRoute("product"),
  "product-completion": serviceRoute("product"),
  "product-support": serviceRoute("product"),
  "agentic-system": serviceRoute("agentic-system"),
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
    slug: "product-completion",
    name: "Product Completion",
    description:
      "Someone got you 70% there and disappeared. We assess what was built, validate the direction, and get you to launch.",
    accent: "rose",
  },
  {
    slug: "agentic-system",
    name: "Agentic System",
    /**
     * Owner-approved 2026-08-31 (decision-log #37, the avolis.ai
     * comparison): "actually pay off" replaces "create real value" —
     * the economic verb is harder to nod past. One verb phrase changed;
     * the rest of the §05 line is as written. The Messaging Kit copy of
     * §05 is owner-owned and still needs reconciling to match.
     */
    description:
      "Your product or operations need intelligence built in. We assess where agents actually pay off and build them in, not because it's trendy, but because it solves the problem.",
    accent: "lavender",
  },
  {
    slug: "product-support",
    name: "Product Support",
    description:
      "The product is live. Now it needs to grow. We stay on retainer to evolve it, maintain it, and build what comes next.",
    accent: "sage",
  },
] as const satisfies readonly Service[];
