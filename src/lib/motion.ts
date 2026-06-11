import type { Variants } from "motion/react";

/**
 * Shared motion vocabulary — the only animation entry point
 * downstream units use (docs/00-project-setup.md: no raw animate
 * calls in section components; enforced via no-restricted-imports
 * in eslint.config.mjs). Values per docs/04-ux-spec.md §Motion
 * inventory: sections rise 12px + fade over 500ms, once.
 */

export const REVEAL_RISE_PX = 12;
export const REVEAL_DURATION_S = 0.5;

export const revealVariants: Variants = {
  hidden: { opacity: 0, y: REVEAL_RISE_PX },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: REVEAL_DURATION_S, ease: "easeOut", delay },
  }),
};

/** Scroll-into-view trigger config: animate once per element. */
export const defaultViewport = { once: true, amount: 0.3 } as const;
