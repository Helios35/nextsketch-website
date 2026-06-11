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

const contentDir = join(process.cwd(), "src", "content");
for (const file of walk(contentDir)) {
  if ([".ts", ".tsx"].includes(extname(file))) targets.push(file);
}

// Fail closed: a path typo must never read as a clean pass.
if (targets.length === 0) {
  console.error("banned-terms: nothing to scan — refusing to pass.");
  process.exit(1);
}

const hits = [];
for (const file of targets) {
  const raw = normalize(readFileSync(file, "utf8"));
  const surfaces = file.endsWith(".html") ? [raw, stripTags(raw)] : [raw];
  for (const { term, re } of PATTERNS) {
    if (surfaces.some((surface) => re.test(surface))) {
      hits.push({ file: relative(process.cwd(), file), term });
    }
  }
}

if (hits.length > 0) {
  for (const hit of hits) {
    console.error(`BANNED TERM "${hit.term}" in ${hit.file}`);
  }
  process.exit(1);
}
console.log(`banned-terms: clean (${targets.length} files scanned).`);
