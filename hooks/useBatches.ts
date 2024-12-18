import { BATCHES_KEY } from '@/constants/storage-keys'
import { Batch } from '@/constants/types'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useFocusEffect } from 'expo-router'
import { useCallback, useEffect, useState } from 'react'

const useBatches = () => {
  const [batches, setBatches] = useState<Batch[] | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const loadBatches = async () => {
    try {
      const storedBatches = await AsyncStorage.getItem(BATCHES_KEY)
      if (storedBatches) {
        setBatches(JSON.parse(storedBatches))
      } else {
        setBatches([])
      }
    } catch (error) {
      console.error('Failed to load batches:', error)
      setBatches([])
    } finally {
      setIsLoading(false)
    }
  }

  const saveBatches = async (updatedBatches: Batch[]) => {
    try {
      await AsyncStorage.setItem(BATCHES_KEY, JSON.stringify(updatedBatches))
    } catch (error) {
      console.error('Failed to save batches:', error)
    }
  }

  // Load batches once on app load or screen focus
  useFocusEffect(
    useCallback(() => {
      loadBatches()
    }, [])
  )

  // Save batches automatically when they change
  useEffect(() => {
    if (batches !== null) {
      saveBatches(batches)
    }
  }, [batches])

  const getBatchById = (id: string): Batch | null => {
    if (!batches) return null
    return batches.find((batch) => batch.id === id) || null
  }

  const updateBatch = (updatedBatch: Batch) => {
    if (!batches) return
    const updatedBatches = batches.map((batch) =>
      batch.id === updatedBatch.id ? updatedBatch : batch
    )
    setBatches(updatedBatches)
  }

  const deleteBatch = (id: string) => {
    if (!batches) return
    const updatedBatches = batches.filter((batch) => batch.id !== id)
    setBatches(updatedBatches)
  }

  return {
    batches,
    setBatches,
    getBatchById,
    updateBatch,
    deleteBatch,
    isLoading
  }
}

export default useBatches
