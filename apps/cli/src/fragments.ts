// Fragment/toggle engine. A template may ship a `softeneers.template.json`
// manifest declaring optional features (db / auth / docker). When a feature is
// toggled OFF, the scaffold removes that fragment's files, package.json deps and
// scripts, and strips `#if`/`#endif` marker blocks from text files. Templates
// without a manifest (e.g. `minimal`) support no toggles and are copied as-is.
import { basename, join } from "node:path";
import { existsSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";

export const TOGGLE_KEYS = ["db", "auth", "docker"] as const;
export type ToggleKey = (typeof TOGGLE_KEYS)[number];
export type Toggles = Record<ToggleKey, boolean>;

interface Fragment {
  /** Paths (relative to the project root) deleted when the toggle is OFF. */
  removePaths?: string[];
  /** package.json dependency names removed (any package.json in the tree) when OFF. */
  removeDeps?: string[];
  /** Root package.json script names removed when OFF. */
  removeScripts?: string[];
}

export interface TemplateManifest {
  /** Toggles this template supports, with their default values. */
  toggles?: Partial<Toggles>;
  /** Per-toggle removals applied when the toggle is OFF. */
  fragments?: Partial<Record<ToggleKey, Fragment>>;
}

const MANIFEST_NAME = "softeneers.template.json";

export function readManifest(dir: string): TemplateManifest | null {
  const p = join(dir, MANIFEST_NAME);
  if (!existsSync(p)) return null;
  return JSON.parse(readFileSync(p, "utf8")) as TemplateManifest;
}

/** Supported toggles + their default values (empty object when no manifest). */
export function templateToggleDefaults(dir: string): Partial<Toggles> {
  return readManifest(dir)?.toggles ?? {};
}

const TEXT_EXT = new Set([
  "ts", "tsx", "js", "jsx", "mjs", "cjs", "md", "mdx", "yml", "yaml",
  "css", "scss", "html", "txt", "sh", "env", "example", "toml", "gitignore",
]);

function isTextFile(name: string): boolean {
  if (name === "Dockerfile" || name.startsWith(".env")) return true;
  const ext = name.includes(".") ? name.split(".").pop()! : "";
  return TEXT_EXT.has(ext);
}

function walkFiles(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name === ".git") continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) walkFiles(full, out);
    else out.push(full);
  }
  return out;
}

/**
 * Strip conditional blocks from a text file. A block opens with a line
 * containing `#if <key>` or `#if !<key>` and closes with `#endif` (the comment
 * style around them is irrelevant — `//`, `#`, `<!-- -->` all work). The marker
 * lines themselves are always removed; the body is kept only if the condition
 * holds. Blocks nest.
 */
export function processMarkers(content: string, toggles: Toggles): string {
  const lines = content.split("\n");
  const out: string[] = [];
  const stack: boolean[] = [];
  const emitting = () => stack.every(Boolean);

  for (const line of lines) {
    const open = line.match(/#if\s+(!)?\s*([A-Za-z_]\w*)/);
    if (open) {
      const negated = open[1] === "!";
      const value = toggles[open[2] as ToggleKey] ?? false;
      stack.push(negated ? !value : value);
      continue;
    }
    if (/#endif/.test(line)) {
      stack.pop();
      continue;
    }
    if (emitting()) out.push(line);
  }
  return out.join("\n");
}

function prunePackageJson(file: string, removeDeps: Set<string>, removeScripts: Set<string>): void {
  const pkg = JSON.parse(readFileSync(file, "utf8")) as Record<string, Record<string, unknown>>;
  for (const field of ["dependencies", "devDependencies", "peerDependencies"]) {
    const deps = pkg[field];
    if (deps) for (const name of removeDeps) delete deps[name];
  }
  if (pkg.scripts) for (const name of removeScripts) delete pkg.scripts[name];
  writeFileSync(file, JSON.stringify(pkg, null, 2) + "\n");
}

/**
 * Apply the resolved toggles to a freshly-copied template: delete OFF fragments'
 * paths, prune their deps/scripts from every package.json, strip marker blocks,
 * and remove the manifest from the generated project.
 */
export function applyToggles(targetDir: string, toggles: Toggles): void {
  const manifest = readManifest(targetDir);

  const removeDeps = new Set<string>();
  const removeScripts = new Set<string>();
  if (manifest?.fragments) {
    for (const key of TOGGLE_KEYS) {
      if (toggles[key]) continue; // only prune a fragment when its toggle is OFF
      const fragment = manifest.fragments[key];
      if (!fragment) continue;
      for (const rel of fragment.removePaths ?? []) {
        rmSync(join(targetDir, rel), { recursive: true, force: true });
      }
      for (const dep of fragment.removeDeps ?? []) removeDeps.add(dep);
      for (const script of fragment.removeScripts ?? []) removeScripts.add(script);
    }
  }

  for (const file of walkFiles(targetDir)) {
    const name = basename(file);
    if (name === MANIFEST_NAME) continue;
    if (name === "package.json") {
      if (removeDeps.size || removeScripts.size) prunePackageJson(file, removeDeps, removeScripts);
      continue;
    }
    if (!isTextFile(name)) continue;
    const content = readFileSync(file, "utf8");
    if (!content.includes("#if") && !content.includes("#endif")) continue;
    writeFileSync(file, processMarkers(content, toggles));
  }

  rmSync(join(targetDir, MANIFEST_NAME), { force: true });
}
