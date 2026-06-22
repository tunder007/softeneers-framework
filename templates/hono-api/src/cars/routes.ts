import { Hono } from "hono";

import { carStore } from "./store.js";
import { parseNewCar, ValidationError } from "./validate.js";

export const cars = new Hono();

cars.get("/", async (c) => {
  return c.json(await carStore.list());
});

cars.get("/:id", async (c) => {
  const car = await carStore.get(Number(c.req.param("id")));
  if (!car) return c.json({ message: "Car not found." }, 404);
  return c.json(car);
});

cars.post("/", async (c) => {
  try {
    const car = await carStore.create(parseNewCar(await c.req.json()));
    return c.json(car, 201);
  } catch (error) {
    if (error instanceof ValidationError) return c.json({ message: error.message }, 400);
    throw error;
  }
});

cars.put("/:id", async (c) => {
  try {
    const car = await carStore.update(Number(c.req.param("id")), parseNewCar(await c.req.json()));
    if (!car) return c.json({ message: "Car not found." }, 404);
    return c.json(car);
  } catch (error) {
    if (error instanceof ValidationError) return c.json({ message: error.message }, 400);
    throw error;
  }
});

cars.delete("/:id", async (c) => {
  const removed = await carStore.remove(Number(c.req.param("id")));
  if (!removed) return c.json({ message: "Car not found." }, 404);
  return c.body(null, 204);
});
