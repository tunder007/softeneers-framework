import cors from "cors";
import express from "express";

import { carRouter } from "./cars/routes.js";
import { env } from "./env.js";
// #if auth
import { toNodeHandler } from "@softeneers/auth";

import { auth } from "./auth/auth.js";
// #endif

const app = express();

// #if auth
// better-auth handles its own body parsing, so mount it before express.json().
app.all("/api/auth/*splat", toNodeHandler(auth));
// #endif

app.use(cors({ origin: env.CORS_ORIGIN }));
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/api/cars", carRouter);

app.use(
  (error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error("Unhandled error:", error);
    res.status(500).json({ message: "Internal server error." });
  },
);

app.listen(env.PORT, () => {
  console.log(`API running on http://localhost:${env.PORT}`);
});
