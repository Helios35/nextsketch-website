"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";

interface ScrollVideoProps {
  /** Self-hosted asset under /public (never a remote URL). */
  src: string;
  className?: string;
}

/**
 * Scroll-play background video (Redesign Unit 02, owner-approved:
 * ambient play + parallax). The muted loop plays only while its band
 * is on screen and drifts with a gentle parallax inside the
 * `scale-110` headroom, under the hero's image-band treatment
 * (`ink/40` overlay + bottom scrim) so foreground text stays legible.
 * Decorative by contract: aria-hidden, no audio, no controls.
 *
 * Fallbacks: reduced-motion never calls play() (static first frame,
 * no drift); without JS the <video> never plays and the overlays keep
 * the band legible over the poster frame.
 */
export function ScrollVideo({ src, className }: ScrollVideoProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const reduceMotion = usePrefersReducedMotion();

  // Ambient play/pause — plays only while the band is on screen.
  useEffect(() => {
    const video = videoRef.current;
    if (video === null || reduceMotion) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          void video.play().catch(() => {
            // Autoplay rejection (browser policy) degrades to the
            // static poster frame — the reduced-motion state.
          });
        } else {
          video.pause();
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(video);
    return () => {
      observer.disconnect();
      video.pause();
    };
  }, [reduceMotion]);

  // Parallax drift within the scale-110 headroom (transform composes
  // with the standalone Tailwind `scale` property, so the class and
  // the inline translate never fight).
  useEffect(() => {
    const video = videoRef.current;
    if (video === null || reduceMotion) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = video.getBoundingClientRect();
      const viewportCenter = window.innerHeight / 2;
      const bandCenter = rect.top + rect.height / 2;
      const progress = (viewportCenter - bandCenter) / window.innerHeight;
      const shift = Math.max(-24, Math.min(24, progress * 48));
      video.style.transform = `translate3d(0, ${shift.toFixed(2)}px, 0)`;
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
      video.style.transform = "";
    };
  }, [reduceMotion]);

  return (
    <div
      aria-hidden="true"
      className={["absolute inset-0 overflow-hidden", className]
        .filter(Boolean)
        .join(" ")}
    >
      <video
        ref={videoRef}
        src={src}
        muted
        loop
        playsInline
        preload="metadata"
        className="absolute inset-0 h-full w-full scale-110 object-cover"
      />
      <div className="absolute inset-0 bg-ink/40" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/20 to-transparent" />
    </div>
  );
}
