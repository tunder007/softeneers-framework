# Softeneers Framework — Documentation

Start here. Suggested reading order:

1. **[ARCHITECTURE.md](./ARCHITECTURE.md)** — what the framework is, the monorepo
   layout, the package-vs-template distinction, conventions.
2. **[ROADMAP.md](./ROADMAP.md)** — the sprints, the MVP, and current status
   (the source of truth for "what's done").
3. **[CLI-SPEC.md](./CLI-SPEC.md)** — the `create-softeneers-app` contract:
   prompts, flags, and the copy/transform algorithm.
4. **[PACKAGES.md](./PACKAGES.md)** — the contract for each `@softeneers/*` package.
5. **[DECISIONS.md](./DECISIONS.md)** — authoritative decisions / tiebreakers.
   When two docs seem to conflict, this file wins.
6. **[PUBLISHING.md](./PUBLISHING.md)** — how the packages get to npm.

Related, at the repo root: [`../README.md`](../README.md) (overview),
[`../CONTRIBUTING.md`](../CONTRIBUTING.md) (setup + conventions),
[`../TODO.md`](../TODO.md) (original intent), [`../PROJECT-BENCHMARK.md`](../PROJECT-BENCHMARK.md)
(latest maturity benchmark), [`../CLAUDE.md`](../CLAUDE.md) (agent entry contract).
A browsable HTML version of these docs is generated into `apps/docs/dist/` by
`npm run build`.

## Conventions

- `.md` files are the AI-optimized source of truth.
- Every relative link in these docs must resolve (checked in CI via the docs
  link test).
- Status claims live in `ROADMAP.md`; other docs link to it rather than
  duplicating status.
