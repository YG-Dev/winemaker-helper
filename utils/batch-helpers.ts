import { Batch } from '@/constants/types'

export const createBatch = (name: string, quantity: number): Batch => {
  const creationDate = new Date()

  return {
    id: creationDate.toString(),
    name,
    quantity,
    createdAt: creationDate.toISOString().substring(0, 10),
    isFinished: false,
    stages: []
  }
}
