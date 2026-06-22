// Repo-level invariant: every relative Markdown link in our authored docs must
// resolve. Guards against doc link rot (benchmark P2-4).
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const DOCS = [
  "README.md",
  "CONTRIBUTING.md",
  "docs/README.md",
  "docs/ARCHITECTURE.md",
  "docs/ROADMAP.md",
  "docs/CLI-SPEC.md",
  "docs/PACKAGES.md",
  "docs/DECISIONS.md",
  "docs/PUBLISHING.md",
  "apps/cli/README.md",
  "packages/config/README.md",
  "packages/env/README.md",
  "packages/db/README.md",
  "packages/auth/README.md",
  "packages/email/README.md",
  "packages/storage/README.md",
];

const LINK = /\]\(([^)]+)\)/g;

test("all relative markdown links in authored docs resolve", () => {
  const broken = [];
  for (const rel of DOCS) {
    const file = resolve(ROOT, rel);
    if (!existsSync(file)) continue;
    const text = readFileSync(file, "utf8");
    for (const m of text.matchAll(LINK)) {
      const target = m[1].split("#")[0];
      if (!target || /^https?:/.test(target) || target.startsWith("mailto:")) continue;
      const resolved = resolve(dirname(file), target);
      if (!existsSync(resolved)) broken.push(`${rel} -> ${m[1]}`);
    }
  }
  assert.deepEqual(broken, [], `broken links:\n${broken.join("\n")}`);
});
