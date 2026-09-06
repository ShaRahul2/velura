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
    // Local tooling scripts (CommonJS .cjs helpers, not app code):
    ".agents/**",
    "graphify-out/**",
    // Sentry-generated files:
    ".sentryclirc",
  ]),
  {
    rules: {
      // eslint-plugin-react-hooks@7 promoted this to an error. Several call
      // sites here are legitimate external-store synchronisation (persist
      // hydration flags, prop→state mirrors, carousel resets) rather than
      // cascading-render bugs. Keep it visible as a warning, not a CI failure.
      "react-hooks/set-state-in-effect": "warn",
    },
  },
]);

export default eslintConfig;
