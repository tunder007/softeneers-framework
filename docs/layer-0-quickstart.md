# Layer 0 — Quickstart

**Goal of this layer:** spin up a new project in any combination and see it run.
Nothing else. For what the packages do, go to
[Layer 1](./layer-1-packages.md); for deep per-package docs, go to
[Layer 2](./layer-2-reference/README.md).

## One command

```bash
npx create-softeneers-app@latest my-app
```

You'll be asked for a project name, a **template**, and (where the template
supports them) the **db / auth / docker** toggles. The generator copies the
template, applies your toggles, runs `git init`, and installs dependencies.

Then:

```bash
cd my-app
npm run dev
```

That's it — **one `npm run dev`** gives you a working, pre-seeded demo. No
database, Docker, or extra steps required for the default (in-memory) setup.

## The five templates

| Template         | What you get                                | Toggles            | Dev URL |
| ---------------- | ------------------------------------------- | ------------------ | ------- |
| `next-fullstack` | Next.js web + Express/Sequelize/MySQL API   | (all-in)           | :3000 / :4000 |
| `express-api`    | Express 5 + TypeScript REST API (cars CRUD) | db · auth · docker | :4000 |
| `hono-api`       | Hono + TypeScript API (cars CRUD)           | db · auth · docker | :4000 |
| `tanstack-start` | TanStack Start fullstack React app          | db · auth · docker | :3000 |
| `minimal`        | Zero-framework Node + TypeScript starter    | (none)             | — |

## The toggles

Each toggle defaults **off**, so the default project is a lean, zero-setup demo.
Turn one on to add that capability:

| Toggle       | On adds…                                                                  |
| ------------ | ------------------------------------------------------------------------- |
| `--db`       | MySQL via [`@softeneers/db`](./layer-2-reference/db.md) — **falls back to in-memory if unreachable** |
| `--auth`     | email+password via [`@softeneers/auth`](./layer-2-reference/auth.md) at `/api/auth/*` (+ sign-in/up UI in `tanstack-start`) |
| `--docker`   | `docker-compose.yml` with a MySQL service                                 |
| `--email`    | transactional email via [`@softeneers/email`](./layer-2-reference/email.md) (`POST /api/email/welcome`) |
| `--storage`  | S3/R2/MinIO uploads via [`@softeneers/storage`](./layer-2-reference/storage.md) (`/api/files/*`) |
| `--payments` | Stripe checkout + subscriptions + portal + webhook via [`@softeneers/payments`](./layer-2-reference/payments.md) (+ `/billing` UI) — just paste your keys |

> **Every combination runs with one `npm run dev`.** With `--db` and no database
> running, the app starts on the pre-seeded in-memory store and tells you how to
> switch to MySQL — it never fails to boot. (See [DECISIONS.md](./DECISIONS.md) D-08.)

## Spinning up each combination

```bash
# Interactive (pick template + toggles in the wizard)
npx create-softeneers-app@latest my-app

# A REST API, defaults (in-memory, instant demo)
npx create-softeneers-app@latest api -t express-api --yes

# A fast Hono API with no Docker, no auth
npx create-softeneers-app@latest api -t hono-api --no-auth --no-docker --yes

# A fullstack React app with the full stack (MySQL + auth + Docker)
npx create-softeneers-app@latest web -t tanstack-start --db --auth --docker --yes

# Scaffold into the current directory, choosing the package manager
npx create-softeneers-app@latest . -t express-api --pm pnpm --yes

# A blank TypeScript starter
npx create-softeneers-app@latest lib -t minimal --yes
```

Flags: `-t/--template`, `--yes/-y`, `--db`, `--auth`, `--docker`, `--email`,
`--storage`, `--payments` (each with a `--no-*` form), `--no-install`,
`--no-git`, `--pm <npm|pnpm|yarn>`. Full contract: [CLI-SPEC.md](./CLI-SPEC.md).

Every toggle combination is build-and-typecheck verified, and the full apps are
runtime-tested — see
[Layer 1 → Verified combinations](./layer-1-packages.md#verified-combinations).

## Trying the demo

The API templates ship a **cars CRUD** example (a small garage), pre-seeded so
the first request returns data:

```bash
# express-api / hono-api (port 4000)
curl localhost:4000/api/cars
curl -X POST localhost:4000/api/cars -H 'content-type: application/json' \
  -d '{"brand":"Tesla","model":"Model 3","year":2023}'
```

`tanstack-start` renders the same data as a UI at <http://localhost:3000/cars>.

## Turning on MySQL later

If you generated with `--db`, the app already runs (in-memory). To use real
persistence, start MySQL and point the app at it:

```bash
docker compose up -d                 # if you generated with --docker
npm run db:migrate && npm run db:seed # optional — the app auto-creates+seeds too
```

That's all of Layer 0. **Next:** [Layer 1 — the packages and how to combine
them](./layer-1-packages.md).
