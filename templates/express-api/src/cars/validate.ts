import type { NewCar } from "./types.js";

/** Thrown when a request body is not a valid car. Mapped to HTTP 400. */
export class ValidationError extends Error {}

/** Validate and normalize an untrusted request body into a NewCar. */
export function parseNewCar(body: unknown): NewCar {
  const b = (body ?? {}) as Record<string, unknown>;
  const brand = typeof b.brand === "string" ? b.brand.trim() : "";
  const model = typeof b.model === "string" ? b.model.trim() : "";
  const year = Number(b.year);
  if (!brand || !model || !Number.isInteger(year)) {
    throw new ValidationError("brand (string), model (string) and year (integer) are required.");
  }
  return { brand, model, year };
}
