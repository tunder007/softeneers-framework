import { spawnSync } from "node:child_process";
import {
  cpSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  renameSync,
  writeFileSync,
} from "node:fs";
import { basename, join } from "node:path";

import { CliError, type PackageManager } from "./args.js";

/** Names excluded when copying a template (docs/CLI-SPEC.md → copy exclusions). */
const EXCLUDED_NAMES = new Set([
  "node_modules",
  ".next",
  "out",
  "build",
  "dist",
  ".turbo",
  ".git",
  ".DS_Store",
  "package-lock.json",
  "pnpm-lock.yaml",
  "yarn.lock",
]);

function isExcluded(name: string): boolean {
  if (EXCLUDED_NAMES.has(name)) return true;
  if (name.endsWith(".log")) return true;
  // Drop real env files but keep the examples.
  if (name === ".env" || (name.startsWith(".env.") && name !== ".env.example")) {
    return true;
  }
  return false;
}

/** npm package name from a directory name: lowercase, spaces/invalid → dashes. */
export function toPackageName(dir: string): string {
  return (
    basename(dir)
      .toLowerCase()
      .replace(/[^a-z0-9._-]+/g, "-")
      .replace(/^[-.]+|[-.]+$/g, "") || "app"
  );
}

/** Entries allowed to pre-exist in the target (e.g. when scaffolding into "."). */
const ALLOWED_EXISTING = new Set([".git", ".DS_Store"]);

export function assertTargetUsable(targetDir: string): void {
  if (!existsSync(targetDir)) return;
  const blocking = readdirSync(targetDir).filter((name) => !ALLOWED_EXISTING.has(name));
  if (blocking.length > 0) {
    throw new CliError(`Target directory "${targetDir}" is not empty.`);
  }
}

/** Copy the template into the target, applying exclusions. */
export function copyTemplate(templateDir: string, targetDir: string): void {
  mkdirSync(targetDir, { recursive: true });
  cpSync(templateDir, targetDir, {
    recursive: true,
    filter: (src) => !isExcluded(basename(src)),
  });
}

const PM_FALLBACK_VERSION: Record<PackageManager, string> = {
  npm: "10.9.0",
  pnpm: "9.12.0",
  yarn: "4.5.0",
};

/** Best-effort actual version of the chosen PM, else a sane pinned fallback. */
function detectPmVersion(pm: PackageManager): string {
  const res = spawnSync(pm, ["--version"], {
    encoding: "utf8",
    shell: process.platform === "win32",
  });
  const v = res.status === 0 ? String(res.stdout).trim() : "";
  return /^\d+\.\d+\.\d+/.test(v) ? v : PM_FALLBACK_VERSION[pm];
}

/**
 * Rewrite the root package.json: set "name" and pin "packageManager" to the
 * chosen PM. The packageManager field is required by Turborepo to resolve the
 * workspace (the template ships both npm `workspaces` and pnpm-workspace.yaml).
 */
function rewriteRootPackage(targetDir: string, pkgName: string, pm: PackageManager): void {
  const pkgPath = join(targetDir, "package.json");
  if (!existsSync(pkgPath)) return;
  const pkg = JSON.parse(readFileSync(pkgPath, "utf8")) as Record<string, unknown>;
  pkg.name = pkgName;
  pkg.packageManager = `${pm}@${detectPmVersion(pm)}`;
  writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
}

/** For every .env.example in the tree, create a sibling .env if missing. */
function generateEnvFiles(targetDir: string): void {
  const stack = [targetDir];
  while (stack.length) {
    const dir = stack.pop()!;
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (entry.name === "node_modules") continue;
      const full = join(dir, entry.name);
      if (entry.isDirectory()) {
        stack.push(full);
      } else if (entry.name === ".env.example") {
        const envPath = join(dir, ".env");
        if (!existsSync(envPath)) {
          writeFileSync(envPath, readFileSync(full, "utf8"));
        }
      }
    }
  }
}

/**
 * Restore `.gitignore` files. Templates ship them as `gitignore` (no dot) because
 * npm strips a real `.gitignore` from a published package; on generation we rename
 * each back so the project ignores node_modules/.env/etc. from the first commit.
 */
function restoreGitignores(targetDir: string): void {
  const stack = [targetDir];
  while (stack.length) {
    const dir = stack.pop()!;
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (entry.name === "node_modules") continue;
      const full = join(dir, entry.name);
      if (entry.isDirectory()) {
        stack.push(full);
      } else if (entry.name === "gitignore") {
        renameSync(full, join(dir, ".gitignore"));
      }
    }
  }
}

/** Replace {{PROJECT_NAME}} placeholders in the README. */
function substitutePlaceholders(targetDir: string, projectName: string): void {
  const readme = join(targetDir, "README.md");
  if (!existsSync(readme)) return;
  const next = readFileSync(readme, "utf8").replaceAll("{{PROJECT_NAME}}", projectName);
  writeFileSync(readme, next);
}

export function transform(
  targetDir: string,
  projectName: string,
  pkgName: string,
  pm: PackageManager,
): void {
  restoreGitignores(targetDir);
  rewriteRootPackage(targetDir, pkgName, pm);
  generateEnvFiles(targetDir);
  substitutePlaceholders(targetDir, projectName);
}

function run(cmd: string, args: string[], cwd: string): boolean {
  const res = spawnSync(cmd, args, { cwd, stdio: "ignore", shell: process.platform === "win32" });
  return res.status === 0;
}

export function gitInit(targetDir: string): boolean {
  if (!run("git", ["init", "-q"], targetDir)) return false;
  run("git", ["add", "-A"], targetDir);
  return true;
}

export function installDeps(targetDir: string, pm: PackageManager): boolean {
  return run(pm, ["install"], targetDir);
}
