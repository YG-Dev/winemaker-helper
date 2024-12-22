import { BatchStage } from '@/constants/types'
import { useEffect, useState } from 'react'
import { View, StyleSheet, FlatList } from 'react-native'
import { router } from 'expo-router'
import { Calendar } from 'react-native-calendars'
import { MD3Theme, useTheme, Text, Button } from 'react-native-paper'
import useBatches from '@/hooks/useBatches'
import PageLoader from '@/components/page-loader'

type CalendarStage = BatchStage & {
  batchName: string
  batchId: string
}

export default function CalendarView() {
  const { batches, isLoading } = useBatches()
  const [selectedDate, setSelectedDate] = useState('')
  const [stagesOnDate, setStagesOnDate] = useState<CalendarStage[]>([])

  const theme = useTheme()
  const styles = getStyles(theme)

  useEffect(() => {
    if (selectedDate && batches) {
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
        onDayPress={(day: { dateString: string }) =>
          setSelectedDate(day.dateString)
        }
        markedDates={{
          [selectedDate]: {
            selected: true,
            marked: true,
            selectedColor: theme.colors.primary
          },
          ...batches?.reduce(
            (acc, batch) => {
              batch.stages.forEach((stage) => {
                acc[stage.date] = {
                  marked: true,
                  dotColor: theme.colors.secondary
                }
              })
              return acc
            },
            {} as Record<string, any>
          )
        }}
        theme={{
          arrowColor: theme.colors.secondary,
          calendarBackground: theme.colors.background,
          textSectionTitleColor: theme.colors.primary,
          selectedDayBackgroundColor: theme.colors.primary,
          todayTextColor: theme.colors.primary,
          dayTextColor: theme.colors.onSurface,
          textDisabledColor: theme.colors.surfaceDisabled,
          dotColor: theme.colors.secondary,
          selectedDotColor: theme.colors.onPrimary
        }}
      />

      <Text style={styles.dateTitle}>
        {selectedDate ? `Stages on ${selectedDate}` : 'Select a date'}
      </Text>

      {isLoading && <PageLoader />}

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
                mode="text"
                onPress={() => router.push(`/batches/${item.batchId}`)}
                textColor={theme.colors.surface}
                buttonColor={theme.colors.primary}
              >
                View Batch
              </Button>
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

const getStyles = (theme: MD3Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: theme.colors.background
    },
    dateTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginVertical: 16,
      color: theme.colors.onBackground
    },
    stageItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      backgroundColor: theme.colors.surface,
      borderRadius: theme.roundness,
      marginBottom: 8,
      elevation: 1
    },
    stageDetails: {
      flex: 1,
      marginRight: 8
    },
    stageDescription: {
      fontSize: 16,
      color: theme.colors.onSurface
    },
    stageBatch: {
      fontSize: 14,
      color: theme.colors.onSurfaceVariant || '#666',
      marginTop: 4
    },
    noStages: {
      fontSize: 16,
      color: theme.colors.onBackground,
      textAlign: 'center',
      marginTop: 16
    }
  })
