import type { NewCar } from "./types.js";

// Demo garage inventory seeded on first run so `npm run dev` shows a working
// CRUD demo immediately — into MySQL when a database is reachable, otherwise
// into the in-memory store.
export const DEMO_CARS: NewCar[] = [
  { brand: "Toyota", model: "Corolla", year: 2021 },
  { brand: "Tesla", model: "Model 3", year: 2023 },
  { brand: "Ford", model: "Mustang", year: 1969 },
];
