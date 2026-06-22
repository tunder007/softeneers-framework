import { createDb } from '@softeneers/db'

import { env } from './env'

// Configured (not-yet-connected) Sequelize instance. Server-only.
export const sequelize = createDb({
  host: env.DB_HOST,
  port: env.DB_PORT,
  database: env.DB_NAME,
  username: env.DB_USER,
  password: env.DB_PASSWORD,
})
