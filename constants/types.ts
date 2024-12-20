export type BatchStage = {
  id: number
  description: string
  date: string
}

export type Batch = {
  id: string
  name: string
  quantity: number
  createdAt: string
  isFinished: boolean
  stages: BatchStage[]
}
