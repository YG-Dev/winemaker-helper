import { BATCHES_KEY } from '@/constants/storage-keys'
import { Batch, BatchStage } from '@/constants/types'
import { useCallback, useEffect, useState } from 'react'
import { Text, View, StyleSheet, FlatList, Button } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { router, useFocusEffect } from 'expo-router'
import { Calendar } from 'react-native-calendars'

type CalendarStage = BatchStage & {
  batchName: string
  batchId: string
}

export default function CalendarView() {
  const [batches, setBatches] = useState<Batch[]>([])
  const [selectedDate, setSelectedDate] = useState('')
  const [stagesOnDate, setStagesOnDate] = useState<CalendarStage[]>([])

  const loadBatches = async () => {
    try {
      const storedBatches = await AsyncStorage.getItem(BATCHES_KEY)
      if (storedBatches) {
        setBatches(JSON.parse(storedBatches))
      }
    } catch (error) {
      console.error('Failed to load on calendar screen:', error)
    }
  }

  useFocusEffect(
    useCallback(() => {
      loadBatches()
    }, [])
  )

  useEffect(() => {
    if (selectedDate) {
      const stages = batches
        .flatMap((batch) =>
          batch.stages.map((stage) => ({
            ...stage,
            batchName: batch.name,
            batchId: batch.id
          }))
        )
        .filter((stage) => stage.date === selectedDate)
      setStagesOnDate(stages)
    } else {
      setStagesOnDate([])
    }
  }, [selectedDate, batches])

  return (
    <View style={styles.container}>
      <Calendar
        onDayPress={(day: any) => setSelectedDate(day.dateString)}
        markedDates={{
          [selectedDate]: {
            selected: true,
            marked: true,
            selectedColor: '#00adf5'
          },
          ...batches.reduce(
            (acc, batch) => {
              batch.stages.forEach((stage) => {
                acc[stage.date] = {
                  marked: true,
                  dotColor: 'red'
                }
              })
              return acc
            },
            {} as Record<string, any>
          )
        }}
      />

      <Text style={styles.dateTitle}>
        {selectedDate ? `Stages on ${selectedDate}` : 'Select a date'}
      </Text>

      {/* Stages on Selected Date */}
      {stagesOnDate.length > 0 ? (
        <FlatList
          data={stagesOnDate}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.stageItem}>
              <View style={styles.stageDetails}>
                <Text style={styles.stageDescription}>{item.description}</Text>
                <Text style={styles.stageBatch}>Batch: {item.batchName}</Text>
              </View>
              <Button
                title="View Batch"
                onPress={() => router.push(`/batches/${item.batchId}`)}
              />
            </View>
          )}
        />
      ) : (
        <Text style={styles.noStages}>
          {selectedDate ? 'No stages on this date.' : ''}
        </Text>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff'
  },
  dateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 16
  },
  stageItem: {
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginBottom: 8,
    elevation: 1
  },
  stageDetails: {
    flex: 1,
    marginRight: 8
  },
  stageDescription: {
    fontSize: 16
  },
  stageBatch: {
    fontSize: 14,
    color: '#666'
  },
  noStages: {
    fontSize: 16,
    color: '#999'
  }
})
