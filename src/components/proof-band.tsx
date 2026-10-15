import { ScrollReveal } from "@/components/scroll-reveal";
import { PROOF } from "@/content/copy";

/**
 * The proof band (decision-log **#58**): three short claims directly
 * under the hero, above Work. A band, not a section, so it takes no
 * index, no heading, no anchor and no nav item, and the section order
 * (#13, #16) is unchanged.
 *
 * Built from the system's own pieces and nothing new: the shared
 * gutter ladder, the coral list diamond (a list is where the accent
 * rules allow it), Inter at medium weight in linen. No hairline above
 * or below: the hero dissolves into the page on every edge (#50), and a
 * rule here would draw the seam that fade removes.
 *
 * Server component; the entrance is the shared `ScrollReveal`.
 */
export function ProofBand() {
  return (
    <div className="w-full px-6 py-8 sm:px-8 lg:px-16">
      <ScrollReveal>
        <ul className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-x-10 sm:gap-y-3">
          {PROOF.map((item) => (
            <li
              key={item}
              className="flex items-center gap-3 text-base font-medium text-foreground md:text-lg"
            >
              <span
                aria-hidden="true"
                className="h-1.5 w-1.5 shrink-0 rotate-45 bg-brand"
              />
              {item}
            </li>
          ))}
        </ul>
      </ScrollReveal>
    </div>
  );
}
