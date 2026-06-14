import { Fragment, type CSSProperties } from "react";
import { ModalTrigger } from "@/components/modal-trigger";
import { LANDING } from "@/content/copy";

/**
 * Landing hero (#top) — the single-page site. A dark, cinematic
 * re-skin of the supplied template, mapped to NextSketch brand: the
 * template's lime accent becomes the gold brand token, copy comes
 * from @/content LANDING, and the fake team-avatar stack + invented
 * revenue stats are dropped (Brand Philosophy §10 — no social proof;
 * NextSketch is one person). The template's stats marquee is
 * repurposed into the capability strip sanctioned by UX spec §Motion
 * inventory (the four canonical services, no numbers).
 *
 * Server component: the only interactive piece is the CTA, which is
 * the shared <ModalTrigger> — it opens the qualification modal and,
 * without JS, degrades to the email escape hatch (Business Rules E3).
 */

/** Inline arrow — the project uses inline SVG icons, never lucide. */
function ArrowRight({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

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
      className="relative flex min-h-dvh w-full flex-col overflow-hidden"
    >
      {/* Background image + contrast scrims. The image is an interim
          placeholder (LANDING.backgroundImage); the layered overlays
          guarantee white-on-dark legibility top and bottom. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${LANDING.backgroundImage})` }}
      >
        <div className="absolute inset-0 bg-ink/50" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/70 to-transparent to-40%" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/65 to-transparent to-65%" />
      </div>

      {/* Header — just the wordmark; confident restraint, no nav. */}
      <header className="relative z-10 flex items-center px-6 py-6 sm:px-10 lg:px-16">
        <span className="font-sans text-lg font-bold tracking-tight text-white [text-shadow:0_1px_16px_rgba(0,0,0,0.6)]">
          {LANDING.wordmark}
        </span>
      </header>

      <div className="grow" />

      {/* Capability strip — slow marquee, pauses on hover, gated by
          motion-safe so reduced-motion users get a static strip. */}
      <div
        role="group"
        aria-label={LANDING.capabilitiesLabel}
        className="group relative z-10 w-full overflow-hidden border-y border-white/10 bg-ink/40 py-4 backdrop-blur-sm"
        style={{ "--duration": "42s", "--gap": "2.75rem" } as CSSProperties}
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
                  className="flex items-center gap-4 whitespace-nowrap"
                >
                  <span
                    aria-hidden="true"
                    className="h-1.5 w-1.5 shrink-0 rotate-45 bg-gold"
                  />
                  <span className="font-mono text-xs tracking-[0.12em] text-white/75 sm:text-sm">
                    {capability}
                  </span>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>

      {/* Headline + CTA (left), supporting line (right) — anchored to
          the bottom, the template's composition. */}
      <div className="relative z-10 px-6 pb-14 sm:px-10 sm:pb-20 lg:px-16 lg:pb-24">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl motion-safe:animate-rise-in">
            <h1
              id="hero-headline"
              aria-label={LANDING.headline}
              className="font-sans text-4xl font-medium leading-[1.04] tracking-tight text-white [text-shadow:0_2px_30px_rgba(0,0,0,0.5)] sm:text-5xl md:text-6xl lg:text-7xl"
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
            <div className="mt-8 motion-safe:animate-rise-in [animation-delay:120ms]">
              <ModalTrigger
                variant="inverse"
                className="group/cta gap-2 text-base sm:text-lg"
              >
                {LANDING.cta}
                <ArrowRight className="size-5 transition-transform duration-150 motion-safe:group-hover/cta:translate-x-1" />
              </ModalTrigger>
            </div>
          </div>
          <p className="max-w-xs font-sans text-base text-white/80 [text-shadow:0_1px_20px_rgba(0,0,0,0.6)] motion-safe:animate-rise-in sm:max-w-sm sm:text-lg lg:text-right [animation-delay:200ms]">
            {LANDING.supportingLine}
          </p>
        </div>
      </div>
    </section>
  );
}
