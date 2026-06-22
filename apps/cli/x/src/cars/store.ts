import type { Car, NewCar } from "./types.js";

// The data layer behind the CRUD routes. With the `db` toggle on this is backed
// by MySQL (Sequelize via @softeneers/db); with it off it's an in-memory Map so
// the API runs with zero infrastructure. Both satisfy the same CarStore.
export interface CarStore {
  list(): Promise<Car[]>;
  get(id: number): Promise<Car | null>;
  create(input: NewCar): Promise<Car>;
  update(id: number, input: NewCar): Promise<Car | null>;
  remove(id: number): Promise<boolean>;
}

import { DataTypes, Model } from "@softeneers/db";

import { sequelize } from "../db.js";

class CarModel extends Model {
  declare id: number;
  declare brand: string;
  declare model: string;
  declare year: number;
}

CarModel.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    brand: { type: DataTypes.STRING, allowNull: false },
    model: { type: DataTypes.STRING, allowNull: false },
    year: { type: DataTypes.INTEGER, allowNull: false },
  },
  { sequelize, modelName: "Car", tableName: "cars" },
);

export { CarModel };

const toCar = (m: CarModel): Car => ({ id: m.id, brand: m.brand, model: m.model, year: m.year });

export const carStore: CarStore = {
  async list() {
    return (await CarModel.findAll({ order: [["id", "ASC"]] })).map(toCar);
  },
  async get(id) {
    const m = await CarModel.findByPk(id);
    return m ? toCar(m) : null;
  },
  async create(input) {
    return toCar(await CarModel.create(input));
  },
  async update(id, input) {
    const m = await CarModel.findByPk(id);
    if (!m) return null;
    await m.update(input);
    return toCar(m);
  },
  async remove(id) {
    const m = await CarModel.findByPk(id);
    if (!m) return false;
    await m.destroy();
    return true;
  },
};
