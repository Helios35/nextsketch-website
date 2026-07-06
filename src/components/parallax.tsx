"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";

interface ParallaxProps {
  children: ReactNode;
  className?: string;
  /**
   * Drift factor relative to scroll. The shared section default is a
   * whisper (0.06); the video band uses a stronger drift. Positive
   * values drift with the scroll direction lag (content settles as it
   * centers in the viewport).
   */
  speed?: number;
  /** Hard cap on the drift in px so layouts never collide. */
  maxShift?: number;
}

/**
 * Scroll parallax — the redesign's shared depth primitive
 * (owner-approved motion architecture, Redesign Unit 02). A passive
 * scroll listener + requestAnimationFrame writes a transform-only
 * drift straight to the element, never through React state: the
 * server render is byte-stable, no-JS visitors get the static layout,
 * and reduced-motion users never see a transform (UX spec §Motion
 * reduced-motion parity).
 */
export function Parallax({
  children,
  className,
  speed = 0.06,
  maxShift = 48,
}: ParallaxProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const reduceMotion = usePrefersReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (el === null || reduceMotion) return;

    let frame = 0;
    let currentShift = 0;
    const update = () => {
      frame = 0;
      const rect = el.getBoundingClientRect();
      // Subtract the applied shift so the measurement is of the
      // untransformed position — otherwise the drift feeds back into
      // itself.
      const elementCenter = rect.top - currentShift + rect.height / 2;
      const viewportCenter = window.innerHeight / 2;
      const raw = (viewportCenter - elementCenter) * speed;
      currentShift = Math.max(-maxShift, Math.min(maxShift, raw));
      el.style.transform = `translate3d(0, ${currentShift.toFixed(2)}px, 0)`;
    };
    const request = () => {
      if (frame === 0) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request, { passive: true });
    return () => {
      if (frame !== 0) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", request);
      window.removeEventListener("resize", request);
      el.style.transform = "";
    };
  }, [reduceMotion, speed, maxShift]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
