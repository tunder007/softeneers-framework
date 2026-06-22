import "dotenv/config";

import { assertConnection } from "@softeneers/db";

import { sequelize } from "../db.js";
import "../cars/store.js"; // importing the store registers the Car model

const reset = process.argv.includes("--reset");

await assertConnection(sequelize);
await sequelize.sync({ force: reset });
console.log(reset ? "Database reset — tables recreated." : "Database synced — tables ensured.");
await sequelize.close();
