import { Batch } from '@/constants/types'
import { router, useLocalSearchParams } from 'expo-router'
import { useState, useEffect } from 'react'
import { View, FlatList, StyleSheet, Alert } from 'react-native'
import { useTheme, Button, Text } from 'react-native-paper'
import useBatches from '@/hooks/useBatches'
import { MD3Theme } from 'react-native-paper/lib/typescript/types'
import PageLoader from '@/components/page-loader'
import AddStageModal from '@/components/app/batches/add-stage-modal'

export default function BatchDetailsView() {
  const { id }: { id: string } = useLocalSearchParams()
  const { batches, getBatchById, updateBatch, deleteBatch, isLoading } =
    useBatches()

  const [batch, setBatch] = useState<Batch | null>()
  const [isModalVisible, setModalVisible] = useState(false)

  const theme = useTheme()
  const styles = getStyles(theme)

  useEffect(() => {
    if (batches) {
      setBatch(getBatchById(id))
    }
  }, [batches, id, getBatchById])

  const toggleModal = () => {
    setModalVisible(!isModalVisible)
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

  const handleAddStageSave = (updatedBatch: Batch) => {
    setBatch(updatedBatch)
    updateBatch(updatedBatch)
  }

  if (isLoading || !batch) {
    return <PageLoader />
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{batch.name}</Text>
      <Text style={styles.detail}>Quantity: {batch.quantity} L</Text>
      <Text style={styles.detail}>Created At: {batch.createdAt}</Text>
      <Text style={styles.detail}>
        Status: {batch.isFinished ? 'Finished' : 'In Progress'}
      </Text>
      {!!batch.description && (
        <Text style={styles.detail}>{batch.description}</Text>
      )}
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

      <AddStageModal
        isModalVisible={isModalVisible}
        toggleModal={toggleModal}
        batch={batch}
        onSave={handleAddStageSave}
      />
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
