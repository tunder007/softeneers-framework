import 'dotenv/config'

import { assertConnection } from '@softeneers/db'

import { sequelize } from '../db'
import { carStore } from '../store'

await assertConnection(sequelize)
await sequelize.sync()

const existing = await carStore.list()
if (existing.length > 0) {
  console.log(`Skipped seeding — ${existing.length} cars already present.`)
} else {
  for (const car of [
    { brand: 'Toyota', model: 'Corolla', year: 2021 },
    { brand: 'Tesla', model: 'Model 3', year: 2023 },
    { brand: 'Ford', model: 'Mustang', year: 1969 },
  ]) {
    await carStore.create(car)
  }
  console.log('Seeded 3 cars.')
}

await sequelize.close()
