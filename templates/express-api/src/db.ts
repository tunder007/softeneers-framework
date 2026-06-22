import { createDb } from "@softeneers/db";

import { env } from "./env.js";

// A configured (but not-yet-connected) Sequelize instance. Importing a model
// registers it; `assertConnection`/`sync` open the connection on startup.
export const sequelize = createDb({
  host: env.DB_HOST,
  port: env.DB_PORT,
  database: env.DB_NAME,
  username: env.DB_USER,
  password: env.DB_PASSWORD,
});
