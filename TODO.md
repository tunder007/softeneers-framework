# Softeneers Framework — Getting Started Plan

## 1. The Idea in Brief

Softeneers Framework should not be a full framework built from scratch, like Next.js. The better approach is a **modular starter framework** built on top of already-established technologies.

The goal:

```bash
npx create-softeneers-app@latest my-app
```

or:

```bash
npm create softeneers-app@latest my-app
```

After running the command, the user chooses what to generate:

- fullstack application
- frontend only
- backend only
- monorepo with web + server + mobile
- auth included
- database included
- Docker included
- email service included
- storage included

In practice, Softeneers Framework becomes a **project generator** plus a set of reusable packages.

---

## 2. What You Want to Achieve

You want people to be able to start projects quickly, in an organized, scalable, and standardized way.

Example:

```bash
npx create-softeneers-app@latest
```

The CLI asks:

```txt
Project name: my-app

What type of project do you want?
1. Fullstack app
2. Frontend only
3. Backend API only
4. Advanced monorepo

Frontend:
1. Next.js
2. TanStack Start
3. None

Backend:
1. Hono
2. Express
3. None

Database:
1. MySQL
2. PostgreSQL
3. None

ORM:
1. Prisma
2. Drizzle
3. Sequelize

Auth:
1. better-auth
2. none

Email:
1. Resend
2. none

Storage:
1. S3 compatible
2. none

Docker:
1. yes
2. no
```

At the end, the project is generated automatically.

---

## 3. Recommended Repository Structure

The main repository should be a monorepo.

```txt
softeneers-framework/
  apps/
    cli/
    docs/
    playground/

  packages/
    auth/
    db/
    env/
    ui/
    email/
    storage/
    logger/
    api/
    config/

  templates/
    next-fullstack/
    tanstack-start/
    hono-api/
    express-api/
    minimal/
    monorepo-full/

  package.json
  pnpm-workspace.yaml
  turbo.json
  README.md
```

---

## 4. Role of Each Folder

### `apps/cli`

This is where the CLI lives — the tool that can be run with `npx`.

Future example:

```bash
npx create-softeneers-app@latest my-app
```

It copies the chosen template and installs dependencies.

---

### `apps/docs`

Framework documentation.

Can be built with:

- Next.js
- Nextra
- VitePress
- Astro

To start, a well-written README may be enough.

---

### `apps/playground`

A demo project for testing the framework.

Use this to verify that packages work together.

---

### `packages/auth`

Reusable authentication package.

May include:

- setup for `better-auth`
- session helpers
- backend middleware
- frontend hooks
- shared TypeScript types

Import example:

```ts
import { auth } from "@softeneers/auth";
```

---

### `packages/db`

Database package.

May include:

- DB connection
- Prisma / Drizzle / Sequelize client
- migration helpers
- shared schemas
- seed scripts

Example:

```ts
import { db } from "@softeneers/db";
```

---

### `packages/env`

Package for validating environment variables.

Example:

```ts
import { env } from "@softeneers/env";
```

The goal is to prevent apps from starting with an incorrect `.env`.

---

### `packages/ui`

Reusable UI components.

May include:

- Button
- Input
- Card
- Modal
- Form components
- Layout components

Example:

```tsx
import { Button } from "@softeneers/ui";
```

---

### `packages/email`

Email package.

May include:

- Resend setup
- React Email templates
- functions for sending emails
- standard emails: welcome, reset password, invoice, order confirmation

Example:

```ts
import { sendEmail } from "@softeneers/email";
```

---

### `packages/storage`

S3-compatible storage package.

May include support for:

- AWS S3
- Cloudflare R2
- MinIO
- RustFS

Example:

```ts
import { uploadFile } from "@softeneers/storage";
```

---

### `packages/logger`

Logging package.

May include:

- standard logger
- request logging
- error logging
- integration with PostHog / Axiom / other services

Example:

```ts
import { logger } from "@softeneers/logger";
```

---

### `packages/api`

Package for frontend-backend communication.

May include:

- tRPC helpers
- oRPC helpers
- shared types
- API client
- middleware

Example:

```ts
import { api } from "@softeneers/api";
```

---

### `packages/config`

Shared configuration.

May include:

- ESLint config
- Prettier config
- TypeScript config
- Tailwind config
- tsup config

Example:

```json
{
  "extends": "@softeneers/config/tsconfig/base.json"
}
```

---

## 5. Recommended npm Packages

Long term, you could publish:

```txt
create-softeneers-app
@softeneers/auth
@softeneers/db
@softeneers/env
@softeneers/ui
@softeneers/email
@softeneers/storage
@softeneers/logger
@softeneers/api
@softeneers/config
```

The first important package is:

```txt
create-softeneers-app
```

The rest can come later.

---

## 6. How the CLI Should Work

The CLI should do the following:

1. ask what type of project you want
2. select the appropriate template
3. copy files into the new folder
4. update `package.json`
5. generate `.env.example`
6. install dependencies
7. display startup commands

Final output example:

```txt
Done.

Next steps:

cd my-app
pnpm install
pnpm dev
```

---

## 7. A Realistic First Version

Do not try to build everything at once.

For v1, build only:

```txt
softeneers-framework/
  apps/
    cli/

  templates/
    next-fullstack/
    hono-api/

  packages/
    config/
    env/

  package.json
  pnpm-workspace.yaml
  turbo.json
```

