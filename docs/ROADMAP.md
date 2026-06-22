# Roadmap

Derived from `TODO.md` §10 (implementation order) and §14 (the MVP). Each sprint
is a shippable increment. Status is tracked here as the source of truth.

## The MVP (TODO §14)

A working `npx create-softeneers-app my-app` that generates:

```
my-app/
  apps/web, apps/server
  packages/config, packages/env
  package.json, pnpm-workspace.yaml, turbo.json, docker-compose.yml, README.md
```

If that works end-to-end, the foundation of the framework exists. Everything
after the MVP is additive.

## Sprint status

| Sprint | Goal                                                           | Status   |
| ------ | -------------------------------------------------------------- | -------- |
| 0      | Scaffold: monorepo skeleton, docs, template relocation         | ✅ done  |
| 1      | Monorepo setup (pnpm + turbo + Next/Express template + README) | ✅ done¹ |
| 2      | CLI that copies the template (`create-softeneers-app`)         | ✅ done  |
| 3      | `@softeneers/config` + `@softeneers/env` + lint/format         | ✅ done  |
| 4      | `@softeneers/db` + Docker MySQL + migrations + seed            | ✅ done  |
| 5      | `@softeneers/auth` (better-auth) + login/register template     | ✅ done  |
| 6      | `@softeneers/email` (Resend + React Email)                     | ✅ done  |
| 7      | `@softeneers/storage` (S3-compatible) + upload helper          | ✅ done  |
| 8      | Docs site + examples + `npm publish`                           | ✅ done² |
| 9      | Multi-template generator: 5 templates + db/auth/docker toggles  | ✅ done³ |

¹ The template is relocated and standalone. Converting it to _consume_ the
published `@softeneers/*` packages happens post-publish.

² Docs site (`apps/docs`, committed HTML companions generated from the Markdown)
and publishing are done: `create-softeneers-app` and the six `@softeneers/*`
packages are live on npm (0.1.0). See [`PUBLISHING.md`](./PUBLISHING.md).

³ The generator now ships five templates — `next-fullstack`, `express-api`,
`hono-api`, `tanstack-start`, `minimal` — so different users pick the stack that
fits. The API/fullstack templates carry the full feature set (cars CRUD, health,
example data) with composable `db` (MySQL/Sequelize via `@softeneers/db` vs an
in-memory store), `auth` (`@softeneers/auth`/better-auth), and `docker` toggles.
Each is build-verified across its toggle combinations; runtime e2e (live DB/auth)
is validated against published packages. Manifest + marker engine: `fragments.ts`.

## What "done" already covered (Sprint 0)

- [x] Repo restructured into the `softeneers-framework` monorepo
- [x] npm `workspaces` + `pnpm-workspace.yaml`, `turbo.json`, root `package.json`
- [x] `apps/cli` scaffold (bin wired, generation stubbed)
- [x] `packages/config`, `packages/env` stubs with documented contracts
- [x] Monolith moved into `templates/next-fullstack` (web + server), deps stripped
- [x] Template root files + `docker-compose.yml`
- [x] Design docs: ARCHITECTURE, ROADMAP, CLI-SPEC, PACKAGES
- [x] Framework README

## Sprint 2 — the CLI (done)

Implemented under `apps/cli/src/` per `CLI-SPEC.md`:

1. **Copy.** `create-softeneers-app <dir>` copies `templates/next-fullstack`,
   excluding `node_modules`/`.next`/`dist`/`.turbo`/lockfiles/real `.env`.
2. **Transform.** Rewrites root `package.json` `name`, generates `.env` from every
   `.env.example`, substitutes `{{PROJECT_NAME}}` in the README.
3. **Prompts.** `@clack/prompts` wizard (project name + template select; other
   templates shown as "coming soon"), gated behind `--yes`/`--template`.
4. **Verified end-to-end:** `--yes` generation produces the expected tree; a real
   `pnpm install` succeeds and **both apps build** (`server` `tsc` ✓, `web`
   `next build` ✓). Edge cases covered: `--help`/`--version`, unavailable
   template, unknown option, non-empty target dir.

> Remaining for full parity: granular stack sub-prompts (ORM/auth/email/storage)
> activate as their templates land; runtime `docker compose up` + `db:migrate`
> verification needs a Docker host (not run in CI yet).

## Sprint 3 — config + env + lint/format (done)

- `@softeneers/config`: real `tsconfig/base.json`, flat ESLint preset, Prettier
  preset; lint stack declared as `peerDependencies`.
- `@softeneers/env`: `createEnv({ schema })` over Zod, returns a frozen typed
  object, throws `EnvValidationError` with a readable summary; smoke-tested.
- Dogfooded: CLI extends the base tsconfig; root `eslint.config.js` /
  `prettier.config.js` use the presets; `npm run lint` / `format` / `typecheck`
  pass.

> **npm-first / PM-agnostic** was folded in here per scope guidance: the repo,
> the template, and the CLI work with **npm or pnpm**. Concretely — npm
> `workspaces` + `pnpm-workspace.yaml` both ship; `package-lock.json` is the
> committed lockfile (pnpm-lock gitignored); the CLI auto-detects the PM
> (default npm), supports `create-softeneers-app .` (current dir), and writes the
> generated `packageManager` field to match. Verified: a generated project
> installs and builds under **npm** end-to-end.

> Build-tooling note: tooling is hoisted to the root (one shared copy). Declaring
> `typescript`/`tsx` per-package made npm leave dangling `.bin` symlinks; and a
> workspace package owning the typescript-eslint dep graph crashed npm's link
> resolver — both avoided by keeping tooling at the root and using peerDeps in
> `@softeneers/config`.

> Still deferred: converting the `next-fullstack` template to _consume_ the
> published `@softeneers/config`/`env` (awaits publish, Sprint 8).

## Definition of done per package (Sprints 3–7)

A `@softeneers/*` package is "real" when it: has source under `src/`, builds to
`dist/`, exports the contract in `PACKAGES.md`, is not `private`, and has a
`node:test` suite. All six (`config`, `env`, `db`, `auth`, `email`, `storage`)
meet this. Template _consumption_ of the published packages is the remaining
post-publish step.

## Publishing

See [`PUBLISHING.md`](./PUBLISHING.md) for the order, the `npm pack` pre-flight,
and the (manual) publish commands.

## Quality benchmark

Scored with `softeneers-tools` (deterministic-checker, composed into
project-benchmark). Latest summary lives in [`../PROJECT-BENCHMARK.md`](../PROJECT-BENCHMARK.md).

| Metric (project-benchmark) | Baseline (Sprint 3) | Final                  |
| -------------------------- | ------------------- | ---------------------- |
| Maturity                   | 4.4 / 10 (L1)       | 6.1 / 10 (L3 Rigorous) |
| docs                       | 3.1                 | 8                      |
| code                       | 4.5                 | 7.3                    |
| rigor                      | 3                   | 8                      |
| governance                 | 5.5                 | 8                      |
| ai-optimization            | 8.8                 | 9.2                    |

deterministic-checker: **AI-opt 9.2 · Determinism 7.7 · Composite 8.5 / 10**,
zero P0/P1 findings. The lagging dimensions are softeneers-ecosystem conventions
satisfied differently on purpose: **human** uses a generated docs site
(`apps/docs/dist`) rather than committed `.html` companions; **tooling** uses
standard npm/Turbo scripts + CI rather than `.claude/skills` shells.
