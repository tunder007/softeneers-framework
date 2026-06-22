# Publishing

The packages are **publish-ready but not yet published**. This is the process.

## What ships

| Package            | npm name                | Notes                         |
| ------------------ | ----------------------- | ----------------------------- |
| `apps/cli`         | `create-softeneers-app` | bundles `templates/` on build |
| `packages/config`  | `@softeneers/config`    | presets (no build step)       |
| `packages/env`     | `@softeneers/env`       | built to `dist/`              |
| `packages/db`      | `@softeneers/db`        | built to `dist/`              |
| `packages/auth`    | `@softeneers/auth`      | built to `dist/`              |
| `packages/email`   | `@softeneers/email`     | built to `dist/`              |
| `packages/storage` | `@softeneers/storage`   | built to `dist/`              |

Each declares `files`, `repository`, `license`, and (for scoped packages)
`publishConfig.access = "public"`. `create-softeneers-app` runs a
`prepublishOnly` that cleans + rebuilds so the published tarball contains
`dist/` and the bundled `templates/`.

## Pre-flight (do this first)

```bash
npm ci
npm run build && npm run lint && npm run typecheck && npm test
# Inspect each tarball's contents WITHOUT publishing:
npm pack --workspaces --dry-run
```

Confirm each tarball contains only `dist/` (+ `templates/` for the CLI) and the
README/LICENSE — no `src/`, tests, or node_modules.

## Publish

Order: publish `@softeneers/config` and `@softeneers/env` first (others may
depend on them), then the rest, then `create-softeneers-app` last.

```bash
npm publish -w @softeneers/config
npm publish -w @softeneers/env
npm publish -w @softeneers/db
npm publish -w @softeneers/auth
npm publish -w @softeneers/email
npm publish -w @softeneers/storage
npm publish -w create-softeneers-app
```

Scoped packages publish publicly via their `publishConfig.access`. Requires `npm
login` with rights to the `@softeneers` scope. **This step is intentionally not
automated and not performed by tooling — it is outward-facing and irreversible.**

## Versioning

Adopt [Changesets](https://github.com/changesets/changesets) before the first
public release so versions and changelogs are managed together. Until then, bump
versions manually and keep them in lockstep.