That is enough to get started.

---

## 8. Recommended Stack for v1

For the first version:

```txt
Package manager: pnpm
Monorepo: Turborepo
CLI: Node.js + TypeScript
Frontend template: Next.js
Backend template: Hono or Express
Database: MySQL
ORM: Prisma or Sequelize
Auth: better-auth
Styling: TailwindCSS
Formatting: Prettier + ESLint
```

If you want something close to what you already use, start with:

```txt
Next.js + TailwindCSS + Express + Sequelize + MySQL
```

Then add more modern variants:

```txt
TanStack Start + Hono + Drizzle + better-auth
```

---

## 9. Work Stages

### Stage 1 — Monorepo Setup

Create the base structure:

```bash
mkdir softeneers-framework
cd softeneers-framework
pnpm init
pnpm add -D turbo typescript
```

Create:

```txt
pnpm-workspace.yaml
turbo.json
apps/
packages/
templates/
```

---

### Stage 2 — Simple Template

Create the first template:

```txt
templates/next-fullstack/
```

It can contain:

```txt
apps/
  web/
  server/

packages/
  config/
  env/
```

---

### Stage 3 — Simple CLI

Create:

```txt
apps/cli/
```

The CLI command should support:

```bash
npx create-softeneers-app my-app
```

To start, it can simply copy a fixed template.

---

### Stage 4 — Add CLI Prompts

Use a package such as:

```txt
prompts
```

or:

```txt
@clack/prompts
```

Example questions:

```txt
- Which frontend do you want?
- Which backend do you want?
- Do you want auth?
- Do you want Docker?
- Do you want email?
```

---

### Stage 5 — Add Reusable Packages

Start with the simplest ones:

```txt
@softeneers/config
@softeneers/env
```

Then:

```txt
@softeneers/db
@softeneers/auth
@softeneers/ui
```

---

### Stage 6 — Publish to npm

Publish the CLI first:

```bash
npm publish
```

Then publish scoped packages:

```bash
npm publish --access public
```

Example:

```bash
npm publish packages/env --access public
```

---

## 10. Recommended Implementation Order

### Sprint 1

- monorepo setup
- pnpm setup
- turbo setup
- Next.js + Express template
- initial README

### Sprint 2

- CLI that copies the template
- `create-softeneers-app` command
- `.env.example`
- install scripts

### Sprint 3

- `@softeneers/config`
- `@softeneers/env`
- linting + formatting
- shared TypeScript config

### Sprint 4

- `@softeneers/db`
- Docker Compose for MySQL
- migrations
- seed

### Sprint 5

- `@softeneers/auth`
- better-auth integration
- login/register template

### Sprint 6

- `@softeneers/email`
- Resend
- React Email templates

### Sprint 7

- `@softeneers/storage`
- S3-compatible storage
- upload helper

### Sprint 8

- documentation
- examples
- npm publish

---

## 11. Example of the Desired Final Command

```bash
npx create-softeneers-app@latest my-school-platform
```

With options:

```txt
Frontend: Next.js
Backend: Express
Database: MySQL
ORM: Sequelize
Auth: yes
Email: yes
Storage: no
Docker: yes
```

Output:

```txt
my-school-platform/
  apps/
    web/
    server/

  packages/
    config/
    env/
    db/
    auth/
    email/

  docker-compose.yml
  package.json
  pnpm-workspace.yaml
  turbo.json
  README.md
```

---

## 12. What NOT to Do at the Start

Do not try to build these from day one:

- a full routing framework
- your own rendering system
- your own ORM
- your own auth system
- your own bundler
- your own deploy system

Use existing tools and build on top of them.

Softeneers Framework should be a layer for **organization, productivity, and standardization**.

---

## 13. Simple Project Definition

Softeneers Framework is a modular fullstack application generator, built to quickly bootstrap scalable projects using modern stacks such as Next.js, TanStack Start, Hono, Express, MySQL, better-auth, Docker, and reusable Softeneers packages.

---

## 14. Clear MVP

The MVP should do only this:

```bash
npx create-softeneers-app my-app
```

and generate:

```txt
my-app/
  apps/
    web/
    server/

  packages/
    config/
    env/

  package.json
  pnpm-workspace.yaml
  turbo.json
  docker-compose.yml
  README.md
```

If you achieve that, you already have the real foundation of the framework.

---

## 15. Startup Checklist

- [ ] Create the `softeneers-framework` repo
- [ ] Add `pnpm-workspace.yaml`
- [ ] Add `turbo.json`
- [ ] Create `apps/cli`
- [ ] Create `templates/next-fullstack`
- [ ] Create `packages/config`
- [ ] Create `packages/env`
- [ ] Make the CLI copy the template
- [ ] Test locally with `pnpm dev`
- [ ] Test the CLI locally
- [ ] Publish beta to npm
- [ ] Create minimal documentation
- [ ] Add new templates gradually

---

## 16. Final Recommendation

Start simple.

The first version does not need to be perfect. It only needs to generate a working project.

After that, you can add:

- auth
- db
- email
- storage
- logging
- tRPC/oRPC
- TanStack
- mobile
- full Docker setup
- deploy helpers

The initial goal is to have a `npx create-softeneers-app` that actually works.
