import type { Service } from "@/lib/types";

/**
 * The four canonical services — names, slugs, and accent pairs per
 * docs/06-taxonomy.md §1; descriptions verbatim from Messaging Kit §05.
 */

export const SERVICES_HEADLINE =
  "Software products and agentic systems — built for how your business actually works.";

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
