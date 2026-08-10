# Build Note 19 — Apollo Visitor Tracking

**Date:** 2026-08-10 · **Branch:** `chore/apollo-visitor-tracking`
**Status:** Committed and pushed; **no PR** (owner policy — Nate opens the PR). The site side is done and verified locally. Two things are owner-gated and cannot be done from here: setting the Vercel env var, and confirming Apollo flips `data_received` to true (that needs a real visit to the live domain). Nothing was faked.

## The gap this closes

The site recorded pageviews but could not say **which company** a visitor came from. Next Sketch runs weekly cold outbound; a founder reading the email and then quietly looking at the site is the strongest buying signal in the funnel, and it was invisible. Apollo's side was already configured (`nextsketch.com` registered 2026-08-10); only the tag was missing.

## What shipped

- **New:** `src/components/apollo-tracker.tsx` — a Server Component that renders Apollo's snippet as an inline `next/script` with `strategy="beforeInteractive"`.
- **Changed:** `src/app/layout.tsx` — imports and mounts `<ApolloTracker />` next to the existing `<Analytics />`, plus a comment explaining that the two mount differently.
- **Env var:** `NEXT_PUBLIC_APOLLO_APP_ID`. Nothing else changed — no new dependency, no config change, no copy, design, routing or metadata change.

## Where it mounts, and why that placement

Apollo requires the tag in the document `<head>`, before the app renders. In the App Router that means `beforeInteractive` in the **root layout** — the Next 16 docs are explicit that `beforeInteractive` must live in the root layout and that such scripts "will always be injected inside the `head` of the HTML document regardless of where it's placed in the component."

I traced this in the installed version rather than trusting the docs alone (`AGENTS.md`: this is not the Next.js you know). In **Next 16.2.9**:

- `next/dist/client/script.js` (L274-293) — for an inline `beforeInteractive` script in the App Router, Next does **not** emit a raw `<script>`. It emits a tiny bootstrap that pushes `[0, {children, id}]` onto `self.__next_s`.
- `next/dist/client/app-bootstrap.js` (L23-51) — before hydration, `loadScriptsInSequence` walks that queue, does `el.innerHTML = props.children`, and `document.head.appendChild(el)`. Then, and only then, `hydrate()`.

So the snippet lands in `<head>` and executes ahead of all app code, which is exactly Apollo's stated requirement.

## Decisions / judgment calls

- **`dangerouslySetInnerHTML`, not JSX children.** The bootstrap assigns `el.innerHTML = props.children`, so the content has to arrive as a *single string*. JSX children can arrive as an array (template interpolation produces multiple children), which would stringify into a comma-joined mess. `dangerouslySetInnerHTML` is the path Next itself normalizes (script.js L277-281) and guarantees one string. This is also the brief's "executes as code, not as text" requirement — a raw `<script>` string in JSX renders as inert text.
- **App ID interpolated via `JSON.stringify`, not raw string concatenation.** It emits the quoted, escaped JS string literal, so a stray quote in the env value cannot break out of the surrounding script. With a normal ID the output is byte-identical to Apollo's snippet. The rest of the snippet is **verbatim**, per the brief.
- **`NEXT_PUBLIC_` prefix — deliberate, and a first for this project.** Every other env var here is server-only, and `07-technical-spec.md` says so explicitly. But this value is inlined into the browser payload by design; it is a public tracking id, not a secret, and the prefix labels it honestly. See *Deviations*.
- **Unset var renders `null`, silently.** No `console.warn`. This deliberately departs from the lead-pipeline convention (`lead-delivery.ts` logs loudly when a var is missing) because the cases differ: a missing `LEADS_SHEET_WEBHOOK_URL` **loses a lead**, whereas an absent tracking tag is a valid state. The brief asked for "no crash and no console noise".
- **Component in `src/components/`, not inlined into the layout.** Follows "single responsibility: one component, one job" (`00-project-setup.md`) and keeps the layout thin. Cost: one ESLint suppression (below).
- **Kept as a Server Component.** `onLoad`/`onError` would force `"use client"`, and Apollo's snippet already handles its own `o.onload` internally. No extra client JS.

