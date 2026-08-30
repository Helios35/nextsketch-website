import type { CSSProperties } from "react";

/**
 * The marquee capability strip — the site's one "ribbon".
 *
 * **Extracted verbatim from `hero.tsx`, not rewritten** (owner
 * direction, 2026-08-30: the service heroes take *this* strip, not a
 * second one that looks like it). It was inline in the landing hero and
 * read `LANDING.capabilities` directly; the only thing this change does
 * is lift it to a component and put its two hard-coded reads behind
 * props. Every class, both custom properties, the duplicate-copy
 * hiding and the hover pause are unchanged, so the home page's rendered
 * markup is byte-identical before and after.
 *
 * **The surface is deliberately not parameterised.** `bg-ink/30
 * backdrop-blur-sm` exists because the landing hero has footage behind
 * it. A service route mounts no `ScrollVideo` (#17), so `ink/30` over a
 * solid `ink` page resolves to the same black and the blur has nothing
 * to work on — identical classes, identical result, one strip.
 *
 * `--duration` and `--gap` are set inline because `--gap` has to be
 * read by two different consumers: the flex gaps here and the
 * `marquee` keyframe's `translateX(calc(-100% - var(--gap)))` in
 * `globals.css`. If the two ever disagree the loop seam shows, so they
 * stay one value on one element.
 *
 * `copies` is a prop rather than a constant because the count is tuned
 * to the *content*, not to the component: four copies keep the loop
 * seamless for the landing hero's four labels inside `max-w-4xl`, but a
 * shorter list across a wider frame runs out of track and the strip
 * visibly restarts. Callers with fewer labels pass more copies.
 *
 * Server component: no hooks, no handlers, and `CSSProperties` is a
 * type-only import, so nothing forces a client boundary.
 *
 * The **outer positioning wrapper stays at the call site.** `max-w-4xl`
 * and the gutter ladder are hero-layout decisions, not strip
 * decisions — the service routes render this full-bleed instead.
 */
interface CapabilityStripProps {
  /** The labels, in order. Canonical names only — never invented. */
  items: readonly string[];
  /** Accessible name for the group (the strip has no visible heading). */
  label: string;
  /**
   * Marquee copies. Enough to fill the frame twice over, or the loop
   * seam shows on a wide viewport.
   */
  copies?: number;
  duration?: string;
  gap?: string;
}

export function CapabilityStrip({
  items,
  label,
  copies = 4,
  duration = "38s",
  gap = "2.5rem",
}: CapabilityStripProps) {
  return (
    <div
      role="group"
      aria-label={label}
      className="group overflow-hidden border-y border-white/10 bg-ink/30 py-2.5 backdrop-blur-sm"
      style={{ "--duration": duration, "--gap": gap } as CSSProperties}
    >
      <div className="flex [gap:var(--gap)]">
        {Array.from({ length: copies }, (_, copy) => (
          <ul
            key={copy}
            /* Only the first copy is exposed; the rest are duplicates
               that would otherwise be read out two or three times. */
            aria-hidden={copy !== 0}
            className="flex shrink-0 items-center [gap:var(--gap)] motion-safe:animate-marquee motion-safe:group-hover:[animation-play-state:paused]"
          >
            {items.map((item) => (
              <li
                key={item}
                className="flex items-center gap-3.5 whitespace-nowrap"
              >
                <span
                  aria-hidden="true"
                  className="h-1.5 w-1.5 shrink-0 rotate-45 bg-gold"
                />
                <span className="font-mono text-xs tracking-[0.12em] text-white/70 sm:text-sm">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
