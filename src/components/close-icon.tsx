/**
 * Shared close (×) affordance — extracted verbatim from
 * site-nav.tsx so the qualification modal reuses it instead of
 * forking (the PlusIcon precedent, build-notes 05 deviation 2).
 */
export function CloseIcon() {
  return (
    <svg
      aria-hidden="true"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <path d="M4 4l12 12M16 4L4 16" />
    </svg>
  );
}
