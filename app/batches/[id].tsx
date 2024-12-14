import { Batch, BatchStage } from '@/constants/types'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { router, useLocalSearchParams } from 'expo-router'
import { useState, useEffect } from 'react'
import {
  Text,
  View,
  StyleSheet,
  Alert,
  FlatList,
  Button,
  Modal,
  TextInput,
  TouchableOpacity
} from 'react-native'
import { BATCHES_KEY } from '@/constants/storage-keys'

export default function BatchDetailsView() {
  const { id } = useLocalSearchParams()
  const [batch, setBatch] = useState<Batch | null>(null)
  const [isModalVisible, setModalVisible] = useState(false)
  const [stageDescription, setStageDescription] = useState('')
  const [stageDate, setStageDate] = useState('')

  useEffect(() => {
    const loadBatch = async () => {
      try {
        const storedBatches = await AsyncStorage.getItem(BATCHES_KEY)
        if (storedBatches) {
          const parsedBatches: Batch[] = JSON.parse(storedBatches)
          const foundBatch = parsedBatches.find((b) => b.id === id)
          if (foundBatch) {
            setBatch(foundBatch)
          } else {
            Alert.alert('Error', 'Batch not found.')
          }
        }
      } catch (error) {
        console.error('Failed to load batch:', error)
      }
    }

    loadBatch()
  }, [id])

  const toggleModal = () => setModalVisible(!isModalVisible)

  const handleAddStage = async () => {
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
      const updatedBatch = {
        ...batch,
        stages: [...batch.stages, newStage]
      }

      try {
        const storedBatches = await AsyncStorage.getItem(BATCHES_KEY)
        if (storedBatches) {
          const parsedBatches: Batch[] = JSON.parse(storedBatches)
          const batchIndex = parsedBatches.findIndex((b) => b.id === id)
          if (batchIndex !== -1) {
            parsedBatches[batchIndex] = updatedBatch
            await AsyncStorage.setItem(
              BATCHES_KEY,
              JSON.stringify(parsedBatches)
            )
            setBatch(updatedBatch)
            toggleModal()
            setStageDescription('')
            setStageDate('')
          }
        }
      } catch (error) {
        console.error('Failed to save stage:', error)
        Alert.alert('Error', 'Failed to save the new stage.')
      }
    }
  }

  const handleRemoveBatch = async () => {
    try {
      const storedBatches = await AsyncStorage.getItem(BATCHES_KEY)
      if (storedBatches) {
        const parsedBatches: Batch[] = JSON.parse(storedBatches)
        const updatedBatches = parsedBatches.filter((b) => b.id !== id)
        await AsyncStorage.setItem(BATCHES_KEY, JSON.stringify(updatedBatches))
        Alert.alert('Batch Deleted', 'The batch has been deleted.')
        router.push('/batches')
      }
    } catch (error) {
      console.error('Failed to delete batch:', error)
      Alert.alert('Error', 'Failed to delete the batch.')
    }
  }

  const handleRemoveStage = async (stageId: number) => {
    if (batch) {
      const updatedStages = batch.stages.filter((stage) => stage.id !== stageId)
      const updatedBatch = { ...batch, stages: updatedStages }

      try {
        const storedBatches = await AsyncStorage.getItem(BATCHES_KEY)
        if (storedBatches) {
          const parsedBatches: Batch[] = JSON.parse(storedBatches)
          const batchIndex = parsedBatches.findIndex((b) => b.id === id)
          if (batchIndex !== -1) {
            parsedBatches[batchIndex] = updatedBatch
            await AsyncStorage.setItem(
              BATCHES_KEY,
              JSON.stringify(parsedBatches)
            )
            setBatch(updatedBatch)
          }
        }
      } catch (error) {
        console.error('Failed to remove stage:', error)
        Alert.alert('Error', 'Failed to remove the stage.')
      }
    }
  }

  if (!batch) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Batch Details</Text>
        <Text>Loading...</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{batch.name}</Text>
      <Text style={styles.detail}>Quantity: {batch.quantity} L</Text>
      <Text style={styles.detail}>
        Created At: {new Date(batch.createdAt).toLocaleDateString()}
      </Text>
      <Text style={styles.detail}>
        Status: {batch.isFinished ? 'Finished' : 'In Progress'}
      </Text>
      <Button
        title="Delete Batch"
        onPress={handleRemoveBatch}
        color="#ff5c5c"
      />

      {/* Display Stages */}
      <Text style={styles.subTitle}>Stages:</Text>
      {batch.stages.length > 0 ? (
        <FlatList
          data={batch.stages}
          keyExtractor={(stage) => stage.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.stageItem}>
              <Text style={styles.stageDescription}>{item.description}</Text>
              <Text style={styles.stageDate}>
                Date: {new Date(item.date).toLocaleDateString()}
              </Text>
              <TouchableOpacity
                style={styles.removeStageButton}
                onPress={() => handleRemoveStage(item.id)}
              >
                <Text style={styles.removeStageText}>Remove</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      ) : (
        <Text>No stages added yet.</Text>
      )}

      {/* Add Stage Button */}
      <Button title="Add Stage" onPress={toggleModal} />

      {/* Modal for Adding a Stage */}
      <Modal visible={isModalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Stage</Text>
            <TextInput
              style={styles.input}
              placeholder="Stage Description"
              value={stageDescription}
              onChangeText={setStageDescription}
            />
            <TextInput
              style={styles.input}
              placeholder="Stage Date (YYYY-MM-DD)"
              value={stageDate}
              onChangeText={setStageDate}
            />
            <View style={styles.buttonContainer}>
              <Button title="Cancel" onPress={toggleModal} color="#ff5c5c" />
              <Button title="Add Stage" onPress={handleAddStage} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16
  },
  detail: {
    fontSize: 16,
    marginBottom: 8
  },
  subTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8
  },
  stageItem: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#f9f9f9'
  },
  stageDescription: {
    fontSize: 16
  },
  stageDate: {
    fontSize: 14,
    color: '#666',
    marginTop: 4
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center'
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 8,
    marginBottom: 16
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 16
  },
  removeStageButton: {
    marginTop: 8,
    padding: 4,
    backgroundColor: '#ff5c5c',
    borderRadius: 4
  },
  removeStageText: {
    color: '#fff',
    textAlign: 'center'
  }
})
