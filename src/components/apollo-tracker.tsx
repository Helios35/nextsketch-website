import Script from "next/script";

/**
 * The App ID is configuration, not a literal, so it can be rotated in
 * Vercel env without a code change. `NEXT_PUBLIC_` because the value is
 * inlined into the browser payload — it is a public tracking id, not a
 * secret, and the prefix says so honestly (this is the first such var;
 * every other one in the project is server-only).
 */
const APOLLO_APP_ID = process.env.NEXT_PUBLIC_APOLLO_APP_ID?.trim();

/**
 * Apollo's snippet, verbatim, with only the App ID lifted out to config.
 * `JSON.stringify` emits the quoted, escaped JS string literal so a stray
 * quote in the env value can't break out of the surrounding script.
 */
const apolloSnippet = (appId: string) =>
  `function initApollo(){var n=Math.random().toString(36).substring(7),o=document.createElement("script");o.src="https://assets.apollo.io/micro/website-tracker/tracker.iife.js?nocache="+n,o.async=!0,o.defer=!0,o.onload=function(){window.trackingFunctions.onLoad({appId:${JSON.stringify(appId)}})},document.head.appendChild(o)}initApollo();`;

/**
 * Apollo website visitor tracking. Resolves anonymous traffic to the
 * company it came from, which is what makes a cold-outbound reader's
 * quiet visit to the site visible at all.
 *
 * `beforeInteractive` is Apollo's stated placement requirement, not a
 * preference: Next injects it into the document `<head>` and its runtime
 * executes it before hydration, ahead of any app code (verified against
 * `next/dist/client/{script,app-bootstrap}.js` in Next 16.2.9). The
 * strategy also means placement in the tree below is irrelevant — this
 * self-hoists to `<head>` from wherever it is mounted in the root layout.
 *
 * `dangerouslySetInnerHTML` rather than JSX children: Next's bootstrap
 * assigns `el.innerHTML = props.children`, so the content has to reach it
 * as a single string. A raw `<script>` string in JSX would render as
 * inert text instead of executing.
 *
 * Unset App ID renders nothing — the site loads clean and silently, and
 * the existing first-party tracker is untouched. Deliberately no console
 * warning here (unlike the server-side lead pipeline, where a missing var
 * costs a lead): an absent tag is a valid state, not a failure.
 */
export function ApolloTracker() {
  if (!APOLLO_APP_ID) return null;

  return (
    // eslint-disable-next-line @next/next/no-before-interactive-script-outside-document -- the rule is a Pages Router guard and self-declares "this rule shouldn't fire in `app/`", but it tests the file's own path, so it misfires on a component in src/components/. This is only ever mounted from the App Router root layout, which is exactly where the Next 16 docs require beforeInteractive to live.
    <Script
      id="apollo-tracker"
      strategy="beforeInteractive"
      dangerouslySetInnerHTML={{ __html: apolloSnippet(APOLLO_APP_ID) }}
    />
  );
}
