import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { TESTIMONIALS } from "@/content/copy";
import type { AccentName } from "@/lib/types";

/**
 * Static accent→class maps (Tailwind compiles literals only). Accent
 * text on neutral paper — same license as the sketch strokes. The top
 * rule gives each quote sheet its accent without breaking the
 * pairing rule (the card surface stays white, not accent).
 */
const QUOTE_MARK_CLASS: Record<AccentName, string> = {
  gold: "text-gold",
  lavender: "text-lavender",
  rose: "text-rose",
  sage: "text-sage",
};

const TOP_RULE_CLASS: Record<AccentName, string> = {
  gold: "border-t-gold",
  lavender: "border-t-lavender",
  rose: "border-t-rose",
  sage: "border-t-sage",
};

/** Two quiet placeholder blocks; accents are presentational. */
const BLOCK_ACCENTS: readonly AccentName[] = ["gold", "sage"];

/**
 * Testimonials (#voices) — secondary reassurance, never the lead
 * (docs/03-site-architecture.md row 8). Placeholder quote blocks per
 * Rule 4.2 — unapproved or fabricated quotes never ship; the blocks
 * are layout-final (oversized accent quote mark, sans body per
 * docs/04-ux-spec.md §Component specs) so approved rewrites drop in
 * as a copy change only.
 */
export function TestimonialsSection() {
  return (
    <div className="py-24 md:py-32">
      <Reveal>
        <SectionHeading className="max-w-4xl">
          {TESTIMONIALS.headline}
        </SectionHeading>
      </Reveal>
      <div className="mt-14 grid gap-6 md:mt-20 md:grid-cols-2">
        {BLOCK_ACCENTS.map((accent, i) => (
          <Reveal key={accent} delay={i * 0.1}>
            <blockquote
              className={`h-full rounded-2xl border border-ink/5 border-t-[3px] bg-white p-8 shadow-sheet md:p-10 ${TOP_RULE_CLASS[accent]}`}
            >
              <span
                aria-hidden="true"
                className={`block font-sans text-7xl leading-none font-bold md:text-8xl ${QUOTE_MARK_CLASS[accent]}`}
              >
                &ldquo;
              </span>
              <p className="mt-6 text-base text-ink/60">
                {TESTIMONIALS.placeholderLabel}
              </p>
            </blockquote>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
