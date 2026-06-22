import "dotenv/config";

import { assertConnection } from "@softeneers/db";

import { DEMO_CARS } from "../cars/demo.js";
import { CarModel } from "../cars/store.js";
import { sequelize } from "../db.js";

await assertConnection(sequelize);
await sequelize.sync();

const count = await CarModel.count();
if (count > 0) {
  console.log(`Skipped seeding — ${count} cars already present.`);
} else {
  await CarModel.bulkCreate([...DEMO_CARS]);
  console.log(`Seeded ${DEMO_CARS.length} cars.`);
}

await sequelize.close();
