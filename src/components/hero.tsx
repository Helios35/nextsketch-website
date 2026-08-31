import { Fragment } from "react";
import { BrandWordmark } from "@/components/brand-wordmark";
import { CapabilityStrip } from "@/components/capability-strip";
import { HeroCta } from "@/components/hero-cta";
import { HeroOrbit } from "@/components/hero-orbit";
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
 * Unit 03 (owner-directed): the interim Unsplash still is replaced by
 * the owner-supplied orbit footage, scroll-scrubbed — the section is
 * a runway (`data-hero-runway`, min-height reserved in globals.css
 * before first paint, scripting + motion-safe gated), the content
 * sits on a sticky one-viewport stage (`data-hero-stage`), and
 * <HeroOrbit> maps scroll onto the orbit so scrolling rotates the
 * camera around the subject. No-JS / reduced-motion keep the
 * one-viewport hero over the static poster frame.
 *
 * Server component; the interactive pieces are <HeroCta>, which opens
 * the qualification modal, and the decorative <HeroOrbit> backdrop.
 */

/** Match against accentWords ignoring case and trailing punctuation. */
const ACCENT_WORDS = new Set<string>(LANDING.accentWords);
const normalize = (word: string) => word.replace(/[^a-z]/gi, "").toLowerCase();

export function Hero() {
  const words = LANDING.headline.split(" ");

  return (
    <section
      aria-labelledby="hero-headline"
      data-hero-runway
      className="relative"
    >
      {/* The sticky stage: one viewport of hero content pinned while
          the section's runway (globals.css [data-hero-runway] —
          scripting + motion-safe gated, present before first paint)
          scrolls past underneath — scroll drives the orbit. Without
          JS or under reduced motion the runway never applies and this
          renders exactly the one-viewport hero. */}
      <div
        data-hero-stage
        className="sticky top-0 flex min-h-dvh w-full flex-col items-start justify-end gap-8 overflow-hidden"
      >
        {/* Orbit footage under the image-band treatment (ink/40 overlay
            + bottom scrim) so the white headline stays legible. */}
        <HeroOrbit
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
