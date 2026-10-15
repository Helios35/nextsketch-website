import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    // Every animation goes through the shared reduced-motion-aware
    // entry points (docs/00-project-setup.md §Accessibility & motion).
    // The three ignored files are the dormant sketch-era motion layer
    // (decision-log #13): no route renders them, and delete-vs-keep is
    // an open owner call (build-note 34).
    files: ["src/**/*.{ts,tsx}"],
    ignores: [
      "src/components/reveal.tsx",
      "src/components/sketch-accent.tsx",
      "src/lib/motion.ts",
    ],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "motion/react",
              message:
                "Animate with the CSS keyframes in globals.css behind motion-safe, triggered by <ScrollReveal> or <Parallax> (docs/04-ux-spec.md §Motion) — raw motion imports skip the reduced-motion gate.",
            },
          ],
        },
      ],
    },
  },
]);

export default eslintConfig;
