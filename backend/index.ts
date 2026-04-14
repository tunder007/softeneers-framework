import "dotenv/config";
import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import { sequelize } from "./models/car";
import carRouter from "./routes/carRoutes";

const app = express();
const PORT = Number(process.env.PORT ?? 4000);
const FRONTEND_URL = process.env.FRONTEND_URL ?? "http://localhost:3000";

// Permitem request-uri din frontend (ex: Next.js pe localhost:3000).
app.use(
    cors({
        origin: FRONTEND_URL,
    })
);

// Parseaza automat JSON-ul trimis in body de frontend.
app.use(express.json());

// Endpoint simplu de health-check ca sa verifici rapid daca API-ul merge.
app.get("/health", (_req: Request, res: Response) => {
    res.status(200).json({ ok: true });
});

// Grupam toate endpoint-urile pentru masini sub /api/cars.
app.use("/api/cars", carRouter);

// Middleware minimal de tratare erori, ca sa nu cada serverul fara raspuns util.
app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
    console.error("Unhandled error:", error);
    res.status(500).json({ message: "Internal server error." });
});

// Pornim serverul doar dupa ce conexiunea la MySQL este valida.
const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log("MySQL connection established.");

        app.listen(PORT, () => {
            console.log(`Backend running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Failed to connect to database:", error);
        process.exit(1);
    }
};

startServer();
