# CLI Specification — `create-softeneers-app`

The generator binary. This document is the contract for the implementation under
`apps/cli/src/`. The CLI is **implemented and verified** (copy → apply toggles →
transform → git init → install → next steps). It ships **five templates**, each
targeting a different kind of user, with composable `db`/`auth`/`docker` toggles:

| Template         | For                         | Toggles            |
| ---------------- | --------------------------- | ------------------ |
| `next-fullstack` | a full web + API monorepo   | (all-in)           |
| `express-api`    | a TypeScript REST API       | db · auth · docker |
| `hono-api`       | a fast, modern API          | db · auth · docker |
| `tanstack-start` | a fullstack React app       | db · auth · docker |
| `minimal`        | a zero-framework TS starter | (none)             |

Each template is build-verified: a generated project installs and builds across
its toggle combinations.

## Invocation

```bash
npx create-softeneers-app@latest my-app      # interactive
npm  create softeneers-app@latest my-app      # equivalent
```

### Arguments & flags

| Form                     | Meaning                                                             |
| ------------------------ | ------------------------------------------------------------------- |
| `<directory>` or `.`     | Target dir / project name; `.` scaffolds into the current directory |
| `--template <name>`      | Skip the template prompt (e.g. `next-fullstack`)                    |
| `--yes`, `-y`            | Accept all defaults, no prompts (CI-friendly)                       |
| `--db` / `--no-db`       | Force the database toggle on/off (else template default or prompt)  |
| `--auth` / `--no-auth`   | Force the auth toggle on/off                                        |
| `--docker` / `--no-docker` | Force the Docker toggle on/off                                    |
| `--no-install`           | Scaffold only; don't run the package manager install                |
| `--no-git`               | Don't run `git init`                                                |
| `--pm <npm\|pnpm\|yarn>` | Package manager (default: auto-detected from the invoker, else npm) |
| `--version`, `--help`    | Standard                                                            |

The default package manager is auto-detected from `npm_config_user_agent` (set
when run via `npm`/`pnpm`/`yarn create`), falling back to **npm**. The chosen PM
is written into the generated root `package.json` `packageManager` field (with
its real detected version) so Turborepo resolves the workspace; the template
itself ships both an npm `workspaces` field and `pnpm-workspace.yaml`, so the
generated project works under npm or pnpm.

## Prompt flow (interactive)

Built with `@clack/prompts`. Two steps choose the project; the rest are the
template's toggles, asked only for the toggles that template supports.

```
Project name:   my-app
Project type:   Fullstack (Next.js+Express) | Express API | Hono API
                | TanStack Start | Minimal
Include a database?         (y/N)   ← only if the template supports `db`
Include authentication?     (y/N)   ← only if the template supports `auth`
Include a Docker recipe?    (y/N)   ← only if the template supports `docker`
```

The menu is data-driven from the template registry (`templates.ts`), and the
toggle prompts are data-driven from each template's manifest (see below). A
toggle fixed on the command line (`--db`, `--no-auth`, …) skips its prompt;
`--yes` takes each template's default.

## Toggles & fragments

A template may ship a `softeneers.template.json` manifest declaring optional
features and their defaults:

```json
{
  "toggles": { "db": true, "auth": false, "docker": true },
  "fragments": {
    "db":   { "removePaths": ["src/db.ts", "src/scripts", "docker-compose.yml"],
              "removeDeps": ["@softeneers/db", "mysql2"],
              "removeScripts": ["db:migrate", "db:seed", "db:reset"] },
    "auth": { "removePaths": ["src/auth"], "removeDeps": ["@softeneers/auth"] },
    "docker": { "removePaths": ["docker-compose.yml"] }
  }
}
```

When a toggle is **off**, the engine (`fragments.ts`) deletes that fragment's
`removePaths`, strips its `removeDeps`/`removeScripts` from every `package.json`,
and removes conditional blocks from text files. Conditional blocks use comment
markers — `#if <toggle>` / `#if !<toggle>` … `#endif` — and nest; the marker
lines are always removed. The manifest itself is deleted from the output.
Templates with no manifest (e.g. `minimal`) support no toggles and copy as-is.

## Generation algorithm

```
1. Resolve target dir (".", a relative, or absolute path); refuse if it is
   non-empty (ignoring .git/.DS_Store). Project name = basename of the dir.
2. Select template dir from templates/<name> (default next-fullstack).
3. Resolve toggles from the template manifest + flags/prompts.
4. Copy recursively, EXCLUDING: node_modules, .next, dist, .turbo, *.log,
   and any real .env (only .env.example is copied).
5. Apply toggles: delete OFF fragments' paths, prune deps/scripts, strip marker
   blocks, remove the manifest.
6. Transform the copy:
     - root package.json: set "name" + pin "packageManager".
     - generate .env from every .env.example.
     - substitute {{PROJECT_NAME}} in the README.
7. git init (unless --no-git).
8. Install dependencies with the chosen PM (unless --no-install).
9. Print next steps (conditional on the enabled toggles).
```

### Copy exclusions (authoritative list)

`node_modules`, `.next`, `out`, `build`, `dist`, `.turbo`, `.git`,
`*.log`, `.DS_Store`, `.env`, `.env.*` (except `.env.example`),
`package-lock.json` / `pnpm-lock.yaml` (regenerated on install). The
`softeneers.template.json` manifest is consumed during generation and never
written to the output.

## Final output

```
Done.

Next steps:

  cd my-app
  pnpm install
  docker compose up -d        # start MySQL
  pnpm dev

Your app: http://localhost:3000   API: http://localhost:4000
```

## Implementation notes

- Runtime deps are minimal: `@clack/prompts` only; everything else from Node's
  stdlib (`fs`, `path`, `child_process`, `url`).
- Source layout (`apps/cli/src/`): `args.ts` (argv parsing + `CliError`),
  `templates.ts` (registry + path resolver), `fragments.ts` (manifest + toggle
  engine), `scaffold.ts` (copy/transform/git/install), `prompts.ts` (clack
  wizard), `index.ts` (orchestration).
- **Template bundling (decided):** templates resolve at runtime from, in order,
  (1) `<pkg>/templates/<slug>` and (2) the monorepo `<pkg>/../../templates/<slug>`.
  The build (`scripts/copy-templates.mjs`, run after `tsc`) copies the monorepo
  `templates/` into `apps/cli/templates/` so the published package — whose `files`
  includes `templates` — is self-contained. That copied dir is a build artifact
  and is gitignored; candidate (2) covers local dev without the copy.
- Exit codes: `0` success, `1` user error (bad args, dir exists, unavailable
  template), `2` internal.
