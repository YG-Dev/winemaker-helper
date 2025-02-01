import { Batch, BatchStage } from '@/constants/types'
import { useState } from 'react'
import { View, Modal, StyleSheet, Alert } from 'react-native'
import { useTheme, Button, Text } from 'react-native-paper'
import { MD3Theme } from 'react-native-paper/lib/typescript/types'
import CustomCalendar from '@/components/custom-calendar'
import CustomTextInput from '@/components/custom-text-input'

type AddStageModalProps = {
  isModalVisible: boolean
  toggleModal: () => void
  batch: Batch
  onSave: (updatedBatch: Batch) => void
}

export default function AddStageModal({
  isModalVisible,
  toggleModal,
  batch,
  onSave
}: AddStageModalProps) {
  const theme = useTheme()
  const styles = getStyles(theme)

  const [stageDate, setStageDate] = useState('')
  const [isCalendarVisible, setCalendarVisible] = useState(false)
  const [stageDescription, setStageDescription] = useState('')

  const handleDateSelect = (day: any) => {
    setStageDate(day.dateString)
    setCalendarVisible(false)
  }

  const handleAddStage = () => {
    if (!stageDescription.trim() || !stageDate.trim()) {
      Alert.alert('Validation Error', 'Please fill out both fields.')
      return
    }

    const newStage: BatchStage = {
      id: Date.now(),
      description: stageDescription.trim(),
      date: stageDate.trim()
    }

    if (batch) {
      const updatedBatch = { ...batch, stages: [...batch.stages, newStage] }
      onSave(updatedBatch)
      toggleModal()
      setStageDescription('')
      setStageDate('')
    }
  }
  return (
    <View>
      <Modal visible={isModalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Stage</Text>
            <CustomTextInput
              label="Stage Description"
              value={stageDescription}
              onChangeText={setStageDescription}
            />
            <Button
              mode="text"
              onPress={() => setCalendarVisible(true)}
              textColor={theme.colors.surface}
              buttonColor={theme.colors.primary}
              style={styles.calendarButton}
            >
              {stageDate ? `Selected Date: ${stageDate}` : 'Pick a Date'}
            </Button>
            <View style={styles.buttonContainer}>
              <Button
                mode="text"
                onPress={toggleModal}
                textColor={theme.colors.error}
              >
                Cancel
              </Button>
              <Button
                mode="text"
                onPress={handleAddStage}
                textColor={theme.colors.surface}
                buttonColor={theme.colors.primary}
              >
                Add Stage
              </Button>
            </View>
          </View>
        </View>
      </Modal>

      {/* Calendar Picker Modal */}
      <Modal visible={isCalendarVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select a Date</Text>
            <CustomCalendar onDayPress={handleDateSelect} />
            <Button
              mode="text"
              onPress={() => setCalendarVisible(false)}
              textColor={theme.colors.error}
            >
              Close
            </Button>
          </View>
        </View>
      </Modal>
    </View>
  )
}

const getStyles = (theme: MD3Theme) =>
  StyleSheet.create({
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      backgroundColor: theme.colors.backdrop
    },
    modalContent: {
      margin: 16,
      padding: 16,
      borderRadius: theme.roundness,
      backgroundColor: theme.colors.surface,
      elevation: 3
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      textAlign: 'center',
      color: theme.colors.onSurface,
      marginBottom: 16
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 16
    },
    calendarButton: {
      marginBottom: 16
    }
  })
