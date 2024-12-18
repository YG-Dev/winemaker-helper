import { useState } from 'react'
import {
  View,
  Text,
  Button,
  FlatList,
  StyleSheet,
  Pressable,
  Modal,
  TextInput
} from 'react-native'
import { useRouter } from 'expo-router'
import { createBatch } from '@/utils/batch-helpers'
import useBatches from '@/hooks/useBatches'
import { Batch } from '@/constants/types'

export default function BatchesView() {
  const router = useRouter()
  const { batches, setBatches, getBatchById } = useBatches()
  const [isModalVisible, setModalVisible] = useState(false)
  const [batchName, setBatchName] = useState('')
  const [batchQuantity, setBatchQuantity] = useState('')

  const toggleModal = () => setModalVisible(!isModalVisible)

  const handleAddBatch = () => {
    if (!batchName.trim() || !batchQuantity.trim()) {
      alert('Please provide a valid name and quantity for the batch.')
      return
    }

    const newBatch = createBatch(batchName.trim(), parseFloat(batchQuantity))

    setBatches([...(batches as Batch[]), newBatch])
    setBatchName('')
    setBatchQuantity('')
    toggleModal()
  }

  getBatchById('')

  return (
    <View style={styles.container}>
      <Button title="Add Batch" onPress={toggleModal} />
      <FlatList
        data={batches}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable onPress={() => router.push(`/batches/${item.id}`)}>
            <View style={styles.item}>
              <Text style={styles.itemText}>{item.name}</Text>
              <Text style={styles.itemSubText}>
                Quantity: {item.quantity} L
              </Text>
              <Text>Added: {item.createdAt}</Text>
            </View>
          </Pressable>
        )}
      />
      <Modal visible={isModalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Batch</Text>

            <TextInput
              style={styles.input}
              placeholder="Batch Name"
              value={batchName}
              onChangeText={setBatchName}
            />

            <TextInput
              style={styles.input}
              placeholder="Batch Quantity (L)"
              value={batchQuantity}
              onChangeText={setBatchQuantity}
              keyboardType="numeric"
            />

            <View style={styles.buttonContainer}>
              <Button title="Cancel" onPress={toggleModal} color="#ff5c5c" />
              <Button title="Add Batch" onPress={handleAddBatch} />
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
  item: {
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc'
  },
  itemText: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  itemSubText: {
    fontSize: 14,
    color: '#666'
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
  }
})
