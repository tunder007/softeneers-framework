import { createAuth } from "@softeneers/auth";

import { env } from "../env.js";

// Email + password authentication via better-auth. With no `database` configured
// better-auth uses an in-memory store (fine for local dev); point it at your DB
// for persistence. Routes are mounted at /api/auth/* in src/index.ts.
export const auth = createAuth({
  secret: env.AUTH_SECRET,
  baseURL: env.AUTH_BASE_URL,
});
