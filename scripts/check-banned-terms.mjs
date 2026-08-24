/**
 * Banned-terms gate — Business Rules 3.2 (banned language) and 3.4
 * (retired brand sweep). Scans the built HTML/RSC output and the
 * src/content source surface; any hit fails the build.
 *
 * Run after `next build` (CI runs it as the final step).
 */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { extname, join, relative } from "node:path";

// Rule 3.2 grep targets + Rule 3.4 retired-brand sweep.
const TERMS = [
  "get started",
  "free consultation",
  "book a call",
  "schedule a call",
  "request a quote",
  "contact us",
  "learn more",
  "automation", // singular and plural are both banned (Rule 3.2)
  "automations",
  "ai-powered",
  "full-service agency",
  "end-to-end solutions",
  "award-winning",
  "passionate about",
  "let's explore",
  "let's chat",
  "innovative solutions",
  "digital transformation",
  "leverage ai",
  "autonomous whales",
  "industrial design",
  "mechanical design",
  "manufacturability",
];

/**
 * Narrowly sanctioned exceptions — owner-ratified phrases that contain
 * a banned term in a use the rule was not written against.
 *
 * Rule 3.4's retired-brand sweep exists to stop the retired *service
 * lines* reappearing as current offers. The About section's biography
 * (owner-authored 2026-08-24) says where Nathan trained, not what
 * NextSketch sells, so the term is doing the opposite job there.
 *
 * An entry is `{ phrase, source, count }` and is enforced two ways.
 *
 * 1. **Scoped strip.** The phrase is removed from a scanned surface
 *    before the banned patterns run — but on the *source* surface only
 *    for the one file it is ratified for. Put the same clause in a
 *    service card and that file still fails, because the carve-out
 *    does not apply there. Built HTML/RSC is stripped unconditionally
 *    (rendered copy cannot be attributed back to a source file), which
 *    is safe precisely because the source check above it is not.
 * 2. **Ratification pass.** The phrase must appear in its declared
 *    source exactly `count` times. Fewer means the copy moved or was
 *    reworded and the entry is stale — a bypass nobody is using any
 *    more. More means an unratified second use. Either fails the
 *    build, so the exemption cannot outlive the sentence it was
 *    granted for.
 *
 * A first cut of this stripped globally and unscoped. Adversarial
 * review caught it: a services card reading "We sell what I started in
 * industrial design" passed clean, which is exactly the retired
 * service line Rule 3.4 exists to stop. Keep entries long, specific,
 * and scoped.
 *
 * ⚠ OWED: a decision-log entry and a §3.4 amendment recording the
 * carve-out. Flagged, not yet written.
 */
const ALLOWED = [
  {
    phrase: "I started in industrial design",
    source: join("src", "content", "copy.ts"),
    count: 1,
  },
];

const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Lookaround boundaries instead of \b: "automation" must not fire
// inside "automational"-style words, and \b misbehaves around
// apostrophes/hyphens. Spaces match any whitespace run (markup-safe).
const PATTERNS = TERMS.map((term) => ({
  term,
  re: new RegExp(
    `(?<![a-z0-9])${escapeRe(term).replace(/ /g, "\\s+")}(?![a-z0-9])`,
    "i",
  ),
}));

// Normalize before matching: React SSR escapes apostrophes as HTML
// entities; flight payloads escape U+2019 as ’; copy may use
// typographic apostrophes directly.
const normalize = (s) =>
  s
    .replace(/&#x27;|&#39;|&apos;|&rsquo;/gi, "'")
    .replace(/’/g, "'")
    .replace(/\\u2019/g, "'");

// Strip tags to spaces so terms split across inline elements
// ("Get<em> Started</em>") still match.
const stripTags = (s) => s.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");

function* walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(path);
    else yield path;
  }
}

const targets = [];

const builtDir = join(process.cwd(), ".next", "server", "app");
if (!existsSync(builtDir)) {
  console.error(
    "banned-terms: .next/server/app not found — run `next build` first.",
  );
  process.exit(1);
}
for (const file of walk(builtDir)) {
  if ([".html", ".rsc"].includes(extname(file))) targets.push(file); // includes *.prefetch.rsc
}

