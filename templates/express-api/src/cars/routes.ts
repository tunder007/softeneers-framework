import { Router } from "express";

import { carStore } from "./store.js";
import { parseNewCar, ValidationError } from "./validate.js";

export const carRouter = Router();

carRouter.get("/", async (_req, res) => {
  res.json(await carStore.list());
});

carRouter.get("/:id", async (req, res) => {
  const car = await carStore.get(Number(req.params.id));
  if (!car) {
    res.status(404).json({ message: "Car not found." });
    return;
  }
  res.json(car);
});

carRouter.post("/", async (req, res) => {
  try {
    const car = await carStore.create(parseNewCar(req.body));
    res.status(201).json(car);
  } catch (error) {
    if (error instanceof ValidationError) {
      res.status(400).json({ message: error.message });
      return;
    }
    throw error;
  }
});

carRouter.put("/:id", async (req, res) => {
  try {
    const car = await carStore.update(Number(req.params.id), parseNewCar(req.body));
    if (!car) {
      res.status(404).json({ message: "Car not found." });
      return;
    }
    res.json(car);
  } catch (error) {
    if (error instanceof ValidationError) {
      res.status(400).json({ message: error.message });
      return;
    }
    throw error;
  }
});

carRouter.delete("/:id", async (req, res) => {
  const removed = await carStore.remove(Number(req.params.id));
  if (!removed) {
    res.status(404).json({ message: "Car not found." });
    return;
  }
  res.status(204).end();
});
