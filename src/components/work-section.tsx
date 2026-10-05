import { ScrollReveal } from "@/components/scroll-reveal";
import { SectionHeading } from "@/components/section-heading";
import { WorkRail } from "@/components/work-rail";
import {
  WORK_EYEBROW,
  WORK_HEADLINE,
  WORK_INTRO,
  WORK_ITEMS,
} from "@/content/work";

/**
 * Presentation marker, not copy: the proof the section exists to land
 * takes the gold payoff treatment (docs/04-ux-spec.md §Typography — at
 * most a couple of accent words inside a white display heading).
 * Degrades to an unaccented headline if the canonical copy changes.
 */
const ACCENT_PHRASE = "Real Products";

/**
 * Selected work (#work) — the proof band (owner direction 2026-08-24).
 * Reactivated from the dormant set: decision-log #13 held `#work` back
 * and required a new decision to bring it live, and this is it
 * (decision-log #16) — visitors were reaching the site and leaving
 * with nothing on the page demonstrating proof of work or authority.
 * The retired paper-era grid this file used to hold (accent-tinted
 * hatched tiles, sketch arrows, the lavender/rose/sage rotation) is
 * gone with the design system that produced it (§Retired); the section
 * is rebuilt against the dark system from an owner-supplied reference
 * gallery, adapted in <WorkRail>.
 *
 * Placement and surface are owner-directed: the band sits immediately
 * below the hero — proof before the argument — and is **opaque
 * `bg-ink`, matching the footer**. When it shipped it was the one
 * section on the page that was not a transparent band over
 * scroll-synced footage: the screenshots are the section's whole job
 * and moving footage behind them competed with them. That backdrop is
 * retired (decision-log #46, 2026-10-05), so every section below the
 * hero now sits on ink, and the hook this band carried to keep the
 * backdrop's scroll cadence is gone with it. Its heading still takes
 * **no text shadow**: it sits on plain ink, where §Typography bans it.
 *
 * Vertical padding drops the `sm:` step the other sections carry: the
 * rail's cards bring their own height, and the full ladder left the
 * band floating. Horizontal gutters live on the children, not the
 * section, because the rail is deliberately full-bleed — it runs off
 * the right edge to signal there is more to scroll.
 *
 * Server component; the rail's controls are the only interactive part.
 */
export function WorkSection() {
  const headline = WORK_HEADLINE;
  const phraseStart = headline.indexOf(ACCENT_PHRASE);

  return (
    <section
      id="work"
      aria-labelledby="work-headline"
      className="w-full bg-ink py-24 lg:py-32"
    >
      <WorkRail items={WORK_ITEMS}>
        <div className="max-w-3xl">
          <ScrollReveal>
            <SectionHeading index="01" eyebrow={WORK_EYEBROW}>
              <span id="work-headline">
                {phraseStart === -1 ? (
                  headline
                ) : (
                  <>
                    {headline.slice(0, phraseStart)}
                    <span className="text-gold">{ACCENT_PHRASE}</span>
                    {headline.slice(phraseStart + ACCENT_PHRASE.length)}
                  </>
                )}
              </span>
            </SectionHeading>
          </ScrollReveal>
          <ScrollReveal delay={120}>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-white/70 md:text-lg">
              {WORK_INTRO}
            </p>
          </ScrollReveal>
        </div>
      </WorkRail>
    </section>
  );
}
