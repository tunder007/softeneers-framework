import 'dotenv/config'

import { createEnv, z } from '@softeneers/env'

// Server-only validated environment. Variables for a feature exist only when
// that toggle is enabled at generation time.
export const env = createEnv({
  schema: {
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    // #if db
    DB_HOST: z.string().default('127.0.0.1'),
    DB_PORT: z.coerce.number().default(3306),
    DB_NAME: z.string().default('app_dev'),
    DB_USER: z.string().default('root'),
    DB_PASSWORD: z.string().default(''),
    // #endif
    // #if auth
    AUTH_SECRET: z.string().min(16).default('dev-secret-change-me-to-a-long-random-string'),
    AUTH_BASE_URL: z.string().default('http://localhost:3000'),
    // #endif
  },
})
