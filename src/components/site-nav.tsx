"use client";

import { useEffect, useRef, useState } from "react";
import { BrandWordmark } from "@/components/brand-wordmark";
import { Button } from "@/components/button";
import { CloseIcon } from "@/components/close-icon";
import { NAV } from "@/content/copy";

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
 * gated by motion-safe. Items ride NAV.items — the live redesign
 * sections (decision-log #13: work / why / services / process / about;
 * #start is reached via the CTA, not a nav item) plus Pricing, the one
 * item that leaves the page (#23/#24). The hero renders the brand
 * wordmark itself, so the nav's wordmark appears only once scrolled —
 * otherwise it would double over the hero. `/pricing` has no hero, so
 * that page renders the same above-the-fold lockup for itself; this
 * bar is route-agnostic and stays that way.
 *
 * **Hamburger at every breakpoint — decision-log #22 (2026-08-25).**
 * The visible desktop tab row is retired: the bar is the wordmark slot
 * and one right-justified burger at every width, and the full-screen
 * ink overlay (focus trap, Escape, scroll lock, focus return) is the
 * only place the items render. A sixth item made the row crowd the
 * lockup at md, and the overlay was already carrying the whole set on
 * mobile — so this deletes a surface rather than adding one. The
 * overlay takes the bar's gutter ladder (px-6 / sm:px-8 / lg:px-16) so
 * its lockup lands on the gutter the bar's does at every width.
 * The overlay was px-6 flat, which already drifted 8px from the bar
 * between sm and md; opening it at every width would have made that a
 * visible sideways jump of up to 40px at lg.
 *
 * **The bar carries one button, beside the burger** (owner direction,
 * 2026-08-25; decision-log #26): `NAV.featured`, which is Pricing. It
 * is the shared `<Button>` at the `ghost` variant — §Interaction
 * vocabulary's de-emphasized action on ink — deliberately not the white
 * divided-arrow advance the hero CTA owns. This narrowly supersedes the
 * 2026-07-06 "no CTA in the nav" direction: that call was about
 * conversion, and this is navigation to a page, so the nav still has no
 * conversion CTA. Pricing keeps its menu row too, so the button is a
 * shortcut rather than the only way to reach it.
 *
 * It hides below 375px, the smoke-test width (build-note 07), because
 * that is where it measurably stops fitting. Scrolled, the bar carries
 * the lockup (128px), the button (112px) and the burger (44px) plus
 * gaps, needing ~320px inside the gutters. At 375 the burger lands
 * exactly on its 24px gutter; at 360 it creeps 7px inside it, which the
 * binding gutter rhythm does not allow; at 320 it is pushed 23px
 * off-screen entirely.
 * The gate lives on a **wrapper**, not the button: `<Button>`'s base
 * class already sets `inline-flex`, and `hidden` on the same element
 * loses to it — same specificity, so stylesheet order decides, not
 * class order. Measured, not assumed; the first attempt did nothing at
 * all. The menu carries Pricing at every width regardless.
 *
 * **The bar does not intercept pointer events; only its controls do.**
 * `<header>` is fixed, full-width and `z-40`, so its box sat over the
 * page's own above-the-fold lockup and swallowed every click on it —
 * which is why that lockup shipped un-linked in Unit 22. The bar is now
 * `pointer-events-none` with `pointer-events-auto` restored on the
 * wordmark link, the button, the burger and the overlay, so a page can
 * put a real link under the transparent bar. Nothing about the bar's
 * appearance or the 80px handoff changes.
 *
 * The burger sits right via justify-between, against the
 * wordmark slot on the left. Every href is root-relative (NAV.home,
 * NAV.items) so it resolves from `/pricing` as well as `/`; a bare
 * `#work` would mean `/pricing#work` there, which is nothing.
 *
 * Server render is the static branch: not scrolled (no wordmark),
 * menu closed. **Closed means the items are not in the SSR HTML**, so
 * without JS this bar is a wordmark slot and an inert burger. That is
 * a real narrowing — the retired tab row was the nav's no-JS surface —
 * and it is deliberate rather than overlooked: `<SiteFooter>` maps the
 * same `NAV.items` as plain anchors on every page, so all six
 * destinations stay reachable with scripting off, and the burger was
 * already inert without JS at mobile widths. A `@media (scripting:
 * none)` fallback row is the fix if the owner wants the nav itself to
 * carry them; flagged in build-note 22, not built.
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
        "pointer-events-none fixed inset-x-0 top-0 z-40 border-b",
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
          scrolled ? "bg-surface/95 backdrop-blur-xl" : "bg-transparent",
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
              href={NAV.home}
              className="pointer-events-auto inline-flex min-h-11 items-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <BrandWordmark className="h-7 w-auto" />
            </a>
          ) : (
            /* The hero owns the wordmark until the bar turns solid;
               the placeholder keeps justify-between right-aligning
               the links. */
            <span aria-hidden="true" />
          )}
          {/* Grouped so justify-between still pins both to the right
              against the wordmark slot. */}
          <div className="flex items-center gap-3">
            <div className="max-[374px]:hidden">
              <Button
                variant="ghost"
                size="compact"
                href={NAV.featured.href}
                className="pointer-events-auto"
              >
                {NAV.featured.label}
              </Button>
            </div>
            <button
              ref={toggleRef}
              type="button"
              aria-expanded={open}
              aria-label={NAV.menu.open}
              onClick={() => setOpen(true)}
              className="pointer-events-auto inline-flex min-h-11 min-w-11 items-center justify-center text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <BurgerIcon />
            </button>
          </div>
        </nav>
      </div>
      {open && (
        <div
          ref={overlayRef}
          role="dialog"
          aria-modal="true"
          aria-label={NAV.label}
          className="pointer-events-auto fixed inset-0 z-50 flex flex-col bg-surface/95 px-6 text-white backdrop-blur-xl sm:px-8 lg:px-16"
        >
          <div className="flex items-center justify-between py-5">
            {/* The overlay covers the hero, so its wordmark always
               renders (no doubling risk here). */}
            <a
              href={NAV.home}
              onClick={closeMenu}
              className="inline-flex min-h-11 items-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <BrandWordmark className="h-7 w-auto" />
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
            {NAV.items.map(({ href, label }) => (
              <li key={href}>
                <a
                  href={href}
                  onClick={closeMenu}
                  className="block py-3 text-3xl font-medium tracking-tight focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
