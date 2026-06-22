import type { Car, NewCar } from '../cars/types'

// Server-only data layer behind the cars server functions. With `db` on it is
// backed by MySQL (Sequelize via @softeneers/db); with it off it is an in-memory
// Map. Both satisfy the same CarStore. This module is never bundled into the
// client — it is only reached from server functions.
export interface CarStore {
  list(): Promise<Array<Car>>
  get(id: number): Promise<Car | null>
  create(input: NewCar): Promise<Car>
  remove(id: number): Promise<boolean>
}

// #if db
import { DataTypes, Model } from '@softeneers/db'

import { sequelize } from './db'

class CarModel extends Model {
  declare id: number
  declare brand: string
  declare model: string
  declare year: number
}

CarModel.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    brand: { type: DataTypes.STRING, allowNull: false },
    model: { type: DataTypes.STRING, allowNull: false },
    year: { type: DataTypes.INTEGER, allowNull: false },
  },
  { sequelize, modelName: 'Car', tableName: 'cars' },
)

export { CarModel }

const toCar = (m: CarModel): Car => ({ id: m.id, brand: m.brand, model: m.model, year: m.year })

export const carStore: CarStore = {
  async list() {
    return (await CarModel.findAll({ order: [['id', 'ASC']] })).map(toCar)
  },
  async get(id) {
    const m = await CarModel.findByPk(id)
    return m ? toCar(m) : null
  },
  async create(input) {
    return toCar(await CarModel.create(input))
  },
  async remove(id) {
    const m = await CarModel.findByPk(id)
    if (!m) return false
    await m.destroy()
    return true
  },
}
// #endif
// #if !db
let nextId = 1
const cars = new Map<number, Car>()

export const carStore: CarStore = {
  async list() {
    return [...cars.values()].sort((a, b) => a.id - b.id)
  },
  async get(id) {
    return cars.get(id) ?? null
  },
  async create(input) {
    const car: Car = { id: nextId++, ...input }
    cars.set(car.id, car)
    return car
  },
  async remove(id) {
    return cars.delete(id)
  },
}
// #endif
