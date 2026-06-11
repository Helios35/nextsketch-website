import { Fragment } from "react";
import { Button } from "@/components/button";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { SketchAccent } from "@/components/sketch-accent";
import { HERO } from "@/content/copy";

/** Per-word stagger per docs/04-ux-spec.md §Motion inventory. */
const WORD_STAGGER_S = 0.08;

/**
 * Presentation marker, not copy: the UX spec's sketch-accent example
 * underlines "stay" in the hero. Matched against the canonical
 * headline at render; if the copy changes the underline degrades to
 * nothing rather than mis-annotating.
 */
const UNDERLINED_WORD = "stay";

/**
 * Hero (#top) — the promise in 3 seconds (docs/03-site-architecture.md
 * row 2). Headline Option A staggers in word by word on load; the
 * stat strip ships with placeholder numbers per docs/decision-log.md
 * #5. CTA anchors to #start until the qualification modal lands
 * (unit 06 swaps the action — locked interim behavior).
 */
export function HeroSection() {
  const words = HERO.headline.split(" ");

  return (
    <div className="pt-20 pb-16 md:pt-32 md:pb-20">
      <SectionHeading as="h1" size="hero">
        {words.map((word, i) => (
          <Fragment key={`${word}-${i}`}>
            <Reveal as="span" className="inline-block" delay={i * WORD_STAGGER_S}>
              {word.replace(/[^a-z]/gi, "").toLowerCase() ===
              UNDERLINED_WORD ? (
                <span className="relative inline-block">
                  {word}
                  <SketchAccent
                    variant="underline"
                    accent="gold"
                    strokeWidth={4}
                    className="absolute -bottom-2 left-0 h-auto w-full md:-bottom-3"
                  />
                </span>
              ) : (
                word
              )}
            </Reveal>
            {i < words.length - 1 ? " " : null}
          </Fragment>
        ))}
      </SectionHeading>
      <Reveal delay={0.25} className="mt-8 max-w-2xl">
        <p className="text-lg leading-relaxed text-ink/80 md:text-xl">
          {HERO.subheadline}
        </p>
      </Reveal>
      <Reveal delay={0.35} className="mt-10">
        <Button href="#start">{HERO.cta}</Button>
      </Reveal>
      <Reveal delay={0.45} className="mt-20 md:mt-28">
        <dl className="grid grid-cols-2 gap-x-6 gap-y-10 border-t border-ink/10 pt-10 md:grid-cols-4">
          {HERO.stats.map(({ value, label }) => (
            <div key={label} className="flex flex-col-reverse gap-2">
              <dt className="text-sm text-ink/60">{label}</dt>
              <dd className="text-3xl font-bold tracking-tight md:text-4xl">
                {value}
              </dd>
            </div>
          ))}
        </dl>
      </Reveal>
    </div>
  );
}
