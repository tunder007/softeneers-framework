import { existsSync, statSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export interface TemplateInfo {
  slug: string;
  label: string;
  hint: string;
  /** false → shown in the wizard but not yet generatable. */
  available: boolean;
  /** Final line printed after generation (e.g. the local URLs). */
  outro?: string;
}

/**
 * The template registry. Each entry targets a different kind of user; the
 * db/auth/docker toggles (where supported) are declared per template in its
 * `softeneers.template.json` manifest.
 */
export const TEMPLATES: TemplateInfo[] = [
  {
    slug: "next-fullstack",
    label: "Fullstack (Next.js + Express + Sequelize + MySQL)",
    hint: "web + server monorepo",
    available: true,
    outro: "Web: http://localhost:3000   API: http://localhost:4000",
  },
  {
    slug: "express-api",
    label: "Express API (TypeScript REST)",
    hint: "API only · db/auth/docker toggles",
    available: true,
    outro: "API: http://localhost:4000",
  },
  {
    slug: "hono-api",
    label: "Hono API (TypeScript, fast)",
    hint: "API only · db/auth/docker toggles",
    available: true,
    outro: "API: http://localhost:4000",
  },
  {
    slug: "tanstack-start",
    label: "TanStack Start (fullstack React)",
    hint: "app + server routes · db/auth/docker toggles",
    available: true,
    outro: "App: http://localhost:3000",
  },
  {
    slug: "minimal",
    label: "Minimal (Node + TypeScript starter)",
    hint: "zero-framework blank slate",
    available: true,
    outro: "Run: npm run dev",
  },
];

export const DEFAULT_TEMPLATE = "next-fullstack";

export function findTemplate(slug: string): TemplateInfo | undefined {
  return TEMPLATES.find((t) => t.slug === slug);
}

/**
 * Resolve the on-disk directory for a template, in priority order:
 *   1. bundled with the package  (<pkg>/templates/<slug>)  — published layout
 *   2. the monorepo templates dir (<pkg>/../../templates/<slug>) — local dev
 * Returns the first that exists, or undefined.
 */
export function resolveTemplateDir(slug: string): string | undefined {
  const here = dirname(fileURLToPath(import.meta.url)); // src/ (tsx) or dist/ (built)
  const pkgRoot = resolve(here, ".."); // apps/cli
  const candidates = [
    resolve(pkgRoot, "templates", slug),
    resolve(pkgRoot, "..", "..", "templates", slug),
  ];
  return candidates.find((dir) => existsSync(dir) && statSync(dir).isDirectory());
}
