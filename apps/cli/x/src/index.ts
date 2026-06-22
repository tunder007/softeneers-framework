import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";

import { cars } from "./cars/routes.js";
import { env } from "./env.js";
import { assertConnection } from "@softeneers/db";

import { sequelize } from "./db.js";
import "./cars/store.js"; // registers the Car model on the connection

const app = new Hono();

app.use("*", cors({ origin: env.CORS_ORIGIN }));

app.get("/health", (c) => c.json({ ok: true }));

app.route("/api/cars", cars);


async function start(): Promise<void> {
  await assertConnection(sequelize);
  await sequelize.sync();
  console.log("Database connected.");
  serve({ fetch: app.fetch, port: env.PORT }, (info) => {
    console.log(`API running on http://localhost:${info.port}`);
  });
}

start().catch((error) => {
  console.error("Failed to start:", error);
  process.exit(1);
});
