import "dotenv/config";

import { createEnv, z } from "@softeneers/env";

// Validated, typed environment. Boot fails fast with a readable message if the
// .env is wrong. Variables for a feature exist only when that toggle is on.
export const env = createEnv({
  schema: {
    PORT: z.coerce.number().default(4000),
    CORS_ORIGIN: z.string().default("http://localhost:3000"),
    DB_HOST: z.string().default("127.0.0.1"),
    DB_PORT: z.coerce.number().default(3306),
    DB_NAME: z.string().default("app_dev"),
    DB_USER: z.string().default("root"),
    DB_PASSWORD: z.string().default(""),
  },
});
