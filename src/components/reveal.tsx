"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { defaultViewport, revealVariants } from "@/lib/motion";
import { useMounted } from "@/lib/use-mounted";

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Stagger offset in seconds. */
  delay?: number;
}

/**
 * Scroll-into-view reveal (12px rise + fade, 500ms, once) — the
 * shared animation wrapper for section content.
 *
 * Content renders visible on the server and first client render;
 * the animated branch mounts only client-side when motion is
 * allowed. This keeps no-JS pages readable (Business Rules E3),
 * gives reduced-motion users instant visibility with no transforms
 * (UX spec §Motion), and avoids hydrating animated styles into a
 * static tree.
 */
export function Reveal({ children, className, delay = 0 }: RevealProps) {
  const reduceMotion = useReducedMotion();
  const mounted = useMounted();

  if (!mounted || reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={defaultViewport}
      variants={revealVariants}
      custom={delay}
    >
      {children}
    </motion.div>
  );
}
