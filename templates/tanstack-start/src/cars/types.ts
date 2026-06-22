export interface Car {
  id: number
  brand: string
  model: string
  year: number
}

export type NewCar = Omit<Car, 'id'>
