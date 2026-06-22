# Layer 1 — Packages & combinations

**Goal of this layer:** understand the reusable `@softeneers/*` packages and how
each template/toggle combination puts them to work. For just spinning up a
project, see [Layer 0](./layer-0-quickstart.md). For a deep, standalone reference
on any one package, see [Layer 2](./layer-2-reference/README.md).

## The packages at a glance

Every package is small, single-purpose, dependency-light, published to npm
(`0.1.0`), and usable on its own — install only what you need.

| Package | One-liner | Deep reference |
| ------- | --------- | -------------- |
| `@softeneers/config`  | Shared tsconfig / ESLint / Prettier presets so every project lints & types the same | [config](./layer-2-reference/config.md) |
| `@softeneers/env`     | Fail-fast, typed environment validation over Zod | [env](./layer-2-reference/env.md) |
| `@softeneers/db`      | A configured Sequelize/MySQL factory + connection helper | [db](./layer-2-reference/db.md) |
| `@softeneers/auth`    | Email+password auth on better-auth, with Node/Express helpers | [auth](./layer-2-reference/auth.md) |
| `@softeneers/email`   | Transactional email via Resend + React Email templates | [email](./layer-2-reference/email.md) |
| `@softeneers/storage` | S3-compatible object storage (S3 / R2 / MinIO) | [storage](./layer-2-reference/storage.md) |
| `@softeneers/payments`| Stripe checkout, subscriptions, billing portal, webhooks | [payments](./layer-2-reference/payments.md) |

Install any of them directly:

```bash
npm i @softeneers/env @softeneers/db @softeneers/auth
```

## How the templates compose them

The generator wires packages into a project based on the template and its
toggles. A toggle being **off** means that package isn't installed at all.

| | `env` | `db` | `auth` | `email` | `storage` | `payments` |
| --- | :---: | :---: | :---: | :---: | :---: | :---: |
| `express-api`    | always | `--db` | `--auth` | `--email` | `--storage` | `--payments` |
| `hono-api`       | always | `--db` | `--auth` | `--email` | `--storage` | `--payments` |
| `tanstack-start` | always | `--db` | `--auth` (+ UI) | `--email` | `--storage` | `--payments` (+ UI) |
| `next-fullstack` | — | built-in MySQL | — | — | — | — |
| `minimal`        | — | — | — | — | — | — |

- **`env` is always present** in the API/fullstack templates — config should be
  validated before an app boots.
- **Every other package is a toggle** (`--db`, `--auth`, `--email`, `--storage`,
  `--payments`). Off means the package isn't installed and its routes/files don't
  exist; on means it's wired and working from the keys in `.env`.
- **`@softeneers/config`** is tooling, not a runtime package — adopt it in your
  repo's `tsconfig`/`eslint`/`prettier` (see its Layer 2 page).

## Verified combinations

The API/fullstack templates expose **five composable feature toggles** —
`--db`, `--auth`, `--email`, `--storage`, `--payments` — plus the file-only
`--docker`. Five booleans means **2⁵ = 32 build-relevant combinations** per
template. Every one is exercised by an exhaustive e2e matrix
(generate → install → build → typecheck), and the full apps are runtime-booted:

| Template | Combinations tested | How |
| -------- | ------------------- | --- |
| `express-api`    | **all 32** | generate → install → build → typecheck |
| `hono-api`       | **all 32** | generate → install → build → typecheck |
| `tanstack-start` | **14** (all-off, all-on, each single toggle, key pairs/triples) | generate → install → build → typecheck (heavier build, so a covering set) |
| `minimal`        | 1 | generate → install → build → typecheck |
| `next-fullstack` | 1 | generate → install → build → typecheck |

**Runtime:** the **full** `express-api` and `hono-api` (every toggle on) boot with
one `npm run dev` and serve correctly — `/health` → 200, a seeded `/api/cars`,
the Stripe webhook rejects an unsigned body (→ 400), auth `sign-up/email`
succeeds (→ 200), and the database **falls back to the pre-seeded in-memory
store** when MySQL isn't running. `tanstack-start` (full) is runtime-verified too:
the `/login`, `/account`, and `/billing` UIs render and auth sign-up works.

> `--docker` only adds or removes `docker-compose.yml` — it never touches the
> build or runtime, so it's covered structurally and is included in the full
> runtime combos.

### What turning a toggle on gives you

| Toggle | Adds |
| ------ | ---- |
| `--db`       | MySQL persistence (with graceful in-memory fallback) |
| `--auth`     | better-auth at `/api/auth/*` (+ sign-in/up UI in `tanstack-start`) |
| `--email`    | a Resend mailer + a welcome-email route/server-fn |
| `--storage`  | S3/R2/MinIO upload / signed-URL / delete routes |
| `--payments` | Stripe checkout + subscription + portal + verified webhook (+ a `/billing` UI in `tanstack-start`) |
| `--docker`   | a `docker-compose.yml` MySQL service |

Any subset works together — that's what the matrix proves.

## Taking advantage of each combination

Think of a generated project as a base you extend by turning packages on.

### Just an API (default)

`-t express-api` (or `hono-api`) with no toggles → a typed REST API with a CRUD
example backed by an in-memory store, and `@softeneers/env` validating config.
Great for prototypes and tests — zero infrastructure.

### API + database (`--db`)

Adds `@softeneers/db`: the CRUD now persists to MySQL via Sequelize, with tables
auto-created and seeded on first connect. If MySQL isn't running, the app
**falls back to the in-memory store**, so `npm run dev` always works. Promote to
real persistence by starting MySQL (`--docker` gives you a `docker-compose.yml`).

### API + auth (`--auth`)

Adds `@softeneers/auth`: better-auth is mounted at `/api/auth/*` with
email+password enabled. `sign-up`/`sign-in`/`get-session` work immediately
(better-auth uses an in-memory store until you give it a database).

### API + email (`--email`)

Adds `@softeneers/email`: a Resend client + a `POST /api/email/welcome` demo
endpoint (a server function in `tanstack-start`). Set `RESEND_API_KEY` to send.

### API + storage (`--storage`)

Adds `@softeneers/storage`: upload / signed-download-URL / delete routes (server
functions in `tanstack-start`) over S3 / Cloudflare R2 / MinIO. Set the `S3_*`
keys to use it.

### API + payments (`--payments`)

Adds `@softeneers/payments`: **Stripe checkout (one-time + subscription), the
billing portal, and a verified webhook**, all pre-wired. The *only* thing you do
is paste `STRIPE_SECRET_KEY` + `STRIPE_WEBHOOK_SECRET` (and two Price ids) into
`.env`. In `tanstack-start` you also get a `/billing` page with Buy/Subscribe
buttons. See [the payments reference](./layer-2-reference/payments.md).

### Fullstack (`tanstack-start`)

The same toggle story, but the UI is included: the cars CRUD is type-safe
**server functions** rendered as React; `--auth` adds **sign-in/sign-up/account
pages**; `--payments` adds the **billing page**. Server code (DB, Stripe secret,
S3 keys) stays off the client bundle.

## Where to go next

- **Spin something up:** [Layer 0 — Quickstart](./layer-0-quickstart.md)
- **Go deep on a package:** [Layer 2 — Reference](./layer-2-reference/README.md)
- **Why the framework is shaped this way:** [ARCHITECTURE.md](./ARCHITECTURE.md)
  and the authoritative [DECISIONS.md](./DECISIONS.md)
