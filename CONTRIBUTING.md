# Contributing

## Setup

```bash
npm ci          # reproducible install (npm-first; pnpm also works)
npm run build   # build all packages + the CLI
npm test        # docs-link test + per-package node:test suites
```

`npm run lint`, `npm run typecheck`, and `npm run format` round out the local
gates. CI (`.github/workflows/ci.yml`) runs all of them on every push/PR.

## Conventions

Read [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) and, when anything seems to
conflict, [`docs/DECISIONS.md`](./docs/DECISIONS.md) — the authoritative
tiebreaker. The essentials:

- **npm-first, PM-agnostic.** Don't introduce pnpm-only or npm-only assumptions.
- **Build tooling lives at the root.** Packages declare only their runtime deps.
- **Templates are payload** — never workspace members, never import `@softeneers/*`
  from this repo.
- Tasks go through Turbo (`npm run build`/`test`); lint is one root `eslint .` pass.

## Adding a `@softeneers/*` package

1. `packages/<name>/` with `package.json` (`type: module`, `dist` in `files`,
   build/typecheck/test scripts), `tsconfig.json` extending
   `@softeneers/config/tsconfig/base.json`, `src/index.ts`, a `test/*.test.mjs`
   suite, and a `README.md`.
2. Document its contract in [`docs/PACKAGES.md`](./docs/PACKAGES.md).
3. `npm install` then `npm run build && npm test`.

## Adding a template

Add `templates/<name>/` (self-contained, both workspace configs, no
`node_modules`), register it in `apps/cli/src/templates.ts`, and verify with a
`--yes` generation that installs and builds. See
[`docs/CLI-SPEC.md`](./docs/CLI-SPEC.md).
