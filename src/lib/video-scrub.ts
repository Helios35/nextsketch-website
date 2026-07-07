/**
 * Shared scroll-scrub engine (Redesign Unit 03) — extracted from the
 * Unit 02 ScrollVideo so the hero orbit and the backdrop sequence
 * drive video timelines through one identical motion. Each animation
 * frame eases currentTime toward a scroll-derived target, so footage
 * advances only while the visitor scrolls and freezes the moment
 * scrolling stops; the element never play()s. currentTime writes are
 * gated on video.seeking — stacked seeks are what reads as chop
 * (build-note 17) — and the loop keeps running until the final frame
 * both converged AND landed.
 */

export interface VideoScrubber {
  /** Ease the timeline toward `progress` (0–1 of the clip's duration). */
  seekToward(progress: number): void;
  /** Stop the animation loop (effect cleanup). */
  cancel(): void;
}

export function createVideoScrubber(video: HTMLVideoElement): VideoScrubber {
  let frame = 0;
  let current = 0;
  let progress = 0;
  let lastWritten = -1;

  const step = () => {
    frame = 0;
    const duration = video.duration;
    if (!Number.isFinite(duration) || duration <= 0) return;
    const target = progress * duration;
    current += (target - current) * 0.12;
    const converged = Math.abs(target - current) < 0.02;
    if (converged) current = target;
    // Never rewrite a value that already landed: a currentTime write
    // restarts a real seek even at the same position, so an
    // unconditional write on the converged frame would re-arm the
    // loop — and the decoder — forever (adversarial review, Unit 03).
    // The landed state must be a true fixed point.
    if (!video.seeking && current !== lastWritten) {
      video.currentTime = current;
      lastWritten = current;
    }
    if (!converged || video.seeking || current !== lastWritten) {
      frame = requestAnimationFrame(step);
    }
  };

  return {
    seekToward(next: number) {
      progress = next;
      if (frame === 0) frame = requestAnimationFrame(step);
    },
    cancel() {
      if (frame !== 0) cancelAnimationFrame(frame);
      frame = 0;
    },
  };
}
