"use client";

import { useEffect, useRef, useState } from "react";
import { CloseIcon } from "@/components/close-icon";
import { ModalTrigger } from "@/components/modal-trigger";
import { NAV, SITE } from "@/content/copy";

/** Scroll depth (px) past which the nav turns solid and shrinks. */
const SHRINK_SCROLL_Y = 80;

function BurgerIcon() {
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
      <path d="M2 5h16M2 10h16M2 15h16" />
    </svg>
  );
}

/**
 * Fixed top nav, dark re-skin per Redesign Unit 02 (docs/04-ux-spec.md
 * §Component specs) — replaces the sticky paper bar of the retired
 * sketch system. Fixed (not sticky) so it overlays the full-bleed hero
 * without pushing it down: transparent over the hero, elevated ink
 * glass (bg-ink/80 + backdrop-blur, white/10 hairline) with reduced
 * height after 80px of scroll. The shrink is plain CSS transitions
 * gated by motion-safe. Anchors ride NAV.items — the live redesign
 * sections (decision-log #13: why / services / process / about; #start
 * is reached via the CTA, not a nav item). The hero renders the brand
 * wordmark itself, so the nav's #top wordmark appears only once
 * scrolled — otherwise it would double over the hero. Mobile:
 * hamburger opens a full-screen ink overlay with the anchors in the
 * display face and the CTA.
 *
 * The CTA opens the qualification modal via <ModalTrigger>, which
 * degrades to the mailto escape hatch without JS (Business Rules E3).
 * Server render is the static branch (not scrolled — no wordmark —
 * menu closed), so the no-JS page keeps working anchor links.
 */
export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > SHRINK_SCROLL_Y);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const toggle = toggleRef.current;
    closeRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        return;
      }
      // The overlay is modal (aria-modal) — keep Tab cycling inside it.
      if (event.key !== "Tab") return;
      const overlay = overlayRef.current;
      if (overlay === null) return;
      const focusables = overlay.querySelectorAll<HTMLElement>(
        "a[href], button:not([disabled])",
      );
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (first === undefined || last === undefined) return;
      const active = document.activeElement;
      const inside = active instanceof Node && overlay.contains(active);
      if (event.shiftKey && (!inside || active === first)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (!inside || active === last)) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      toggle?.focus();
    };
  }, [open]);

  const closeMenu = () => setOpen(false);

  return (
    <header
      className={[
        "fixed inset-x-0 top-0 z-40 border-b",
        "motion-safe:transition-colors motion-safe:duration-300",
        scrolled ? "border-white/10" : "border-transparent",
      ].join(" ")}
    >
      {/* The surface (elevated glass per §Surfaces — never pure #000)
          lives on this inner div, NOT the header: a backdrop-filter
          would make the header the containing block for the
          fixed-position mobile overlay and clip it to the bar. */}
      <div
        className={[
          "px-6 sm:px-8 lg:px-16",
          "motion-safe:transition-colors motion-safe:duration-300",
          scrolled ? "bg-[#0a0a0c]/95 backdrop-blur-xl" : "bg-transparent",
        ].join(" ")}
      >
        <nav
          aria-label={NAV.label}
          className={[
            "flex items-center justify-between gap-6",
            "motion-safe:transition-[padding] motion-safe:duration-300",
            scrolled ? "py-3" : "py-5",
          ].join(" ")}
        >
          {scrolled ? (
            <a
              href="#top"
              className="inline-flex min-h-11 items-center font-sans text-lg font-bold tracking-tight text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              {SITE.name}
            </a>
          ) : (
            /* The hero owns the wordmark until the bar turns solid;
               the placeholder keeps justify-between right-aligning
               the links. */
            <span aria-hidden="true" />
          )}
          <ul className="hidden items-center gap-8 md:flex">
            {NAV.items.map(({ id, label }) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  className="inline-flex min-h-11 items-center font-mono text-xs uppercase tracking-[0.14em] text-white/60 [text-shadow:0_1px_16px_rgba(0,0,0,0.6)] transition-colors duration-150 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
          <div className="hidden md:block">
            <ModalTrigger variant="inverse" arrow>
              {NAV.cta}
            </ModalTrigger>
          </div>
          <button
            ref={toggleRef}
            type="button"
            aria-expanded={open}
            aria-label={NAV.menu.open}
            onClick={() => setOpen(true)}
            className="inline-flex min-h-11 min-w-11 items-center justify-center text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white md:hidden"
          >
            <BurgerIcon />
          </button>
        </nav>
      </div>
      {open && (
        <div
          ref={overlayRef}
          role="dialog"
          aria-modal="true"
          aria-label={NAV.label}
          className="fixed inset-0 z-50 flex flex-col bg-[#0a0a0c]/95 px-6 text-white backdrop-blur-xl md:hidden"
        >
          <div className="flex items-center justify-between py-5">
            {/* The overlay covers the hero, so its wordmark always
               renders (no doubling risk here). */}
            <a
              href="#top"
              onClick={closeMenu}
              className="inline-flex min-h-11 items-center font-sans text-lg font-bold tracking-tight text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              {SITE.name}
            </a>
            <button
              ref={closeRef}
              type="button"
              aria-label={NAV.menu.close}
              onClick={closeMenu}
              className="inline-flex min-h-11 min-w-11 items-center justify-center text-white/60 transition-colors duration-150 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <CloseIcon />
            </button>
          </div>
          <ul className="flex grow flex-col justify-center gap-2">
            {NAV.items.map(({ id, label }) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  onClick={closeMenu}
                  className="block py-3 text-3xl font-medium tracking-tight focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
          <div className="pb-10">
            <ModalTrigger
              className="w-full"
              variant="inverse"
              arrow
              onBeforeOpen={closeMenu}
            >
              {NAV.cta}
            </ModalTrigger>
          </div>
        </div>
      )}
    </header>
  );
}
