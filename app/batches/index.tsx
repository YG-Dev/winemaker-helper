import { useState } from 'react'
import { FlatList, StyleSheet, Modal, View } from 'react-native'
import { useRouter } from 'expo-router'
import { createBatch } from '@/utils/batch-helpers'
import useBatches from '@/hooks/useBatches'
import { Batch } from '@/constants/types'
import {
  Button,
  Card,
  Text,
  TextInput,
  FAB,
  Provider as PaperProvider,
  useTheme,
  MD3Theme
} from 'react-native-paper'

export default function BatchesView() {
  const router = useRouter()
  const { batches, setBatches, getBatchById } = useBatches()
  const [isModalVisible, setModalVisible] = useState(false)
  const [batchName, setBatchName] = useState('')
  const [batchQuantity, setBatchQuantity] = useState('')
  const theme = useTheme()
  const styles = getStyles(theme)

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
    <PaperProvider theme={theme}>
      <View style={styles.container}>
        <FlatList
          data={batches}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Card
              style={styles.card}
              onPress={() => router.push(`/batches/${item.id}`)}
            >
              <Card.Title
                title={item.name}
                subtitle={`Quantity: ${item.quantity} L`}
              />
              <Card.Content>
                <Text variant="bodySmall" style={styles.dateText}>
                  Added: {item.createdAt}
                </Text>
              </Card.Content>
            </Card>
          )}
          ListEmptyComponent={
            <Text variant="bodyMedium" style={styles.emptyText}>
              No batches added yet. Tap the "+" button to add a new batch.
            </Text>
          }
        />
        <FAB
          icon="plus"
          style={[styles.fab, { backgroundColor: theme.colors.primary }]}
          color={theme.colors.onPrimary}
          onPress={toggleModal}
        />

        <Modal visible={isModalVisible} animationType="slide" transparent>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text variant="headlineSmall" style={styles.modalTitle}>
                Add New Batch
              </Text>

              <TextInput
                mode="outlined"
                label="Batch Name"
                value={batchName}
                onChangeText={setBatchName}
                style={styles.input}
              />

              <TextInput
                mode="outlined"
                label="Batch Quantity (L)"
                value={batchQuantity}
                onChangeText={setBatchQuantity}
                keyboardType="numeric"
                style={styles.input}
              />

              <View style={styles.buttonContainer}>
                <Button
                  mode="text"
                  onPress={toggleModal}
                  textColor={theme.colors.error}
                >
                  Cancel
                </Button>
                <Button mode="contained" onPress={handleAddBatch}>
                  Add Batch
                </Button>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </PaperProvider>
  )
}

const getStyles = (theme: MD3Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      paddingHorizontal: 16
    },
    card: {
      marginVertical: 8,
      backgroundColor: theme.colors.surface,
      elevation: 2,
      borderRadius: theme.roundness,
      padding: 16
    },
    dateText: {
      marginTop: 8,
      color: theme.colors.onSurfaceVariant || theme.colors.onSurface
    },
    emptyText: {
      textAlign: 'center',
      marginTop: 16,
      color: theme.colors.onBackground
    },
    fab: {
      position: 'absolute',
      bottom: 16,
      right: 16,
      backgroundColor: theme.colors.secondary
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
      marginBottom: 16,
      textAlign: 'center',
      color: theme.colors.onSurface,
      fontSize: 18,
      fontWeight: 'bold'
    },
    input: {
      marginBottom: 16,
      backgroundColor: theme.colors.surface,
      borderRadius: theme.roundness
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between'
    }
  })
