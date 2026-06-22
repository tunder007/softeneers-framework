// Build the static docs site from the canonical Markdown into apps/docs/dist/.
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { mdToHtml } from "./md.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO = resolve(HERE, "..", "..", "..");
const OUT = resolve(HERE, "..", "dist");

// (source path relative to repo root, output html filename, nav title)
const PAGES = [
  ["README.md", "index.html", "Overview"],
  ["docs/ARCHITECTURE.md", "ARCHITECTURE.html", "Architecture"],
  ["docs/ROADMAP.md", "ROADMAP.html", "Roadmap"],
  ["docs/CLI-SPEC.md", "CLI-SPEC.html", "CLI Spec"],
  ["docs/PACKAGES.md", "PACKAGES.html", "Packages"],
  ["docs/DECISIONS.md", "DECISIONS.html", "Decisions"],
  ["docs/PUBLISHING.md", "PUBLISHING.html", "Publishing"],
  ["CONTRIBUTING.md", "CONTRIBUTING.html", "Contributing"],
];

const STYLES = `
:root { color-scheme: light dark; }
* { box-sizing: border-box; }
body { font: 16px/1.6 -apple-system, system-ui, sans-serif; max-width: 820px;
  margin: 0 auto; padding: 2rem 1.25rem 4rem; color: #1a1a1a; background: #fff; }
@media (prefers-color-scheme: dark) { body { color: #e6e6e6; background: #141414; } }
nav { display: flex; flex-wrap: wrap; gap: .25rem .9rem; padding-bottom: 1rem;
  margin-bottom: 1.5rem; border-bottom: 1px solid #8884; font-size: .9rem; }
nav a { text-decoration: none; }
h1, h2, h3 { line-height: 1.25; } h2 { margin-top: 2rem; border-bottom: 1px solid #8883; padding-bottom: .3rem; }
a { color: #2563eb; } @media (prefers-color-scheme: dark) { a { color: #6ea8fe; } }
code { background: #8882; padding: .1em .35em; border-radius: 4px; font-size: .9em; }
pre { background: #8881; padding: 1rem; border-radius: 8px; overflow-x: auto; }
pre code { background: none; padding: 0; }
table { border-collapse: collapse; width: 100%; margin: 1rem 0; font-size: .92rem; }
th, td { border: 1px solid #8884; padding: .4rem .6rem; text-align: left; }
blockquote { border-left: 3px solid #8886; margin: 1rem 0; padding: .2rem 1rem; color: #8889; }
footer { margin-top: 3rem; padding-top: 1rem; border-top: 1px solid #8884; font-size: .85rem; color: #8889; }
`;

function nav(active) {
  return (
    "<nav>" +
    PAGES.map(([, file, title]) =>
      file === active ? `<strong>${title}</strong>` : `<a href="${file}">${title}</a>`,
    ).join("") +
    "</nav>"
  );
}

function page(title, file, bodyHtml) {
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title} — Softeneers Framework</title>
<style>${STYLES}</style></head>
<body>
${nav(file)}
<main>${bodyHtml}</main>
<footer>Softeneers Framework docs — generated from Markdown. Do not edit by hand.</footer>
</body></html>`;
}

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

let built = 0;
for (const [src, file, title] of PAGES) {
  const abs = join(REPO, src);
  if (!existsSync(abs)) {
    console.warn(`docs-site: skip missing ${src}`);
    continue;
  }
  writeFileSync(join(OUT, file), page(title, file, mdToHtml(readFileSync(abs, "utf8"))));
  built++;
}

// Carry the latest benchmark summary along if present.
const bench = join(REPO, "PROJECT-BENCHMARK.md");
if (existsSync(bench)) {
  writeFileSync(
    join(OUT, "BENCHMARK.html"),
    page("Benchmark", "", mdToHtml(readFileSync(bench, "utf8"))),
  );
}

console.log(`docs-site: built ${built} page(s) → ${OUT}`);
