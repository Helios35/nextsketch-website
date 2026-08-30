# Adhoc 26 — Service Routes (four pages)

**Owner (build):** AI coding agent, working adhoc
**Owner (decisions):** Nate
**Mode:** **Adhoc.** Nate makes the calls and supplies the components and copy, session by session. This is not a spec of what to build — it is the set of rules that hold no matter what he decides, and the traps that have already bitten this repo once.

---

## The unit

Four routes, one per service, under `/services/`, addressed by the service slugs from unit 25. **No `/services` index route** — the `#services` section on the home page is the hub.

Everything else — page structure, sections, copy, how the cards link to them, whether it is a dynamic segment or four thin routes — is Nate's call, made live. Do not pre-decide any of it.

## Before touching anything

Confirm unit 25 is merged. **Do not start against the old service names.**

Read `src/app/pricing/page.tsx` end to end. It is the only other standalone route on this site, and its doc block records four solved problems this unit inherits: the wordmark handoff at 80px, the zero-height sticky wrapper that makes it work on a page with no hero, why `ScrollVideo` is not mounted, and the pointer-events fix that let a page put a real link under the fixed bar. Reproduce the solved versions. Do not re-derive them and do not "simplify" the `h-0` wrapper.

Then read `briefs/build-notes/23-pricing-page.md` and `briefs/build-notes/25-service-name-alignment.md`.

## Reuse, do not rebuild

`SiteNav`, `SiteFooter`, `SectionHeading`, `BrandWordmark`, `Container`, `ScrollReveal`, `Button`, `ModalTrigger` and `ServiceCta` all exist and already do what these pages need. If you are writing a second version of any of them, stop and ask.

## Rules that hold regardless of what Nate decides

- **Root-relative hrefs, always.** A bare `#work` on `/services/anything` resolves to nothing. `sectionHref` exists for this. Never hand-write a hash. This was the trap on the pricing unit; here it is multiplied by four.
- **No invented content (Rule 4.3).** The only approved copy for any service today is its one Messaging Kit §05 description. Where Nate has not supplied words, render nothing in that slot — not a placeholder heading, not an empty frame. Draft what is missing, put it in the build notes for approval, and stop. That is exactly what the pricing tiers did with their empty `features` arrays.
- **Do not reword the §05 descriptions.** Canonical under Rule 4.1. Reuse as-is or leave out; changing one is an owner decision with its own log row.
- **Do not read the per-service `accent` field.** Decision #14 orphaned every color but gold. Those values are dead data and rendering one violates a locked decision.
- **`ScrollVideo` is not mounted.** Decision #17 measures its scroll range from the home page's hero-plus-opaque region. Nothing here touches that contract.
- **No em dashes in rendered strings** (#19). Doc blocks are exempt.
- **Rule 3.2 banned terms and Rule 3.1's exhaustive CTA set both bind.** No new CTA strings, no new marketing vocabulary.
- **Conversion goes through the existing seam.** Reuse the `SERVICE_NEED` mapping and the existing CTA components. No new mapping, no new modal entry point.
- **No backend.** Decision #8 holds: these prerender to static HTML and `POST /api/qualify` stays the entire server-side footprint.
- **Real metadata on all four.** Own title and description each, in the `PRICING.title` house form. These are the first pages anyone will land on from search.

## Do not touch

`/pricing` — not the prices, tier names, descriptions or feature bullets. The modal. The nav (six items and the Pricing button is settled: #22, #24, #26). `PROJECT_TYPE_VALUES` or the `/api/qualify` payload shape.

## Open, and Nate's to answer

- **Product Support has no matching pricing tier.** The other three services line up with one or more tiers; this one does not. A page that gestures at a price it cannot name is worse than one that stays silent. Do not invent a tier and do not link to a tier that is not the same thing.
- **How the home-page service cards reach these pages.** Today each card has one CTA into the modal. Adding a second affordance is a design call, not a builder call.
- **What sections a service page carries.** Nate's, in session.

## When it lands

- Every link works *from* a service page, not just from `/`. Click each one from a service route. That is where root-relative failures actually show up.
- All four prerender to static HTML. No top-level client component.
- Wordmark handoff at 80px matches `/pricing` on all four.
- `npm run typecheck`, `npm run lint`, `npm run build`, `npm run banned-terms` all green. No console errors.
- Docs updated: `docs/03-site-architecture.md` §Sitemap and §Navigation (two routes becomes six), `docs/06-taxonomy.md` (slugs now double as route segments), `docs/07-technical-spec.md` if it enumerates routes, and a decision row for the route shape. Several docs still describe the site as single-page; that was already wrong before this unit.
- Build note `briefs/build-notes/26-service-routes.md`: the route shape chosen and why, the structure as built, every copy slot still owner-owed with a draft for it, and anything that deviated.

## References

- `docs/decision-log.md` #8, #13, #14, #17, #19, #22–#26, plus unit 25's rows
- `docs/05-business-rules.md` §3.1, §3.2, §3.3, §4.1, §4.3
- `docs/04-ux-spec.md` v3.2 — the design system any new surface is built against
- `src/app/pricing/page.tsx` — the route pattern and four solved traps
- `src/components/service-cta.tsx`, `src/content/services.ts` — the card-to-modal seam
- `NextSketch_Brand_Philosophy_v1.docx`, `NextSketch_Messaging_Kit_v1.docx` (project docs) — positioning authority. **The Kit still marks Hero Option A as locked and it is wrong** (superseded by #18); do not "correct" the live hero.
