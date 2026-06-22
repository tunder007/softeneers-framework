// Collect the canonical Markdown docs into apps/landing/content/ so the docs
// site is generated from a single source of truth. Run by predev/prebuild.
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const APP = resolve(HERE, "..");
const REPO = resolve(APP, "..", "..");
const OUT = join(APP, "content");

// A hand-written getting-started guide (the one page without a canonical source).
const GETTING_STARTED = `# Getting Started

Scaffold a new fullstack project in one command — works with **npm** or **pnpm**.

\`\`\`bash
npx create-softeneers-app@latest my-app
\`\`\`

You'll be asked for a project name and a template (currently **next-fullstack**:
Next.js web + Express/Sequelize/MySQL API). For a non-interactive run:

\`\`\`bash
npx create-softeneers-app@latest my-app --yes        # accept defaults (npm)
npx create-softeneers-app@latest .                    # scaffold into the current directory
npx create-softeneers-app@latest my-app --pm pnpm     # choose the package manager
\`\`\`

## What gets generated

\`\`\`txt
my-app/
  apps/
    web/      Next.js 16 + React 19 + Tailwind v4   → http://localhost:3000
    server/   Express 5 + Sequelize 6 + mysql2      → http://localhost:4000
  docker-compose.yml   MySQL 8 for local development
  package.json / pnpm-workspace.yaml / turbo.json
\`\`\`

## Run it

\`\`\`bash
cd my-app
npm install
cp .env.example .env && cp apps/server/.env.example apps/server/.env
docker compose up -d        # start MySQL
npm run db:migrate && npm run db:seed
npm run dev                 # web + server together
\`\`\`

## Add the reusable packages

Each capability is a published, standalone package — install what you need:

\`\`\`bash
npm i @softeneers/env @softeneers/db @softeneers/auth @softeneers/email @softeneers/storage
\`\`\`

See **Packages** in the sidebar for each package's API.
`;

const GH = "https://github.com/tunder007/monolith_demo/blob/main/";

// Rewrite a Markdown link target to its in-site docs route (or a GitHub fallback),
// so the collected content is self-consistent on disk. Mirrors resolveHref() in
// lib/docs.ts — keep the two in sync.
function resolveHref(href) {
  if (/^(https?:|mailto:|#)/.test(href)) return href;
  const [pathPart, frag] = href.split("#");
  const hash = frag ? `#${frag}` : "";
  const path = pathPart.split("?")[0];

  const pkg = path.match(/(?:^|\/)(config|env|db|auth|email|storage)\/README\.md$/);
  if (pkg) return `/docs/pkg-${pkg[1]}${hash}`;

  const base = path.split("/").pop() ?? "";
  const map = {
    "ARCHITECTURE.md": "/docs/architecture",
    "ROADMAP.md": "/docs/roadmap",
    "CLI-SPEC.md": "/docs/cli",
    "PACKAGES.md": "/docs/packages",
    "DECISIONS.md": "/docs/decisions",
    "PUBLISHING.md": "/docs/publishing",
    "CONTRIBUTING.md": "/docs/contributing",
  };
  if (map[base]) return map[base] + hash;
  if (base === "README.md") return (path.includes("docs/") ? "/docs" : "/docs/overview") + hash;
  if (path.endsWith(".html")) return GH + path.replace(/^\.\//, "").replace(/^(\.\.\/)+/, "");
  if (path.endsWith(".md") || /LICENSE|BENCHMARK|MANIFEST|TODO/i.test(base)) {
    return GH + path.replace(/^\.\//, "").replace(/^(\.\.\/)+/, "");
  }
  return href;
}

// Rewrite inline + reference-style Markdown links in a doc body.
function rewriteLinks(md) {
  return md.replace(/(\]\()([^)\s]+)(\))/g, (_m, open, href, close) => open + resolveHref(href) + close);
}

/** group | slug | title | source path relative to repo root (or null = inline) */
const PAGES = [
  ["Guides", "overview", "Overview", "README.md"],
  ["Guides", "getting-started", "Getting Started", null],
  ["Guides", "contributing", "Contributing", "CONTRIBUTING.md"],
  ["Reference", "architecture", "Architecture", "docs/ARCHITECTURE.md"],
  ["Reference", "cli", "CLI Reference", "docs/CLI-SPEC.md"],
  ["Reference", "packages", "Packages Overview", "docs/PACKAGES.md"],
  ["Reference", "decisions", "Decisions", "docs/DECISIONS.md"],
  ["Reference", "roadmap", "Roadmap", "docs/ROADMAP.md"],
  ["Reference", "publishing", "Publishing", "docs/PUBLISHING.md"],
  ["Packages", "pkg-config", "@softeneers/config", "packages/config/README.md"],
  ["Packages", "pkg-env", "@softeneers/env", "packages/env/README.md"],
  ["Packages", "pkg-db", "@softeneers/db", "packages/db/README.md"],
  ["Packages", "pkg-auth", "@softeneers/auth", "packages/auth/README.md"],
  ["Packages", "pkg-email", "@softeneers/email", "packages/email/README.md"],
  ["Packages", "pkg-storage", "@softeneers/storage", "packages/storage/README.md"],
];

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

const manifest = [];
for (const [group, slug, title, src] of PAGES) {
  let md;
  if (src === null) {
    md = GETTING_STARTED;
  } else {
    const abs = join(REPO, src);
    if (!existsSync(abs)) {
      console.warn(`collect-docs: missing ${src} — skipping ${slug}`);
      continue;
    }
    md = rewriteLinks(readFileSync(abs, "utf8"));
  }
  writeFileSync(join(OUT, `${slug}.md`), md);
  manifest.push({ slug, title, group });
}

writeFileSync(join(OUT, "manifest.json"), JSON.stringify(manifest, null, 2) + "\n");
console.log(`collect-docs: wrote ${manifest.length} pages → ${OUT}`);
