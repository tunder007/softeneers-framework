import assert from "node:assert/strict";
import { test } from "node:test";

import { parseNewCar, ValidationError } from "../src/cars/validate.ts";

test("parses a valid car body", () => {
  assert.deepEqual(parseNewCar({ brand: "Tesla", model: "Model 3", year: 2023 }), {
    brand: "Tesla",
    model: "Model 3",
    year: 2023,
  });
});

test("trims strings and coerces a numeric year", () => {
  assert.deepEqual(parseNewCar({ brand: " Ford ", model: " Mustang ", year: "1969" }), {
    brand: "Ford",
    model: "Mustang",
    year: 1969,
  });
});

test("rejects an incomplete body", () => {
  assert.throws(() => parseNewCar({ brand: "Toyota" }), ValidationError);
  assert.throws(() => parseNewCar({}), ValidationError);
});
