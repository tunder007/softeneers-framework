# create-softeneers-app

The Softeneers Framework project generator. Run it to scaffold a new project
from one of the bundled templates:

```bash
npx create-softeneers-app@latest my-app
```

## Templates

Five templates, each for a different kind of user, with composable toggles:

| Template         | What you get                              | Toggles            |
| ---------------- | ----------------------------------------- | ------------------ |
| `next-fullstack` | Next.js web + Express/Sequelize/MySQL API | (all-in)           |
| `express-api`    | Express 5 + TypeScript REST API (cars CRUD) | db · auth · docker |
| `hono-api`       | Hono + TypeScript API (cars CRUD)         | db · auth · docker |
| `tanstack-start` | TanStack Start fullstack React app        | db · auth · docker |
| `minimal`        | Zero-framework Node + TypeScript starter  | (none)             |

```bash
npx create-softeneers-app@latest my-app                       # interactive
npx create-softeneers-app@latest api -t express-api --yes      # all defaults
npx create-softeneers-app@latest api -t hono-api --no-auth --no-docker
```

Flags: `--template <slug>`, `--yes`/`-y`, `--db`/`--no-db`, `--auth`/`--no-auth`,
`--docker`/`--no-docker`, `--no-install`, `--no-git`, `--pm <pnpm|npm|yarn>`,
`--help`, `--version`. See
[`../../docs/CLI-SPEC.md`](../../docs/CLI-SPEC.md) for the full contract.

## Local development

```bash
npm run build -w create-softeneers-app    # tsc + bundle templates → dist/ + templates/
node apps/cli/dist/index.js my-app --yes  # run the built CLI
npm run dev  -w create-softeneers-app -- my-app   # run from source via tsx
```
