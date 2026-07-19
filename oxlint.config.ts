import { defineConfig } from "oxlint";

export default defineConfig({
  plugins: ["react", "typescript", "jsx-a11y"],
  env: {
    browser: true,
    es2020: true,
  },
  ignorePatterns: ["dist"],
  categories: {
    correctness: "warn",
  },
  rules: {
    "jsx-a11y/prefer-tag-over-role": "off",
  },
  overrides: [
    {
      files: ["src/components/ui/**/*.{ts,tsx}"],
      rules: {
        "jsx-a11y/click-events-have-key-events": "off",
        "jsx-a11y/no-noninteractive-element-interactions": "off",
      },
    },
  ],
});
