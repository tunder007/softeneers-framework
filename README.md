# Softeneers Framework

A **modular fullstack project generator**. Not a from-scratch framework — a CLI
plus reusable packages built on top of established tools (Next.js, Express,
Sequelize/MySQL, better-auth, Docker). The goal is one command:

```bash
npx create-softeneers-app@latest my-app
```

…that scaffolds an organized, scalable, standardized project from a template.

> **Status:** all sprints complete. The monorepo, the `next-fullstack` template,
> the CLI, and all six `@softeneers/*` packages (config, env, db, auth, email,
> storage) are built, tested, and publish-ready (the actual `npm publish` is
> manual — see [`docs/PUBLISHING.md`](./docs/PUBLISHING.md)).
> `create-softeneers-app` generates an installable, buildable project (verified
> under npm). See [`docs/ROADMAP.md`](./docs/ROADMAP.md).

## Monorepo map

```
apps/
  cli/          create-softeneers-app — the generator (working)
  docs/         static docs site, generated from the Markdown (npm run build)
packages/
  config/       @softeneers/config — shared tsconfig/eslint/prettier
  env/          @softeneers/env — env validation (Zod)
  db/           @softeneers/db — Sequelize/MySQL factory + helpers
  auth/         @softeneers/auth — better-auth + Express helpers
  email/        @softeneers/email — Resend + React Email templates
  storage/      @softeneers/storage — S3-compatible (S3/R2/MinIO)
templates/
  next-fullstack/   Next.js + Express + Sequelize + MySQL (seeded from a working monolith)
```

Built with **npm workspaces + Turborepo** (npm-first; pnpm also works). Node ≥ 18.

## Documentation

| Doc                                              | What's in it                                         |
| ------------------------------------------------ | ---------------------------------------------------- |
| [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) | Layout, package vs template, data flow, conventions  |
| [`docs/ROADMAP.md`](./docs/ROADMAP.md)           | The 8 sprints, the MVP, current status               |
| [`docs/CLI-SPEC.md`](./docs/CLI-SPEC.md)         | `create-softeneers-app` prompts + algorithm          |
| [`docs/PACKAGES.md`](./docs/PACKAGES.md)         | Contract for each `@softeneers/*` package            |
| [`docs/DECISIONS.md`](./docs/DECISIONS.md)       | Authoritative decisions / tiebreaker                 |
| [`docs/PUBLISHING.md`](./docs/PUBLISHING.md)     | How packages get to npm                              |
| [`CONTRIBUTING.md`](./CONTRIBUTING.md)           | Setup, conventions, adding packages/templates        |
| [`TODO.md`](./TODO.md)                           | The original getting-started plan (source of intent) |

Full docs index: [`docs/README.md`](./docs/README.md).

## Working in this repo

npm-first, but pnpm works too (both workspace configs ship).

```bash
npm install         # install workspace deps
npm run build       # turbo run build across packages + apps
npm run dev         # turbo run dev
npm run lint        # eslint . (single root pass)
npm run typecheck
```

The `next-fullstack` template is standalone — to run the generated-style app
directly, see [`templates/next-fullstack/README.md`](./templates/next-fullstack/README.md).

## Try the generator (from source)

```bash
npm run build
node apps/cli/dist/index.js my-app --yes   # or: node apps/cli/dist/index.js .   (current dir)
```

## What's next

All eight sprints are complete. Remaining, post-publish work: run `npm publish`
([`docs/PUBLISHING.md`](./docs/PUBLISHING.md)), then wire the `next-fullstack`
template to consume the published `@softeneers/*` packages, and add more
templates (TanStack/Hono) and React Email/UI components.
