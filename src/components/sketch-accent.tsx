"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import type { AccentName } from "@/lib/types";
import { useMounted } from "@/lib/use-mounted";

type SketchVariant = "underline" | "circle" | "arrow";

interface SketchAccentProps {
  variant: SketchVariant;
  accent?: AccentName;
  /** Caller controls size and placement (absolute positioning, width, etc.). */
  className?: string;
  strokeWidth?: number;
}

/**
 * Static accent→class map: Tailwind only compiles class literals.
 * Stroke color flows via currentColor so one map covers every variant.
 */
const ACCENT_CLASS: Record<AccentName, string> = {
  gold: "text-gold",
  lavender: "text-lavender",
  rose: "text-rose",
  sage: "text-sage",
};

interface SketchSpec {
  viewBox: string;
  /** Multiple paths draw in sequence (e.g. arrow shaft, then head). */
  paths: readonly string[];
  /** Per-path draw duration in seconds — total stays within the UX spec's 400–600ms. */
  duration: number;
}

/*
 * Hand-drawn stroke geometry. Deliberately imperfect curves — the
 * "hand" of the brand (docs/04-ux-spec.md §Sketch accent system).
 */
const SPECS: Record<SketchVariant, SketchSpec> = {
  underline: {
    viewBox: "0 0 200 14",
    paths: ["M3 9 C 38 4, 74 11, 108 7 S 172 4, 197 8"],
    duration: 0.45,
  },
  circle: {
    viewBox: "0 0 220 84",
    paths: [
      "M118 9 C 56 4, 12 22, 11 43 C 10 65, 62 80, 116 78 C 172 76, 211 58, 208 38 C 205 17, 152 5, 102 9",
    ],
    duration: 0.6,
  },
  arrow: {
    viewBox: "0 0 120 84",
    paths: ["M9 11 C 22 47, 58 68, 102 62", "M86 46 L 104 62 L 82 73"],
    duration: 0.28,
  },
};

const drawVariants = (duration: number): Variants => ({
  hidden: { pathLength: 0, opacity: 0 },
  visible: (i: number) => ({
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { duration, delay: i * duration, ease: "easeInOut" },
      opacity: { duration: 0.01, delay: i * duration },
    },
  }),
});

/**
 * Hand-drawn SVG accent, stroke-animated on scroll into view (draw-on,
 * once). The only decoration license on the site — each placement must
 * annotate real meaning. Reduced-motion users see it pre-drawn.
 *
 * Pre-drawn on the server and first client render (same rationale as
 * <Reveal>); the draw-on branch mounts only client-side when motion
 * is allowed. Motion drives stroke-dasharray internally via the
 * normalized pathLength prop — never set strokeDasharray on these
 * paths.
 */
export function SketchAccent({
  variant,
  accent = "gold",
  className,
  strokeWidth = 3,
}: SketchAccentProps) {
  const reduceMotion = useReducedMotion();
  const mounted = useMounted();
  const spec = SPECS[variant];
  const cls = [ACCENT_CLASS[accent], className].filter(Boolean).join(" ");
  const pathProps = {
    stroke: "currentColor",
    strokeWidth,
    strokeLinecap: "round",
    fill: "none",
  } as const;

  if (!mounted || reduceMotion) {
    return (
      <svg viewBox={spec.viewBox} className={cls} aria-hidden="true">
        {spec.paths.map((d) => (
          <path key={d} d={d} {...pathProps} />
        ))}
      </svg>
    );
  }

  return (
    <motion.svg
      viewBox={spec.viewBox}
      className={cls}
      aria-hidden="true"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.9 }}
    >
      {spec.paths.map((d, i) => (
        <motion.path
          key={d}
          d={d}
          custom={i}
          variants={drawVariants(spec.duration)}
          {...pathProps}
        />
      ))}
    </motion.svg>
  );
}
