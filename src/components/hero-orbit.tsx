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
 * Hero orbit backdrop (Redesign Unit 03) — the owner-supplied orbit
 * footage (camera circling Nate in a black void) replaces the interim
 * Unsplash still, closing the owner-owed hero background swap. The
 * clip's timeline is scroll-synced via the shared scrub engine, so
 * scroll position IS the camera angle: scrolling the hero's runway
 * rotates the camera around the subject, footage freezes the moment
 * scrolling stops, and the element never play()s (no autoplay, ever).
 *
 * Pinning: hero.tsx renders its section as the runway
 * (`data-hero-runway`) with the content on a sticky one-viewport
 * stage (`data-hero-stage`). The runway height lives in globals.css,
 * gated on `@media (scripting: enabled) and (prefers-reduced-motion:
 * no-preference)`, so it exists **before first paint**: hash
 * deep-links and scroll restoration measure the final layout (no
 * hydration shift — adversarial review, Unit 03), while no-JS and
 * reduced-motion visitors keep the one-viewport hero. This component
 * only drives the clip: runway progress → timeline. The section sits
 * at the top of the document, so scrollY over the runway's travel is
 * the progress — no per-scroll layout reads; travel is re-measured
 * on resize only.
 *
 * Loading: the element ships `preload="metadata"` + poster; the
 * effect upgrades to auto only when it actually installs the
 * scrubber (JS present, motion-safe), so reduced-motion visitors
 * never fetch footage that will never move. A mid-session
 * reduced-motion flip restores the poster via load() in cleanup —
 * scrubbed frames would otherwise stay painted.
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

    video.preload = "auto";
    const scrubber = createVideoScrubber(video);

    let range = 0;
    let lastProgress = -1;
    const request = () => {
      const progress =
        range > 0 ? Math.min(1, Math.max(0, window.scrollY / range)) : 0;
      if (progress === lastProgress) return;
      lastProgress = progress;
      scrubber.seekToward(progress);
    };
    const remeasure = () => {
      range = section.offsetHeight - stage.offsetHeight;
      lastProgress = -1;
      request();
    };

    remeasure();
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", remeasure, { passive: true });
    video.addEventListener("loadedmetadata", remeasure);
    return () => {
      scrubber.cancel();
      window.removeEventListener("scroll", request);
      window.removeEventListener("resize", remeasure);
      video.removeEventListener("loadedmetadata", remeasure);
      // A mid-session reduced-motion flip must land on the contract
      // frame (the poster), not whatever frame the orbit stopped on;
      // only load() re-arms a dismissed poster. Harmless on unmount.
      video.preload = "metadata";
      video.load();
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
        preload="metadata"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-ink/40" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/20 to-transparent" />
    </div>
  );
}
