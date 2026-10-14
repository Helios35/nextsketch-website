import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { TESTIMONIALS } from "@/content/copy";
import type { AccentName } from "@/lib/types";

/**
 * Static accent→class map (Tailwind compiles literals only). Accent
 * text on the card (coral for the gold key, neutral otherwise,
 * decision-log #47): same license as the sketch strokes.
 */
const QUOTE_MARK_CLASS: Record<AccentName, string> = {
  gold: "text-brand",
  lavender: "text-muted-foreground",
  rose: "text-muted-foreground",
  sage: "text-muted-foreground",
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
            <blockquote className="h-full rounded-xl border border-border bg-card p-8 md:p-10">
              <span
                aria-hidden="true"
                className={`block font-sans text-6xl leading-none font-bold ${QUOTE_MARK_CLASS[accent]}`}
              >
                &ldquo;
              </span>
              <p className="mt-6 text-base text-muted-foreground">
                {TESTIMONIALS.placeholderLabel}
              </p>
            </blockquote>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
