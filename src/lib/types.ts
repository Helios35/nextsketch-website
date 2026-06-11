/**
 * Shared domain types. Canonical names and values come from
 * docs/06-taxonomy.md — never invent alternates.
 */

/** Section anchor IDs, exact, per Taxonomy §6. */
export const SECTION_IDS = [
  "top",
  "why",
  "process",
  "work",
  "services",
  "about",
  "voices",
  "fit",
  "faq",
  "start",
] as const;

export type SectionId = (typeof SECTION_IDS)[number];

/** Accent color pairs per Taxonomy §5; pairing rule: accent bg ⇒ paired -ink text. */
export const ACCENT_NAMES = ["gold", "lavender", "rose", "sage"] as const;

export type AccentName = (typeof ACCENT_NAMES)[number];

/** Service slugs per Taxonomy §1. */
export type ServiceSlug = "new-product" | "rescue" | "agentic" | "partnership";

export interface Service {
  readonly slug: ServiceSlug;
  readonly name: string;
  readonly description: string;
  readonly accent: AccentName;
}

/** Process phase slugs per Taxonomy §2, ordered, exactly four. */
export type ProcessPhaseSlug = "strategy" | "build" | "validate" | "partner";

export interface ProcessPhase {
  /** Two-digit display order, "01"–"04". */
  readonly order: "01" | "02" | "03" | "04";
  readonly slug: ProcessPhaseSlug;
  readonly name: string;
  readonly description: string;
  readonly accent: AccentName;
}

export interface FaqItem {
  readonly question: string;
  readonly answer: string;
}
