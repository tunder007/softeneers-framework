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
Each doc has a committed, human-readable `.html` companion beside it (e.g.
[`ARCHITECTURE.html`](./ARCHITECTURE.html) next to `ARCHITECTURE.md`), with a
browsable [`index.html`](../index.html) at the repo root. These are generated
from the Markdown by `apps/docs` (`npm run build`) — never hand-edit them. The
deployed, public marketing+docs site is live at
<https://softeneers-landing.vercel.app> (source in `apps/landing`).

## Conventions

- `.md` files are the AI-optimized source of truth; their `.html` companions are
  the generated human view (see [DECISIONS.md](./DECISIONS.md) D-07).
- Every relative link in these docs must resolve (checked in CI via the docs
  link test).
- Status claims live in `ROADMAP.md`; other docs link to it rather than
  duplicating status.
