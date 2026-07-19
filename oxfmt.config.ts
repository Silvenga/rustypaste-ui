import { defineConfig } from "oxfmt";

export default defineConfig({
  ignorePatterns: ["*.md"],
  sortImports: {
    newlinesBetween: false,
  },
  sortTailwindcss: true,
  sortPackageJson: true,
});
