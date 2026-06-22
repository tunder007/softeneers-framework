import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";

const HERE = dirname(fileURLToPath(import.meta.url));
const CLI = resolve(HERE, "..", "dist", "index.js");

import { toPackageName } from "../dist/scaffold.js";

test("toPackageName sanitizes directory names", () => {
  assert.equal(toPackageName("/x/My App"), "my-app");
  assert.equal(toPackageName("Cool_Project-1"), "cool_project-1");
  assert.equal(toPackageName("/x/---"), "app");
});

test("golden: --yes generation produces the expected next-fullstack tree", () => {
  const dir = mkdtempSync(join(tmpdir(), "sft-cli-"));
  const target = join(dir, "demo-app");
  const res = spawnSync("node", [CLI, target, "--yes", "--no-install", "--no-git"], {
    encoding: "utf8",
  });
  assert.equal(res.status, 0, res.stderr);

  // Expected files present
  for (const f of [
    "package.json",
    "pnpm-workspace.yaml",
    "turbo.json",
    "docker-compose.yml",
    ".env",
    ".env.example",
    "apps/web/package.json",
    "apps/server/package.json",
    "apps/server/.env",
  ]) {
    assert.ok(existsSync(join(target, f)), `missing ${f}`);
  }

  // Excluded files absent
  for (const f of ["node_modules", "package-lock.json", "apps/web/.next", "apps/server/dist"]) {
    assert.equal(existsSync(join(target, f)), false, `should not exist: ${f}`);
  }

  // Transforms applied
  const pkg = JSON.parse(readFileSync(join(target, "package.json"), "utf8"));
  assert.equal(pkg.name, "demo-app");
  assert.match(pkg.packageManager, /^(npm|pnpm|yarn)@\d+\.\d+\.\d+/);
  assert.equal(readFileSync(join(target, "README.md"), "utf8").includes("{{PROJECT_NAME}}"), false);
});

test("unknown template exits non-zero", () => {
  const dir = mkdtempSync(join(tmpdir(), "sft-cli-"));
  const res = spawnSync(
    "node",
    [CLI, join(dir, "app"), "--template", "no-such-template", "--yes", "--no-install", "--no-git"],
    {
      encoding: "utf8",
    },
  );
  assert.equal(res.status, 1, res.stdout + res.stderr);
});
