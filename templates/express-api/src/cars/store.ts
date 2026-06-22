import { DEMO_CARS } from "./demo.js";
import type { Car, NewCar } from "./types.js";

// The data layer behind the CRUD routes. With the `db` toggle on it persists to
// MySQL (Sequelize via @softeneers/db) and **falls back to an in-memory store if
// the database is unreachable**, so `npm run dev` always yields a working,
// pre-seeded demo. With `db` off it is always in-memory.
export interface CarStore {
  list(): Promise<Car[]>;
  get(id: number): Promise<Car | null>;
  create(input: NewCar): Promise<Car>;
  update(id: number, input: NewCar): Promise<Car | null>;
  remove(id: number): Promise<boolean>;
}

// In-memory backend (the default, and the fallback when no database is reachable).
function createMemoryStore(seed = true): CarStore {
  let nextId = 1;
  const cars = new Map<number, Car>();
  if (seed) {
    for (const car of DEMO_CARS) {
      const id = nextId++;
      cars.set(id, { id, ...car });
    }
  }
  return {
    async list() {
      return [...cars.values()].sort((a, b) => a.id - b.id);
    },
    async get(id) {
      return cars.get(id) ?? null;
    },
    async create(input) {
      const car: Car = { id: nextId++, ...input };
      cars.set(car.id, car);
      return car;
    },
    async update(id, input) {
      const car = cars.get(id);
      if (!car) return null;
      const next: Car = { ...car, ...input };
      cars.set(id, next);
      return next;
    },
    async remove(id) {
      return cars.delete(id);
    },
  };
}

// #if db
import { assertConnection, DataTypes, Model } from "@softeneers/db";

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

function createDbStore(): CarStore {
  return {
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
}

// Resolve the backend once, lazily, on first use: try MySQL (create tables +
// seed if empty); on any connection error, fall back to the in-memory store.
let backend: Promise<CarStore> | null = null;
function resolveBackend(): Promise<CarStore> {
  if (!backend) {
    backend = (async () => {
      try {
        await assertConnection(sequelize);
        await sequelize.sync();
        const db = createDbStore();
        if ((await db.list()).length === 0) {
          for (const car of DEMO_CARS) await db.create(car);
        }
        console.log("Data store: MySQL");
        return db;
      } catch {
        console.warn(
          "Data store: in-memory — database unreachable. Run `docker compose up -d` (and `npm run db:migrate && npm run db:seed`) for MySQL.",
        );
        return createMemoryStore();
      }
    })();
  }
  return backend;
}

export const carStore: CarStore = {
  async list() {
    return (await resolveBackend()).list();
  },
  async get(id) {
    return (await resolveBackend()).get(id);
  },
  async create(input) {
    return (await resolveBackend()).create(input);
  },
  async update(id, input) {
    return (await resolveBackend()).update(id, input);
  },
  async remove(id) {
    return (await resolveBackend()).remove(id);
  },
};
// #endif
// #if !db
export const carStore: CarStore = createMemoryStore();
// #endif
