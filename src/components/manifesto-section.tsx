import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { SketchAccent } from "@/components/sketch-accent";
import { MANIFESTO } from "@/content/copy";

/**
 * Presentation marker, not copy: underline the reframe the section
 * exists to land (docs/04-ux-spec.md §Sketch accents — underline
 * strokes beneath key headline words). Degrades to no underline if
 * the canonical copy changes.
 */
const UNDERLINED_PHRASE = "actually need";

/**
 * Manifesto (#why) — reframe the problem
 * (docs/03-site-architecture.md row 3). Statement headline with the
 * body paragraphs offset right, per the editorial rhythm of the
 * reference layout.
 */
export function ManifestoSection() {
  const headline = MANIFESTO.headline;
  const phraseStart = headline.indexOf(UNDERLINED_PHRASE);

  return (
    <div className="py-24 md:py-36">
      <Reveal>
        <SectionHeading size="statement" className="max-w-4xl">
          {phraseStart === -1 ? (
            headline
          ) : (
            <>
              {headline.slice(0, phraseStart)}
              <span className="relative inline-block">
                {UNDERLINED_PHRASE}
                <SketchAccent
                  variant="underline"
                  accent="rose"
                  strokeWidth={5}
                  className="absolute -bottom-1 left-0 h-auto w-full md:-bottom-2"
                />
              </span>
              {headline.slice(phraseStart + UNDERLINED_PHRASE.length)}
            </>
          )}
        </SectionHeading>
      </Reveal>
      <div className="mt-12 grid gap-8 md:mt-16 md:grid-cols-2 md:gap-12 lg:ml-auto lg:max-w-4xl">
        {MANIFESTO.body.map((paragraph, i) => (
          <Reveal key={paragraph} delay={i * 0.1}>
            <p className="text-lg leading-relaxed text-ink/80">{paragraph}</p>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
