import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";

import { cars } from "./cars/routes.js";
import { env } from "./env.js";
// #if db
import { assertConnection } from "@softeneers/db";

import { sequelize } from "./db.js";
import "./cars/store.js"; // registers the Car model on the connection
// #endif
// #if auth
import { auth } from "./auth/auth.js";
// #endif

const app = new Hono();

app.use("*", cors({ origin: env.CORS_ORIGIN }));

app.get("/health", (c) => c.json({ ok: true }));

app.route("/api/cars", cars);

// #if auth
// better-auth speaks the Fetch API, so hand it the raw Request and return its Response.
app.on(["GET", "POST"], "/api/auth/*", (c) => auth.handler(c.req.raw));
// #endif

async function start(): Promise<void> {
  // #if db
  await assertConnection(sequelize);
  await sequelize.sync();
  console.log("Database connected.");
  // #endif
  serve({ fetch: app.fetch, port: env.PORT }, (info) => {
    console.log(`API running on http://localhost:${info.port}`);
  });
}

start().catch((error) => {
  console.error("Failed to start:", error);
  process.exit(1);
});