## Deviations — flag at PR, not silently resolved

1. **First `NEXT_PUBLIC_` variable in the project.** `07-technical-spec.md` §Environment variables and `08-runbook.md` §Environment variables both state "**all server-only (no `NEXT_PUBLIC_`)**". That sentence is now false. The docs were not edited — doc changes are outside this unit's scope. **Needs a one-line doc fix.**
2. **`docs/07-technical-spec.md:103` says "No cookies → no cookie banner required."** Apollo does not set a cookie, but it *does* write persistent identifiers to `localStorage` (evidence below), which the ePrivacy consent rule treats the same way. That documented statement is now misleading. **See *Consent* below — this is Nate's call.**
3. **One ESLint suppression, with reason.** `@next/next/no-before-interactive-script-outside-document` fires on the component. It is a Pages Router guard whose source self-declares *"This rule shouldn't fire in `app/`"* — but it tests the **file's own path**, so it misfires on a component in `src/components/` even though it is only ever mounted from the App Router root layout. Suppressed inline with that reasoning, per the quality bar ("zero ESLint suppressions without an inline reason comment"). The alternative was moving the component into `src/app/`, which would break the project's file-structure convention. *(For the record: it is a warning, not an error — CI would have passed either way.)*
4. **Branch prefix `chore/`, not the `feature/<unit-slug>` in `00-project-setup.md`.** Per the brief, and consistent with recent history (`chore/arrow-icon`, `adhoc/header-logo-favicon`).

## Consent — Nate's call, flagged not resolved

