// Minimal Node + TypeScript starter. Replace this with your program — the
// structure (typed source in src/, a node:test suite, tsc build) is the point.

export interface GreetOptions {
  /** Who to greet. Defaults to "world". */
  name?: string;
  /** Greeting word. Defaults to "Hello". */
  greeting?: string;
}

export function greet({ name = "world", greeting = "Hello" }: GreetOptions = {}): string {
  return `${greeting}, ${name}!`;
}

// Run directly (`npm run dev` / `npm start`) — but stay importable from tests.
const invokedDirectly = process.argv[1] && import.meta.url === `file://${process.argv[1]}`;
if (invokedDirectly) {
  const name = process.argv[2] ?? process.env.GREET_NAME;
  console.log(greet({ name }));
}
