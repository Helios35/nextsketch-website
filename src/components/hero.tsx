import { Fragment, type CSSProperties } from "react";
import { HeroCta } from "@/components/hero-cta";
import { LANDING } from "@/content/copy";

/**
 * Landing hero (#top) — the single-page site. A faithful re-skin of
 * the supplied template Hero (bottom-anchored, items-start; full-bleed
 * image under a light overlay; an upper capability strip, then a
 * two-column headline / supporting-line row), mapped to NextSketch
 * brand: the template's lime accent becomes the gold brand token, copy
 * comes from @/content LANDING, and the fake team-avatar stack +
 * invented revenue stats are dropped (Brand Philosophy §10 — no social
 * proof; NextSketch is one person). The template's stats marquee is
 * repurposed into the capability strip sanctioned by UX spec §Motion
 * inventory (the four canonical services, no numbers).
 *
 * Server component; the only interactive piece is <HeroCta>, which
 * opens the qualification modal.
 */

/** Match against accentWords ignoring case and trailing punctuation. */
const ACCENT_WORDS = new Set<string>(LANDING.accentWords);
const normalize = (word: string) => word.replace(/[^a-z]/gi, "").toLowerCase();

/** Four copies of the strip keep the loop seamless on wide viewports. */
const MARQUEE_COPIES = [0, 1, 2, 3];

export function Hero() {
  const words = LANDING.headline.split(" ");

  return (
    <section
      aria-labelledby="hero-headline"
      className="relative flex min-h-dvh w-full flex-col items-start justify-end gap-8 overflow-hidden"
    >
      {/* Background image under a single light overlay (the template's
          bg-black/40, re-skinned) plus a soft bottom scrim so the white
          headline stays legible. The image is an interim placeholder. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${LANDING.backgroundImage})` }}
      >
        <div className="absolute inset-0 bg-ink/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/20 to-transparent" />
      </div>

      {/* Wordmark — confident restraint, no nav. */}
      <header className="absolute top-0 left-0 z-10 px-6 py-6 sm:px-8 lg:px-16">
        <span className="font-sans text-lg font-bold tracking-tight text-white [text-shadow:0_1px_16px_rgba(0,0,0,0.6)]">
          {LANDING.wordmark}
        </span>
      </header>

      {/* Capability strip — the template's stats marquee, repurposed.
          Slow, pauses on hover, motion-safe so reduced-motion users get
          a static strip. */}
      <div className="relative z-10 w-full max-w-4xl px-6 sm:px-8 lg:px-16 motion-safe:animate-rise-in">
        <div
          role="group"
          aria-label={LANDING.capabilitiesLabel}
          className="group overflow-hidden border-y border-white/10 bg-ink/30 py-2.5 backdrop-blur-sm"
          style={{ "--duration": "38s", "--gap": "2.5rem" } as CSSProperties}
        >
          <div className="flex [gap:var(--gap)]">
            {MARQUEE_COPIES.map((copy) => (
              <ul
                key={copy}
                aria-hidden={copy !== 0}
                className="flex shrink-0 items-center [gap:var(--gap)] motion-safe:animate-marquee motion-safe:group-hover:[animation-play-state:paused]"
              >
                {LANDING.capabilities.map((capability) => (
                  <li
                    key={capability}
                    className="flex items-center gap-3.5 whitespace-nowrap"
                  >
                    <span
                      aria-hidden="true"
                      className="h-1.5 w-1.5 shrink-0 rotate-45 bg-gold"
                    />
                    <span className="font-mono text-xs tracking-[0.12em] text-white/70 sm:text-sm">
                      {capability}
                    </span>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
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
            <div className="motion-safe:animate-rise-in [animation-delay:120ms]">
              <HeroCta label={LANDING.cta} />
            </div>
          </div>
          <div className="w-full sm:w-1/2">
            <p className="font-sans text-base text-gold italic [text-shadow:0_1px_20px_rgba(0,0,0,0.7)] motion-safe:animate-rise-in sm:text-right md:text-2xl [animation-delay:200ms]">
              {LANDING.supportingLine}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
