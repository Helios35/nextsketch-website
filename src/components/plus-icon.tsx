/**
 * Accordion plus→× affordance shared by the <details name> exclusive
 * accordions (Process, FAQ): rotates 45° while the owning row's
 * `group` is open, gated motion-safe. Extracted from process-section
 * in unit 05 so FAQ reuses rather than forks. Color rides on
 * currentColor so the affordance works on ink and paper alike
 * (Redesign Unit 02) — the owning row sets the text color.
 */
export function PlusIcon() {
  return (
    <svg
      aria-hidden="true"
      width="18"
      height="18"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      className="shrink-0 self-center group-open:rotate-45 motion-safe:transition-transform motion-safe:duration-200"
    >
      <path d="M10 3v14M3 10h14" />
    </svg>
  );
}
