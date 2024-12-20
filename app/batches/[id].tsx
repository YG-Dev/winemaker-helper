import { Batch, BatchStage } from '@/constants/types'
import { router, useLocalSearchParams } from 'expo-router'
import { useState, useEffect } from 'react'
import { View, FlatList, Modal, StyleSheet, Alert } from 'react-native'
import {
  useTheme,
  Button,
  TextInput,
  Text,
  ActivityIndicator
} from 'react-native-paper'
import useBatches from '@/hooks/useBatches'
import { MD3Theme } from 'react-native-paper/lib/typescript/types'

export default function BatchDetailsView() {
  const { id }: { id: string } = useLocalSearchParams()
  const { batches, getBatchById, updateBatch, deleteBatch, isLoading } =
    useBatches()

  const [batch, setBatch] = useState<Batch | null>()
  const [isModalVisible, setModalVisible] = useState(false)
  const [stageDescription, setStageDescription] = useState('')
  const [stageDate, setStageDate] = useState('')

  const theme = useTheme()
  const styles = getStyles(theme)

  useEffect(() => {
    if (batches) {
      setBatch(getBatchById(id))
    }
  }, [batches, id])

  const toggleModal = () => setModalVisible(!isModalVisible)

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
      updateBatch(updatedBatch)
      setBatch(updatedBatch)
      toggleModal()
      setStageDescription('')
      setStageDate('')
    }
  }

  const handleRemoveStage = (stageId: number) => {
    if (batch) {
      const updatedStages = batch.stages.filter((stage) => stage.id !== stageId)
      const updatedBatch = { ...batch, stages: updatedStages }
      updateBatch(updatedBatch)
      setBatch(updatedBatch)
    }
  }

  const handleRemoveBatch = () => {
    deleteBatch(id)
    Alert.alert('Batch Deleted', 'The batch has been deleted.')
    router.push('/batches')
  }

  if (isLoading || !batch) {
    return (
      <View style={styles.container}>
        <ActivityIndicator
          size="large"
          color={theme.colors.primary}
          style={{ flex: 1 }}
        />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{batch.name}</Text>
      <Text style={styles.detail}>Quantity: {batch.quantity} L</Text>
      <Text style={styles.detail}>Created At: {batch.createdAt}</Text>
      <Text style={styles.detail}>
        Status: {batch.isFinished ? 'Finished' : 'In Progress'}
      </Text>
      <Button
        mode="text"
        onPress={handleRemoveBatch}
        textColor={theme.colors.surface}
        buttonColor={theme.colors.error}
      >
        Delete Batch
      </Button>

      {/* Display stages in a list */}
      <Text style={styles.subTitle}>Stages:</Text>
      {batch.stages.length > 0 ? (
        <FlatList
          data={batch.stages}
          keyExtractor={(stage) => stage.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.stageItem}>
              <Text style={styles.stageDescription}>{item.description}</Text>
              <Text style={styles.stageDate}>Date: {item.date}</Text>
              <Button
                mode="text"
                onPress={() => handleRemoveStage(item.id)}
                textColor={theme.colors.surface}
                buttonColor={theme.colors.error}
              >
                Remove
              </Button>
            </View>
          )}
        />
      ) : (
        <Text style={styles.emptyText}>No stages added yet.</Text>
      )}

      <Button
        mode="text"
        onPress={toggleModal}
        textColor={theme.colors.surface}
        buttonColor={theme.colors.primary}
      >
        New Stage
      </Button>

      {/* Add Stage Modal */}
      <Modal visible={isModalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Stage</Text>
            <TextInput
              mode="outlined"
              style={styles.input}
              label="Stage Description"
              value={stageDescription}
              onChangeText={setStageDescription}
            />
            <TextInput
              mode="outlined"
              style={styles.input}
              label="Stage Date (YYYY-MM-DD)"
              value={stageDate}
              onChangeText={setStageDate}
            />
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
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 16,
      color: theme.colors.primary
    },
    detail: {
      fontSize: 16,
      marginBottom: 8,
      color: theme.colors.onBackground
    },
    subTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginTop: 16,
      marginBottom: 8,
      color: theme.colors.onBackground
    },
    stageItem: {
      padding: 12,
      borderRadius: theme.roundness,
      backgroundColor: theme.colors.surface,
      marginBottom: 8,
      elevation: 1
    },
    stageDescription: {
      fontSize: 16,
      color: theme.colors.onSurface,
      marginBottom: 4
    },
    stageDate: {
      fontSize: 14,
      color: theme.colors.onSurfaceVariant || '#666',
      marginBottom: 4
    },
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
    input: {
      marginBottom: 16,
      backgroundColor: theme.colors.surface,
      borderRadius: theme.roundness
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 16
    },
    removeStageButton: {
      marginTop: 8,
      padding: 6,
      borderRadius: theme.roundness,
      backgroundColor: theme.colors.error
    },
    removeStageText: {
      color: theme.colors.onError,
      textAlign: 'center'
    },
    emptyText: {
      marginTop: 16,
      textAlign: 'center',
      color: theme.colors.onBackground
    }
  })
