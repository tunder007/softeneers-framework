import type { NewCar } from './types'

/** Thrown when a submitted car is invalid. */
export class ValidationError extends Error {}

/** Validate and normalize untrusted input into a NewCar. Runs on the server. */
export function parseNewCar(input: unknown): NewCar {
  const b = (input ?? {}) as Record<string, unknown>
  const brand = typeof b.brand === 'string' ? b.brand.trim() : ''
  const model = typeof b.model === 'string' ? b.model.trim() : ''
  const year = Number(b.year)
  if (!brand || !model || !Number.isInteger(year)) {
    throw new ValidationError('brand (string), model (string) and year (integer) are required.')
  }
  return { brand, model, year }
}
