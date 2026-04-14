import { Request, Response } from "express";
import Car from "../models/car";

const getAllCars = async (_req: Request, res: Response) => {
    const cars = await Car.findAll({ order: [["id", "ASC"]] });
    res.status(200).json(cars);
};

const getCarById = async (req: Request, res: Response) => {
    const carId = Number(req.params.id);
    const car = await Car.findByPk(carId);

    if (!car) {
        return res.status(404).json({ message: "Car not found." });
    }

    return res.status(200).json(car);
};

const createCar = async (req: Request, res: Response) => {
    const { brand, model, year } = req.body;

    if (!brand || !model || !year) {
        return res.status(400).json({ message: "brand, model and year are required." });
    }

    const createdCar = await Car.create({ brand, model, year: Number(year) });
    return res.status(201).json(createdCar);
};

const updateCar = async (req: Request, res: Response) => {
    const carId = Number(req.params.id);
    const car = await Car.findByPk(carId);

    if (!car) {
        return res.status(404).json({ message: "Car not found." });
    }

    const { brand, model, year } = req.body;

    await car.update({
        brand: brand ?? car.brand,
        model: model ?? car.model,
        year: year ? Number(year) : car.year,
    });

    return res.status(200).json(car);
};

const deleteCar = async (req: Request, res: Response) => {
    const carId = Number(req.params.id);
    const car = await Car.findByPk(carId);

    if (!car) {
        return res.status(404).json({ message: "Car not found." });
    }

    await car.destroy();
    return res.status(200).json({ message: "Car deleted successfully." });
};

export { getAllCars, getCarById, createCar, updateCar, deleteCar };
