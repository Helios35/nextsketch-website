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
 * **The team row maps `ABOUT.team`**, so a new person is a content edit
 * (a row there plus their two files under /public/team/), never a code
 * change. Each person is a `TeamAvatar`: an avatar that turns when
 * clicked and shows their name and title beneath it (#63, #64). Two to a
 * row at every width; a third person wraps to a second row.
 *
 * **Order follows the copy:** headline and intro, then the team, then
 * the story. Below `lg` that is the reading order, one column. From
 * `lg` the story stays under the intro in the left column and the team
 * takes the right one, spanning both rows and centred against them,
 * where the portrait sat. (The split moved from `md` to `lg`: at 768px
 * the right column is 256px, which leaves two avatars about 116px wide.)
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
      <div className="grid gap-10 lg:grid-cols-[3fr_2fr] lg:gap-x-16 lg:gap-y-6">
        <div>
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
          <ScrollReveal delay={120} className="mt-8">
            <p className="max-w-prose text-base leading-relaxed text-foreground md:text-lg">
              {ABOUT.intro}
            </p>
          </ScrollReveal>
        </div>
        {/*
          Grid-item placement lives on the ScrollReveal because it is
          the element the grid actually positions; the list fills it.
        */}
        <ScrollReveal
          delay={200}
          className="w-full max-w-lg self-center lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:justify-self-end"
        >
          <Parallax speed={0.06}>
            <ul className="grid grid-cols-2 gap-4 sm:gap-6">
              {ABOUT.team.map((member) => (
                <li key={member.id}>
                  <TeamAvatar member={member} />
                </li>
              ))}
            </ul>
          </Parallax>
        </ScrollReveal>
        <div className="space-y-6">
          {ABOUT.body.map((paragraph, i) => (
            <ScrollReveal key={paragraph} delay={200 + i * 80}>
              <p className="max-w-prose text-base leading-relaxed text-foreground md:text-lg">
                {paragraph}
              </p>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
