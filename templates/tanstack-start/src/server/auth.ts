import { createAuth } from '@softeneers/auth'

import { env } from './env'

// Email + password auth via better-auth (@softeneers/auth). With no `database`
// configured better-auth uses an in-memory store — fine for local dev; point it
// at your DB for persistence. Mounted at /api/auth/* in routes/api/auth/$.ts.
export const auth = createAuth({
  secret: env.AUTH_SECRET,
  baseURL: env.AUTH_BASE_URL,
})
