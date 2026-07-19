This folder is for shadcn UI primitives only.

Don't trust model memory of shadcn, always use a tool to confirm. Shadcn components have seen several large migrations.

- DO NOT create non-shadcn components in this folder.
- DO NOT modify these components without using the `npx shadcn@latest` CLI tooling.
- These components should match upstream shadcn components, with the only changes allow are formatting (`pnpm fmt`).
- DO NOT use `npx shadcn@latest diff`, this CLI verb is deprecated. Use `npx shadcn@latest add <component> --diff`
  instead.
