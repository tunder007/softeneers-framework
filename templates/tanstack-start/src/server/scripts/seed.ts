import 'dotenv/config'

import { assertConnection } from '@softeneers/db'

import { DEMO_CARS } from '../demo'
import { sequelize } from '../db'
import { CarModel } from '../store'

await assertConnection(sequelize)
await sequelize.sync()

const count = await CarModel.count()
if (count > 0) {
  console.log(`Skipped seeding — ${count} cars already present.`)
} else {
  await CarModel.bulkCreate([...DEMO_CARS])
  console.log(`Seeded ${DEMO_CARS.length} cars.`)
}

await sequelize.close()
