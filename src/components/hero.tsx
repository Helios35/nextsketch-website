import { Fragment } from "react";
import { BrandWordmark } from "@/components/brand-wordmark";
import { CapabilityStrip } from "@/components/capability-strip";
import { HeroCta } from "@/components/hero-cta";
import { HeroLoop } from "@/components/hero-loop";
import { LANDING } from "@/content/copy";

/**
 * Landing hero (#top) — the single-page site. A faithful re-skin of
 * the supplied template Hero (bottom-anchored, items-start; full-bleed
 * band under a light overlay; an upper capability strip, then a
 * two-column headline / supporting-line row), mapped to NextSketch
 * brand: the template's lime accent becomes the gold brand token, copy
 * comes from @/content LANDING, and the fake team-avatar stack +
 * invented revenue stats are dropped (Brand Philosophy §10 — no social
 * proof; NextSketch is one person). The template's stats marquee is
 * repurposed into the capability strip sanctioned by UX spec §Motion
 * inventory (the four canonical services, no numbers).
 *
 * The band is owner-supplied footage (Unit 03 replaced the interim
 * Unsplash still). Since decision-log #46 (2026-10-05) it is one silent
 * loop that plays on its own (<HeroLoop>) and ignores scroll: the
 * 260vh scroll runway and the sticky stage that existed only to give
 * the old scrubbed orbit room are gone, so the hero is one screen tall
 * and the first scroll moves straight into Work. Composition, overlays,
 * header block, strip and copy are unchanged by that swap.
 *
 * Server component; the interactive pieces are <HeroCta>, which opens
 * the qualification modal, and the decorative <HeroLoop> footage.
 */

/** Match against accentWords ignoring case and trailing punctuation. */
const ACCENT_WORDS = new Set<string>(LANDING.accentWords);
const normalize = (word: string) => word.replace(/[^a-z]/gi, "").toLowerCase();

export function Hero() {
  const words = LANDING.headline.split(" ");

  return (
    <section aria-labelledby="hero-headline" className="relative">
      {/* The stage: one viewport of hero content, bottom-anchored. It
          was sticky across the scrub runway until #46; `relative` keeps
          it the containing block for the absolute footage and header. */}
      <div className="relative flex min-h-dvh w-full flex-col items-start justify-end gap-8 overflow-hidden">
        {/* Looping footage under the image-band treatment (ink/40
            overlay + bottom scrim) so the white headline stays legible. */}
        <HeroLoop
          src={LANDING.backgroundVideo}
          poster={LANDING.backgroundPoster}
        />

        {/* Wordmark — confident restraint, no nav. The brand lockup
            carries the same legibility treatment the text wordmark had
            over the footage, as a drop-shadow (text-shadow does not
            reach SVG fills). */}
        <header className="absolute top-0 left-0 z-10 px-6 py-6 sm:px-8 lg:px-16">
          <BrandWordmark className="h-7 w-auto [filter:drop-shadow(0_1px_16px_rgba(0,0,0,0.6))]" />
        </header>

        {/* Capability strip — the template's stats marquee, repurposed.
            Slow, pauses on hover, motion-safe so reduced-motion users get
            a static strip. */}
        <div className="relative z-10 w-full max-w-4xl px-6 sm:px-8 lg:px-16 motion-safe:animate-rise-in">
          <CapabilityStrip
            items={LANDING.capabilities}
            label={LANDING.capabilitiesLabel}
          />
        </div>

        {/* Headline + CTA (left) | gold-italic supporting line (right). */}
        <div className="relative z-10 w-full px-6 pb-16 sm:px-8 sm:pb-24 lg:px-16 lg:pb-28">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end">
            <div className="w-full space-y-6 sm:w-1/2">
              <h1
                id="hero-headline"
                aria-label={LANDING.headline}
                className="font-sans text-4xl font-medium leading-[1.05] tracking-tight text-white [text-shadow:0_2px_30px_rgba(0,0,0,0.5)] sm:text-5xl md:text-6xl lg:text-7xl"
              >
                {words.map((word, i) => (
                  <Fragment key={`${word}-${i}`}>
                    {ACCENT_WORDS.has(normalize(word)) ? (
                      <span className="text-gold">{word}</span>
                    ) : (
                      word
                    )}
                    {i < words.length - 1 ? " " : null}
                  </Fragment>
                ))}
              </h1>
              <div
                className="motion-safe:animate-rise-in"
                style={{ animationDelay: "120ms" }}
              >
                <HeroCta label={LANDING.cta} />
              </div>
            </div>
            <div className="w-full sm:w-1/2">
              <p
                className="font-sans text-base text-gold italic [text-shadow:0_1px_20px_rgba(0,0,0,0.7)] motion-safe:animate-rise-in sm:text-right md:text-2xl"
                style={{ animationDelay: "200ms" }}
              >
                {LANDING.supportingLine}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
