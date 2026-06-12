import type { Variants } from "motion/react";

/**
 * Shared motion vocabulary — the only animation entry point
 * downstream units use (docs/00-project-setup.md: no raw animate
 * calls in section components; enforced via no-restricted-imports
 * in eslint.config.mjs). Values per docs/04-ux-spec.md §Motion
 * inventory: sections rise 12px + fade over 500ms, once.
 */

export const REVEAL_RISE_PX = 16;
export const REVEAL_DURATION_S = 0.6;

/**
 * Settle curve (unit 08): a long-tail ease-out so content lands like
 * paper coming to rest rather than a UI tween. Spec'd in the as-built
 * motion inventory (docs/04-ux-spec.md).
 */
const SETTLE_EASE = [0.22, 1, 0.36, 1] as const;

export const revealVariants: Variants = {
  hidden: { opacity: 0, y: REVEAL_RISE_PX },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: REVEAL_DURATION_S, ease: SETTLE_EASE, delay },
  }),
};

/** Scroll-into-view trigger config: animate once per element. */
export const defaultViewport = { once: true, amount: 0.3 } as const;
