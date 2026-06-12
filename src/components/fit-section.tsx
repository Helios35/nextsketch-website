import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { SketchAccent } from "@/components/sketch-accent";
import { FIT } from "@/content/copy";

/**
 * Presentation marker, not copy: underline the qualifying phrase —
 * self-selection is the job the section exists to do
 * (docs/03-site-architecture.md row 9). Degrades to no underline if
 * the canonical copy changes.
 */
const UNDERLINED_PHRASE = "ready to move";

/**
 * Who it's for (#fit) — qualify + self-filter
 * (docs/03-site-architecture.md row 9). Statement headline with the
 * body offset right, the editorial rhythm established by the
 * manifesto; the second paragraph is the filter that sends explorers
 * away on good terms.
 */
export function FitSection() {
  const headline = FIT.headline;
  const phraseStart = headline.indexOf(UNDERLINED_PHRASE);

  return (
    <div className="py-24 md:py-32">
      <Reveal>
        <SectionHeading className="max-w-4xl">
          {phraseStart === -1 ? (
            headline
          ) : (
            <>
              {headline.slice(0, phraseStart)}
              <span className="relative inline-block">
                {UNDERLINED_PHRASE}
                <SketchAccent
                  variant="underline"
                  accent="sage"
                  strokeWidth={5}
                  className="absolute -bottom-1 left-0 h-auto w-full md:-bottom-2"
                />
              </span>
              {headline.slice(phraseStart + UNDERLINED_PHRASE.length)}
            </>
          )}
        </SectionHeading>
      </Reveal>
      <div className="mt-12 space-y-6 md:mt-16 lg:ml-auto lg:max-w-3xl">
        {FIT.body.map((paragraph, i) => (
          <Reveal key={paragraph} delay={i * 0.1}>
            <p className="text-lg leading-relaxed text-ink/80">{paragraph}</p>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
