/** Minimal, dependency-free argv parsing for create-softeneers-app. */

export type PackageManager = "pnpm" | "npm" | "yarn";

export interface CliOptions {
  /** Target directory / project name (positional). Undefined → prompt. */
  targetDir?: string;
  /** Template slug from --template. Undefined → prompt. */
  template?: string;
  /** Accept defaults, no prompts. */
  yes: boolean;
  /** Skip dependency install. */
  install: boolean;
  /** Skip `git init`. */
  git: boolean;
  /** Package manager for install + next-step hints. */
  packageManager: PackageManager;
  /** Feature toggles. Undefined → prompt (or use the template default with --yes). */
  db?: boolean;
  auth?: boolean;
  docker?: boolean;
  help: boolean;
  version: boolean;
}

const PMS: PackageManager[] = ["pnpm", "npm", "yarn"];

/**
 * Detect the package manager the user invoked us with (via `npm_config_user_agent`,
 * which npm/pnpm/yarn all set). Defaults to npm — the framework is npm-first and
 * npm is always present with Node.
 */
export function detectPackageManager(): PackageManager {
  const ua = process.env.npm_config_user_agent ?? "";
  const name = ua.split("/")[0];
  if (name === "pnpm" || name === "yarn") return name;
  return "npm";
}

export function parseArgs(argv: string[]): CliOptions {
  const opts: CliOptions = {
    yes: false,
    install: true,
    git: true,
    packageManager: detectPackageManager(),
    help: false,
    version: false,
  };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === undefined) continue;
    switch (arg) {
      case "--yes":
      case "-y":
        opts.yes = true;
        break;
      case "--no-install":
        opts.install = false;
        break;
      case "--no-git":
        opts.git = false;
        break;
      case "--db":
        opts.db = true;
        break;
      case "--no-db":
        opts.db = false;
        break;
      case "--auth":
        opts.auth = true;
        break;
      case "--no-auth":
        opts.auth = false;
        break;
      case "--docker":
        opts.docker = true;
        break;
      case "--no-docker":
        opts.docker = false;
        break;
      case "--help":
      case "-h":
        opts.help = true;
        break;
      case "--version":
      case "-v":
        opts.version = true;
        break;
      case "--template":
      case "-t":
        opts.template = argv[++i];
        break;
      case "--pm": {
        const pm = argv[++i];
        if (!PMS.includes(pm as PackageManager)) {
          throw new CliError(`--pm must be one of: ${PMS.join(", ")} (got "${pm}")`);
        }
        opts.packageManager = pm as PackageManager;
        break;
      }
      default:
        if (arg.startsWith("-")) {
          throw new CliError(`Unknown option: ${arg}`);
        }
        if (opts.targetDir === undefined) {
          opts.targetDir = arg;
        } else {
          throw new CliError(`Unexpected argument: ${arg}`);
        }
    }
  }

  return opts;
}

/** A user-facing error (bad args, dir exists). Exit code 1. */
export class CliError extends Error {}

export const HELP_TEXT = `
create-softeneers-app — scaffold a Softeneers Framework project

Usage:
  npx create-softeneers-app@latest [directory|.] [options]

Options:
  -t, --template <name>   Template to use (default: prompt)
  -y, --yes               Accept defaults, no prompts
      --db / --no-db      Include a database layer (template default if unset)
      --auth / --no-auth  Include authentication (template default if unset)
      --docker / --no-docker  Include a Docker recipe (template default if unset)
      --no-install        Don't install dependencies
      --no-git            Don't run "git init"
      --pm <npm|pnpm|yarn> Package manager (default: auto-detected, else npm)
  -h, --help              Show this help
  -v, --version           Show version

Templates:
  next-fullstack   Next.js web + Express/Sequelize/MySQL API (db, auth, docker)
  express-api      Express + TypeScript REST API           (db, auth, docker)
  hono-api         Hono + TypeScript API                   (db, auth, docker)
  tanstack-start   TanStack Start fullstack React app      (db, auth, docker)
  minimal          Zero-framework Node + TypeScript starter (no toggles)

Examples:
  npx create-softeneers-app@latest my-app                      # interactive
  npx create-softeneers-app@latest api -t express-api --yes    # all defaults
  npx create-softeneers-app@latest api -t hono-api --no-auth --no-docker
  npx create-softeneers-app@latest .                           # current directory
`;