// Source files are tracked separately: the sanctioned-phrase strip is
// scoped by source path, and the ratification pass runs over them.
const sourceTargets = [];
const contentDir = join(process.cwd(), "src", "content");
for (const file of walk(contentDir)) {
  if ([".ts", ".tsx"].includes(extname(file))) {
    targets.push(file);
    sourceTargets.push(file);
  }
}

// Fail closed: a path typo must never read as a clean pass.
if (targets.length === 0) {
  console.error("banned-terms: nothing to scan — refusing to pass.");
  process.exit(1);
}

// A gap inside a sanctioned phrase must tolerate everything the banned
// patterns tolerate. A ban hit on EITHER surface fails the file, while
// an exemption only clears the surface it matches on — so whitespace
// tolerance alone is not enough: an inline accent span, or React's
// `<!-- -->` adjacent-text separator, strips clean from the tag-free
// surface yet leaves the term contiguous on `raw`. Counting tags as gap
// cannot widen the carve-out past a tag, since `[^>]*` never crosses a
// `>`; the worst case is a false positive, which fails closed.
const GAP = "(?:\\s|<[^>]*>)+";
const ALLOWED_ENTRIES = ALLOWED.map((entry) => ({
  ...entry,
  re: new RegExp(escapeRe(entry.phrase).replace(/ /g, GAP), "gi"),
}));

// Ratification pass: each sanctioned phrase must appear in its declared
// source exactly `count` times. Too few means the copy was reworded and
// the entry is now a bypass nobody uses; too many means an unratified
// second use. Both fail, so an exemption cannot outlive its sentence.
for (const entry of ALLOWED_ENTRIES) {
  const path = join(process.cwd(), entry.source);
  const found = existsSync(path)
    ? (normalize(readFileSync(path, "utf8")).match(entry.re) ?? []).length
    : 0;
  if (found !== entry.count) {
    console.error(
      `banned-terms: sanctioned phrase ${JSON.stringify(entry.phrase)} ` +
        `appears ${found}x in ${entry.source}, expected ${entry.count}x. ` +
        `If the copy changed, update or remove the ALLOWED entry — an ` +
        `exemption must never outlive the copy it was granted for.`,
    );
    process.exit(1);
  }
}

/**
 * Built HTML/RSC is stripped unconditionally: rendered copy cannot be
 * attributed back to a source file. That is safe only because the
 * source surface below is scoped — an unratified use in another
 * content file fails there before this permissiveness matters.
 */
const stripBuilt = (s) =>
  ALLOWED_ENTRIES.reduce((acc, e) => acc.replace(e.re, " "), s);

/** Source surface: only the file an entry is actually ratified for. */
const stripSource = (s, file) =>
  ALLOWED_ENTRIES.reduce(
    (acc, e) => (file === e.source ? acc.replace(e.re, " ") : acc),
    s,
  );

const hits = [];
for (const file of targets) {
  const raw = normalize(readFileSync(file, "utf8"));
  const rel = relative(process.cwd(), file);
  const strip = sourceTargets.includes(file)
    ? (s) => stripSource(s, rel)
    : stripBuilt;
  const surfaces = (
    file.endsWith(".html") ? [raw, stripTags(raw)] : [raw]
  ).map(strip);
  for (const { term, re } of PATTERNS) {
    if (surfaces.some((surface) => re.test(surface))) {
      hits.push({ file: relative(process.cwd(), file), term });
    }
  }
}

if (hits.length > 0) {
  for (const hit of hits) {
    console.error(`BANNED TERM "${hit.term}" in ${hit.file}`);
    // Without this note, a misfiring exemption reads as brand-new
    // banned copy — and the obvious "fix" is to reword owner copy that
    // was never the problem.
    const sanctioned = ALLOWED.filter((e) =>
      e.phrase.toLowerCase().includes(hit.term),
    );
    if (sanctioned.length > 0) {
      console.error(
        `  note: this term is sanctioned inside ` +
          `${sanctioned.map((e) => JSON.stringify(e.phrase)).join(", ")} ` +
          `(ratified for ${sanctioned.map((e) => e.source).join(", ")}). ` +
          `If that is the copy that hit, the exemption did not match — ` +
          `check for markup splitting the phrase, or a use outside the ` +
          `file it is ratified for, before rewording owner copy.`,
      );
    }
  }
  process.exit(1);
}
console.log(`banned-terms: clean (${targets.length} files scanned).`);
