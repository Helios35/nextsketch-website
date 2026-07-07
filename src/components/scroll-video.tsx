"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";

interface ScrollVideoProps {
  /** Self-hosted asset under /public (never a remote URL). */
  src: string;
}

/**
 * Scroll-synced background video (Redesign Unit 02, owner-directed
 * revision 2026-07-06 — supersedes the ambient-play/Services-band
 * checkpoint call): the footage is the site's fixed backdrop and its
 * timeline is driven by scroll. Each animation frame eases
 * currentTime toward the page's scroll progress, so frames advance
 * only while the visitor scrolls and freeze the moment scrolling
 * stops. The element never play()s — no autoplay, no audio, no
 * controls; decorative by contract (aria-hidden).
 *
 * Painting: fixed inset-0 at -z-10 — above the root ink canvas
 * (globals.css moves the page surface to <html> for exactly this),
 * below all in-flow content. The hero's own image band covers it for
 * the first viewport; below that, the hero's image-band treatment
 * (ink/40 overlay + bottom scrim, built in here) keeps foreground
 * text legible over the footage.
 *
 * Fallbacks: reduced-motion never scrubs (static first frame under
 * the same overlays — no motion, ever); no-JS gets the same static
 * frame; before metadata loads the ink canvas shows through.
 */
export function ScrollVideo({ src }: ScrollVideoProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const reduceMotion = usePrefersReducedMotion();

  useEffect(() => {
    const video = videoRef.current;
    if (video === null || reduceMotion) return;

    let frame = 0;
    let current = 0;

    const progress = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      return max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    };

    const step = () => {
      frame = 0;
      const duration = video.duration;
      if (!Number.isFinite(duration) || duration <= 0) return;
      const target = progress() * duration;
      // Ease toward the scroll position; stop the loop (and the
      // footage) once converged — "plays" only while scrolling.
      current += (target - current) * 0.14;
      if (Math.abs(target - current) < 1 / 60) {
        current = target;
      } else {
        frame = requestAnimationFrame(step);
      }
      video.currentTime = current;
    };
    const request = () => {
      if (frame === 0) frame = requestAnimationFrame(step);
    };

    request();
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request, { passive: true });
    video.addEventListener("loadedmetadata", request);
    return () => {
      if (frame !== 0) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", request);
      window.removeEventListener("resize", request);
      video.removeEventListener("loadedmetadata", request);
    };
  }, [reduceMotion]);

  return (
    <div aria-hidden="true" className="fixed inset-0 -z-10">
      <video
        ref={videoRef}
        src={src}
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-ink/40" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/20 to-transparent" />
    </div>
  );
}
