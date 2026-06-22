import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useState } from 'react'

import { createCar, listCars, removeCar } from '../server/cars'

export const Route = createFileRoute('/cars')({
  component: CarsPage,
  loader: async () => listCars(),
})

function CarsPage() {
  const cars = Route.useLoaderData()
  const router = useRouter()
  const [brand, setBrand] = useState('')
  const [model, setModel] = useState('')
  const [year, setYear] = useState('')
  const [error, setError] = useState('')

  async function add(event: React.FormEvent) {
    event.preventDefault()
    setError('')
    try {
      await createCar({ data: { brand, model, year: Number(year) } })
      setBrand('')
      setModel('')
      setYear('')
      await router.invalidate()
    } catch {
      setError('Please provide a brand, model and a valid year.')
    }
  }

  async function del(id: number) {
    await removeCar({ data: id })
    await router.invalidate()
  }

  return (
    <div className="mx-auto max-w-2xl p-8">
      <h1 className="text-3xl font-bold">Cars</h1>
      <p className="mt-1 text-gray-500">A full CRUD example backed by a server function.</p>

      <form onSubmit={add} className="mt-6 flex flex-wrap gap-2">
        <input
          className="flex-1 rounded border border-gray-300 px-3 py-2"
          placeholder="Brand"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
        />
        <input
          className="flex-1 rounded border border-gray-300 px-3 py-2"
          placeholder="Model"
          value={model}
          onChange={(e) => setModel(e.target.value)}
        />
        <input
          className="w-24 rounded border border-gray-300 px-3 py-2"
          placeholder="Year"
          value={year}
          onChange={(e) => setYear(e.target.value)}
        />
        <button className="rounded bg-black px-4 py-2 font-medium text-white" type="submit">
          Add
        </button>
      </form>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

      <ul className="mt-6 divide-y divide-gray-200">
        {cars.length === 0 && <li className="py-3 text-gray-500">No cars yet — add one above.</li>}
        {cars.map((car) => (
          <li key={car.id} className="flex items-center justify-between py-3">
            <span>
              {car.brand} {car.model} <span className="text-gray-400">({car.year})</span>
            </span>
            <button
              className="text-sm text-red-600 hover:underline"
              type="button"
              onClick={() => del(car.id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
