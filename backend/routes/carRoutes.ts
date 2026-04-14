import { Router } from "express";
import {
    createCar,
    deleteCar,
    getAllCars,
    getCarById,
    updateCar,
} from "../controller/carController";

const carRouter = Router();

carRouter.get("/", getAllCars);
carRouter.get("/:id", getCarById);
carRouter.post("/", createCar);
carRouter.put("/:id", updateCar);
carRouter.delete("/:id", deleteCar);

export default carRouter;
