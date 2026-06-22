import { cancel, confirm, isCancel, select, text } from "@clack/prompts";

import { type ToggleKey, type Toggles } from "./fragments.js";
import { DEFAULT_TEMPLATE, TEMPLATES } from "./templates.js";

function bail<T>(value: T | symbol): T {
  if (isCancel(value)) {
    cancel("Cancelled.");
    process.exit(0);
  }
  return value as T;
}

export async function promptProjectName(initial?: string): Promise<string> {
  const value = await text({
    message: "Project name:",
    placeholder: "my-app",
    initialValue: initial,
    validate: (v) => (v.trim().length === 0 ? "Please enter a project name." : undefined),
  });
  return bail(value).trim();
}

export async function promptTemplate(): Promise<string> {
  const value = await select({
    message: "What type of project do you want?",
    initialValue: DEFAULT_TEMPLATE,
    options: TEMPLATES.map((t) => ({
      value: t.slug,
      label: t.label,
      hint: t.available ? t.hint : `${t.hint} — not available yet`,
    })),
  });
  return bail(value);
}

const TOGGLE_LABELS: Record<ToggleKey, string> = {
  db: "Include a database? (CRUD persisted to MySQL via Sequelize)",
  auth: "Include authentication? (email + password via better-auth)",
  docker: "Include a Docker recipe? (docker-compose for local services)",
};

/**
 * Ask for each toggle the template supports (a key present in `defaults`).
 * A toggle already fixed on the command line (`overrides[key] !== undefined`)
 * skips its prompt. Unsupported toggles resolve to `false`.
 */
export async function promptToggles(
  defaults: Partial<Toggles>,
  overrides: Partial<Toggles>,
): Promise<Toggles> {
  const result: Toggles = { db: false, auth: false, docker: false };
  for (const key of Object.keys(defaults) as ToggleKey[]) {
    if (overrides[key] !== undefined) {
      result[key] = overrides[key]!;
      continue;
    }
    const value = await confirm({
      message: TOGGLE_LABELS[key],
      initialValue: defaults[key] ?? false,
    });
    result[key] = bail(value);
  }
  return result;
}
