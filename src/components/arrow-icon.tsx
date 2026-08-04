/**
 * The advance arrow (docs/04-ux-spec.md §Interaction vocabulary) —
 * the mark in the hero/nav button's divided arrow box, the modal's
 * advance and its secondary path, and the service-card CTAs.
 *
 * Extracted from button.tsx, qualification-modal.tsx and
 * service-cta.tsx, which had each grown their own identical copy —
 * the CloseIcon precedent, itself pulled out of site-nav for the same
 * reason. Color rides on currentColor so it inherits whatever surface
 * it lands on; the owning element supplies the hover nudge, since the
 * three call sites translate different wrappers.
 *
 * No "use client": a presentational SVG carries no server-only code,
 * so it renders as a Server Component where one imports it and is
 * bundled into the client where a Client Component does.
 *
 * `className` is required rather than defaulted — the three call
 * sites render at three different sizes, and a default would let a
 * fourth silently inherit the wrong one.
 */
export function ArrowIcon({ className }: { className: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}
