import { PREFERRED_VOLUME_UNIT_KEY } from '@/constants/storage-keys'
import { VolumeUnit } from '@/constants/types'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useFocusEffect } from 'expo-router'
import { useCallback, useState } from 'react'

const usePreferredVolumeUnits = () => {
  const [preferredVolumeUnit, setPreferredVolumeUnit] =
    useState<VolumeUnit>('L')

  const loadPreferredVolumeUnit = async () => {
    try {
      const unit = await AsyncStorage.getItem(PREFERRED_VOLUME_UNIT_KEY)
      if (unit === 'L' || unit === 'Gal') {
        setPreferredVolumeUnit(unit)
      }
    } catch (error) {
      console.error('Error loading preferred volume unit:', error)
    }
  }

  const savePreferredVolumeUnit = async (unit: VolumeUnit) => {
    try {
      await AsyncStorage.setItem(PREFERRED_VOLUME_UNIT_KEY, unit)
      setPreferredVolumeUnit(unit)
    } catch (error) {
      console.error('Error saving preferred volume unit:', error)
    }
  }

  // Load when screen is focused
  useFocusEffect(
    useCallback(() => {
      loadPreferredVolumeUnit()
    }, [])
  )

  return { preferredVolumeUnit, savePreferredVolumeUnit }
}

export default usePreferredVolumeUnits
