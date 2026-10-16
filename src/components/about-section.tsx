import { Parallax } from "@/components/parallax";
import { ScrollReveal } from "@/components/scroll-reveal";
import { SectionHeading } from "@/components/section-heading";
import { TeamAvatar } from "@/components/team-avatar";
import { ABOUT } from "@/content/copy";

/**
 * The deliberateness claim the section exists to land takes the coral
 * payoff treatment, `text-brand` (docs/04-ux-spec.md §Typography: at
 * most a couple of accent words inside a linen display heading;
 * decision-log #47). Matched without the trailing period so the
 * sentence's full stop stays linen. The phrase lives in src/content
 * beside the headline it is matched against (build-note 34, check 11);
 * the heading degrades to unaccented if the two stop matching.
 */
const ACCENT_PHRASE = ABOUT.accentPhrase;

/**
 * About (#about): the team you work with (decision-log #63; it was the
 * person behind it, solo, until then; docs/03-site-architecture.md row
 * 7). Same slot, id, nav label and eyebrow. It sits flat on the
 * full-width band with the shared gutter rhythm, the mono "(05)"
 * eyebrow and the coral payoff phrase; entrances are the shared
 * ScrollReveal at the hero stagger (0 / 120+i·80 / 200ms), and the team
 * row carries the section's single whisper parallax, as the portrait it
 * replaces did.
 *
 * **One column, text first** (owner direction, 2026-10-15): the
 * headline, the intro and the two body paragraphs, then the team row
 * beneath them at every width. The text never introduces a person; who
 * each one is lives on the back of their card.
 *
 * **The team row maps `ABOUT.team`**, so a new person is a content edit
 * (a row there plus their two files under /public/team/), never a code
 * change. The row is centred in the section (owner, 2026-10-15: larger,
 * centred). **On desktop (`lg:`) the cards sit side by side**, two to a
 * row, the row capped at `max-w-4xl`, so each card is 436px; a third
 * person wraps to a second row. **On tablets and phones they stack**, one
 * card per row, capped at `max-w-md` (448px), so a card never shrinks to
 * fit beside another (owner, 2026-10-15). Each is a `TeamAvatar`: its
 * name and title always beneath it, and a flip on click to say who the
 * person is (#63, #64).
 */
export function AboutSection() {
  const headline = ABOUT.headline;
  const phraseStart = headline.indexOf(ACCENT_PHRASE);

  return (
    <section
      id="about"
      aria-labelledby="about-headline"
      className="w-full px-6 py-24 sm:px-8 sm:py-28 lg:px-16 lg:py-36"
    >
      <ScrollReveal>
        <SectionHeading index="05" eyebrow={ABOUT.eyebrow}>
          <span id="about-headline">
            {phraseStart === -1 ? (
              headline
            ) : (
              <>
                {headline.slice(0, phraseStart)}
                <span className="text-brand">{ACCENT_PHRASE}</span>
                {headline.slice(phraseStart + ACCENT_PHRASE.length)}
              </>
            )}
          </span>
        </SectionHeading>
      </ScrollReveal>
      <div className="mt-8 space-y-6">
        {[ABOUT.intro, ...ABOUT.body].map((paragraph, i) => (
          <ScrollReveal key={paragraph} delay={120 + i * 80}>
            <p className="max-w-prose text-base leading-relaxed text-foreground md:text-lg">
              {paragraph}
            </p>
          </ScrollReveal>
        ))}
      </div>
      <ScrollReveal delay={200} className="mx-auto mt-12 w-full max-w-md md:mt-16 lg:max-w-4xl">
        <Parallax speed={0.06}>
          <ul className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-6">
            {ABOUT.team.map((member) => (
              <li key={member.id}>
                <TeamAvatar member={member} />
              </li>
            ))}
          </ul>
        </Parallax>
      </ScrollReveal>
    </section>
  );
}
