import { createServerFn } from '@tanstack/react-start'

import { parseNewCar } from '../cars/validate'
import { carStore } from './store'

// Server functions: type-safe RPC the client calls directly. Their bodies (and
// the store/db imports above) run only on the server and are stripped from the
// client bundle.
export const listCars = createServerFn({ method: 'GET' }).handler(async () => {
  return carStore.list()
})

export const createCar = createServerFn({ method: 'POST' })
  .validator((data: unknown) => parseNewCar(data))
  .handler(async ({ data }) => {
    return carStore.create(data)
  })

export const removeCar = createServerFn({ method: 'POST' })
  .validator((data: unknown) => {
    const id = Number(data)
    if (!Number.isInteger(id)) throw new Error('A numeric car id is required.')
    return id
  })
  .handler(async ({ data }) => {
    return carStore.remove(data)
  })
