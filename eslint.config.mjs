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
                "Animate via <Reveal>/<SketchAccent> (or variants from @/lib/motion) only — raw motion imports skip the reduced-motion gate.",
            },
          ],
        },
      ],
    },
  },
]);

export default eslintConfig;
