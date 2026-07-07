"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";
import { createVideoScrubber } from "@/lib/video-scrub";

interface HeroOrbitProps {
  /** Self-hosted asset under /public (never a remote URL). */
  src: string;
  /** Static first-frame poster — the reduced-motion / no-JS fallback. */
  poster: string;
}

/**
 * Scroll runway the pinned hero stretches to. The stage stays one
 * viewport tall and sticky, so the runway minus one viewport is the
 * scroll distance that plays the full orbit — enough travel for the
 * rotation to read as deliberate without stranding the visitor.
 */
const RUNWAY_MIN_HEIGHT = "260vh";

/**
 * Hero orbit backdrop (Redesign Unit 03) — the owner-supplied orbit
 * footage (camera circling Nate in a black void) replaces the interim
 * Unsplash still, closing the owner-owed hero background swap. The
 * clip's timeline is scroll-synced via the shared scrub engine, so
 * scroll position IS the camera angle: scrolling the hero's runway
 * rotates the camera around the subject, footage freezes the moment
 * scrolling stops, and the element never play()s (no autoplay, ever).
 *
 * Pinning: hero.tsx renders its section as the runway and its content
 * on a sticky one-viewport stage (`data-hero-stage`). This component
 * stretches the section to the runway height at mount — motion-safe
 * only, applied via JS so no-JS and reduced-motion keep today's
 * one-viewport hero with the static poster frame — and maps the
 * runway's scroll range onto the clip.
 *
 * Decorative by contract (aria-hidden); the hero's image-band
 * treatment (ink/40 overlay + bottom scrim) rides above the footage
 * so the white headline stays legible at every camera angle.
 */
export function HeroOrbit({ src, poster }: HeroOrbitProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const reduceMotion = usePrefersReducedMotion();

  useEffect(() => {
    const video = videoRef.current;
    if (video === null || reduceMotion) return;
    const stage = video.closest<HTMLElement>("[data-hero-stage]");
    const section = stage?.parentElement ?? null;
    if (stage === null || section === null) return;

    section.style.minHeight = RUNWAY_MIN_HEIGHT;
    const scrubber = createVideoScrubber(video);

    const progress = () => {
      const range = section.offsetHeight - stage.offsetHeight;
      if (range <= 0) return 0;
      const scrolled = -section.getBoundingClientRect().top;
      return Math.min(1, Math.max(0, scrolled / range));
    };
    const request = () => scrubber.seekToward(progress());

    request();
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request, { passive: true });
    video.addEventListener("loadedmetadata", request);
    return () => {
      scrubber.cancel();
      window.removeEventListener("scroll", request);
      window.removeEventListener("resize", request);
      video.removeEventListener("loadedmetadata", request);
      section.style.minHeight = "";
    };
  }, [reduceMotion]);

  return (
    <div aria-hidden="true" className="absolute inset-0">
      <video
        ref={videoRef}
        src={src}
        poster={poster}
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