The brief said Apollo sets a cookie. **Measured, it does not** — on a full load Apollo wrote no cookie. It persisted three keys to `localStorage`: `apolloAnonId`, `<appId>_canTrack`, `<appId>_eventQueue`. (The only cookie on the page was `__next_hmr_refresh_hash__`, which is Next's dev-mode HMR cookie and does not exist in production.)

**This does not change the legal question, and it is not a loophole.** The ePrivacy consent rule is about storing or accessing information on the user's device — it is technology-neutral, so `localStorage` counts the same as a cookie. `apolloAnonId` is a persistent pseudonymous identifier, i.e. personal data under GDPR, and company-resolution is not "strictly necessary" for delivering the site, so it does not fall under the strictly-necessary exemption.

One caveat on the evidence: on `localhost` Apollo's `can_track_visitor` returned `{"can_track": false}` (the domain gate — only `nextsketch.com` is registered), so I cannot rule out additional storage on the live domain once tracking is actually permitted. Worth re-checking after deploy.

**Recommendation — a judgment call about risk appetite, not a legal opinion:** ship it now. The exposure is small and the upside is the whole point of the unit. Enforcement realistically targets large-scale ad-tech, not a small B2B site doing company-level resolution, and the site takes no EU consumer traffic at volume. But do two cheap things soon: (a) add a line to the privacy policy naming Apollo and what it collects, which is the highest-value/lowest-effort mitigation; and (b) if EU founders become a real outbound segment, revisit properly — that is the trigger to add a consent gate. Building a banner now would be over-building for the current risk, which is why the brief told me not to.

If you would rather be conservative, the alternative is gating the tag behind a consent choice — a real unit of work, not a tweak, and it will suppress a meaningful share of the very signal you are buying.

## Verification

Run against `npm run dev` with the App ID set locally. All four CI gates green:

| Gate | Result |
|---|---|
| `npm run lint` | ✓ clean, exit 0 (0 errors, 0 warnings) |
| `npm run typecheck` | ✓ clean |
| `npm run build` | ✓ compiled, 5/5 static pages |
| `npm run banned-terms` | ✓ clean (27 files scanned) |

Checked in the browser on a fresh load, in the order the brief asks:

1. **The existing `/8c6f17ed16eac62e/` tracker still fires — checked first.** `window.va` is a live function, its script is in `<head>`, and the console shows the pageview going through: `[Vercel Web Analytics] Running queued event pageview {route: /, path: /}` → `[view] http://localhost:3000/ … /_vercel/insights/view`. *Locally it loads from `va.vercel-scripts.com/v1/script.debug.js`; the obfuscated first-party `/8c6f17ed16eac62e/` path is Vercel dashboard config (bypass-ad-blockers), not repo code — I grepped, nothing in the repo references that path, so this change cannot affect it.*
2. **Apollo requests the tracker on a fresh load.** `GET https://assets.apollo.io/micro/website-tracker/tracker.iife.js?nocache=ijp38`.
3. **Exactly once, not twice.** `document.querySelectorAll('script#apollo-tracker').length === 1` and exactly one `script[src*="apollo.io"]`. *Worth recording: the built HTML contains the snippet string twice — once as the real script, once inside the RSC flight payload (`__next_f`), which is data and is never executed. A naive grep count of the HTML looks like a double injection and isn't one; the DOM count is the check that matters.*
4. **It executes as code, not text, and reaches Apollo.** `window.trackingFunctions` is an object (set by Apollo's library, so the remote script genuinely loaded and initialised), and the App ID plumbed all the way through from the env var: `can_track_visitor?x_app_id=6a60f1a40ffd21000c2a5411` and `track_request?app_id=6a60f1a40ffd21000c2a5411`.
5. **Env var deliberately unset → clean load.** Removed `.env.local`, restarted: zero `#apollo-tracker` tags, `initApollo` undefined, no Apollo requests, no console output from this change — and Vercel Analytics still alive and firing its pageview.
6. **Nothing visible changed.** Screenshot compared against the pre-change page: hero, nav, marquee, CTA identical.

### One console error, and it is not ours to fix

On `localhost` the console shows `Failed to load resource: the server responded with a status of 400`. Traced by instrumenting `fetch`:

- `GET  …/can_track_visitor` → **200** `{"can_track": false}`
- `POST …/track_request` → **400**

That is **Apollo's domain gate**: `nextsketch.com` is registered, `localhost:3000` is not, so Apollo declines the visitor and rejects the event. It disappeared entirely when the env var was unset, confirming the source. It is a local-dev artifact and should not occur on the live domain — but **that is the one claim in this note I could not prove locally**, because the only place it can be proved is the registered domain. Glance at the console once after deploy.

## Open for Nate

1. **Set the env var in Vercel** (Production **and** Preview — Preview so branch deploys behave the same):
   `NEXT_PUBLIC_APOLLO_APP_ID` = `6a60f1a40ffd21000c2a5411`
   Note it is inlined at build time, so **rotating it needs a redeploy**, not just an env edit.
2. **Merge and deploy**, then load `nextsketch.com` once and confirm in DevTools: the Apollo tracker request appears once, and there is no 400 (see above).
3. **Confirm it worked the real way:** Apollo currently reports `data_received: false` for `nextsketch.com`. After a real visit lands it flips to true. That, not the page source, is the check.
4. **Decide the consent question** above.
5. **Two one-line doc fixes** when convenient (deviations 1 and 2): the "all server-only / no `NEXT_PUBLIC_`" claim, and the "no cookies → no cookie banner required" claim.

*Local note: I left a gitignored `.env.local` containing the App ID so the tag works in local dev. Delete it if you'd rather not have localhost firing rejected events at Apollo.*

## What this gives (and doesn't)

Company-level visits — "someone at Chamelio hit the site". **Not** named individuals; person-level identification is a separate paid Apollo add-on and is not enabled.

## References

- `src/components/apollo-tracker.tsx` · `src/app/layout.tsx`
- Next 16.2.9 internals traced: `node_modules/next/dist/client/script.js` (L274-293), `node_modules/next/dist/client/app-bootstrap.js` (L23-51)
- `node_modules/next/dist/docs/01-app/03-api-reference/02-components/script.md` (`beforeInteractive` placement + the inline-script `id` requirement)
- `docs/07-technical-spec.md` (§Environment variables, and the cookie claim at L103) · `docs/08-runbook.md` (§Environment variables)
- D-30 (website visitors as the highest-intent uncaptured signal) · D-31 (visitor tracking as a standing blocker) · `claude/outbound/measurement-state-2026-08-10.md`
