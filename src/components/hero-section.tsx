import { Fragment } from "react";
import { ModalTrigger } from "@/components/modal-trigger";
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
 * #5. CTA opens the qualification modal, degrading to mailto without
 * JS (Business Rules E3).
 */
export function HeroSection() {
  const words = HERO.headline.split(" ");

  return (
    <div className="pt-24 pb-20 md:pt-36 md:pb-24">
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
        <ModalTrigger>{HERO.cta}</ModalTrigger>
      </Reveal>
      {/*
       * Stat strip as a drafting title block (unit 08): hairline-boxed
       * cells, big tabular numerals, tracked-out labels — the document
       * frame that makes the placeholder values read as a draft
       * awaiting its revision stamp (Decision Log #5), not as missing
       * content. Cells are opaque paper so the band grid stays quiet
       * behind the numbers.
       */}
      <Reveal delay={0.45} className="mt-20 md:mt-28">
        <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-ink/15 bg-ink/15 shadow-sheet md:grid-cols-4">
          {HERO.stats.map(({ value, label }) => (
            <div
              key={label}
              className="flex flex-col-reverse gap-3 bg-paper p-6 md:p-8"
            >
              <dt className="text-xs font-medium tracking-[0.18em] uppercase text-ink/60">
                {label}
              </dt>
              <dd className="text-4xl font-bold tracking-tight tabular-nums md:text-5xl">
                {value}
              </dd>
            </div>
          ))}
        </dl>
      </Reveal>
    </div>
  );
}
