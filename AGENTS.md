# rustypaste-ui

## Stack

React 19 + TypeScript (strict) + Vite 8 + Tailwind 4. Bundled into a single HTML file via `vite-plugin-singlefile` - the
production output is `dist/index.html`, served directly by a rustypaste server.

All dependencies must be inlined into this single HTML file.

## Conventions

- Imports:
    - Use `@/` path alias for `src/` (e.g. `import { useAuth } from "@/components/useAuth.ts"`).
    - Include the `.ts`/`.tsx` extension in import paths - `verbatimModuleSyntax` is enabled.
    - oxfmt sorts imports automatically. Do not add blank lines between import groups.
- API clients:
    - One file per endpoint in `src/api/`.
    - Each exports an async function taking a typed args object (token, instanceUrl, signal).
    - Always expose an optional signal.
- Components:
    - Shadcn primitives are stored in `src/components/ui/`. Do not create non-shadcn components in this folder.
    - Feature sections in `src/components/sections/<feature>/`.
    - Shared components in `src/components/shared/`.
- Strict mode is enabled. Do not use `as any` or `@ts-ignore`.

## Testing

- Use `vitest` for unit tests. All hooks should have unit tests.
- Use sentence case for test names using the "When * then * should" format.

## Verification

```shell
pnpm fmt
pnpm lint
pnpm build
```

## Dev environment

```shell
docker compose --project-directory ./dev/ up --detach --remove-orphans --renew-anon-volumes
pnpm dev
```

The dev server runs on `http://localhost:5173` and proxies Rustypaste requests to a local rustypaste container on
port `5174`.

Use `dev-token` for authentication.

