"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { useMounted } from "@/lib/use-mounted";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  /** Stagger offset in milliseconds — the hero rhythm is 0 / 120 / 200. */
  delay?: number;
  /** Rendered element; "span" for inline reveals. */
  as?: "div" | "span";
}

/**
 * Scroll-triggered section entrance — the redesign's shared entrance
 * primitive (docs/04-ux-spec.md §Motion inventory: "rise-in family,
 * scroll-triggered, same contract"). JS only *triggers*: an
 * IntersectionObserver flips a class and the visible animation is the
 * hero's CSS `rise-in` keyframe, so the CSS-keyframes-only motion
 * contract holds (owner-approved architecture, Redesign Unit 02).
 *
 * Content renders visible on the server and first client render; the
 * hidden pre-reveal state exists only client-side when motion is
 * allowed. No-JS pages stay readable (Business Rules E3) and
 * reduced-motion users get instant visibility with no transforms.
 */
export function ScrollReveal({
  children,
  className,
  delay = 0,
  as = "div",
}: ScrollRevealProps) {
  const mounted = useMounted();
  const reduceMotion = usePrefersReducedMotion();
  const ref = useRef<HTMLElement | null>(null);
  const [inView, setInView] = useState(false);

  const animate = mounted && !reduceMotion;

  useEffect(() => {
    if (!animate || inView) return;
    const el = ref.current;
    if (el === null) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -10% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [animate, inView]);

  const setRef = (el: HTMLElement | null) => {
    ref.current = el;
  };
  const cls = [
    className,
    animate ? (inView ? "motion-safe:animate-rise-in" : "opacity-0") : "",
  ]
    .filter(Boolean)
    .join(" ");
  const style: CSSProperties | undefined =
    animate && inView && delay > 0
      ? { animationDelay: `${delay}ms` }
      : undefined;

  if (as === "span") {
    return (
      <span ref={setRef} className={cls} style={style}>
        {children}
      </span>
    );
  }
  return (
    <div ref={setRef} className={cls} style={style}>
      {children}
    </div>
  );
}
