import { Batch, BatchStage } from '@/constants/types'

export const createBatch = (
  name: string,
  quantity: number,
  description: string = ''
): Batch => {
  const creationDate = new Date()

  return {
    id: creationDate.toString(),
    name,
    quantity,
    createdAt: creationDate.toISOString().substring(0, 10),
    isFinished: false,
    stages: [],
    description
  }
}

export const editBatch = (
  batch: Batch,
  name: string,
  quantity: number,
  description: string
): Batch => ({
  ...batch,
  name,
  quantity,
  description
})

export const createBatchStage = (
  description: string,
  date: string
): BatchStage => {
  return {
    id: Date.now(),
    description: description.trim(),
    date: date.trim()
  }
}
