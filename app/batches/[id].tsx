import { Batch } from '@/constants/types'
import { router, useLocalSearchParams } from 'expo-router'
import { useState, useEffect } from 'react'
import { View, FlatList, StyleSheet, Alert } from 'react-native'
import { useTheme, Button, Text, FAB } from 'react-native-paper'
import useBatches from '@/hooks/useBatches'
import { MD3Theme } from 'react-native-paper/lib/typescript/types'
import PageLoader from '@/components/page-loader'
import AddStageModal from '@/components/app/batches/add-stage-modal'
import BatchEditorModal from '@/components/app/batches/batch-editor-modal'
import CustomConfirmationDialog from '@/components/custom-confirmation-dialog'

export default function BatchDetailsView() {
  const { id }: { id: string } = useLocalSearchParams()
  const { batches, getBatchById, updateBatch, deleteBatch, isLoading } =
    useBatches()

  const [batch, setBatch] = useState<Batch | null>()
  const [isEditModalVisible, setEditModalVisible] = useState(false)
  const [isStageModalVisible, setStageModalVisible] = useState(false)
  const [isRemoveDialogVisible, setRemoveDialogVisible] = useState(false)

  const theme = useTheme()
  const styles = getStyles(theme)

  useEffect(() => {
    if (batches) {
      setBatch(getBatchById(id))
    }
  }, [batches, id, getBatchById])

  const toggleStageModal = () => setStageModalVisible(!isStageModalVisible)
  const toggleEditModal = () => setEditModalVisible(!isEditModalVisible)
  const toggleRemoveDialog = () =>
    setRemoveDialogVisible(!isRemoveDialogVisible)

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

  const handleUpdateBatch = (updatedBatch: Batch) => {
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
      {/* <Text style={styles.detail}>
        Status: {batch.isFinished ? 'Finished' : 'In Progress'}
      </Text> */}
      {!!batch.description && (
        <Text style={styles.detail}>{batch.description}</Text>
      )}

      <View style={styles.buttonGroup}>
        <Button
          mode="text"
          onPress={toggleEditModal}
          textColor={theme.colors.surface}
          buttonColor={theme.colors.primary}
          style={{ flex: 3 }}
        >
          Edit details
        </Button>
        <Button
          mode="text"
          onPress={toggleRemoveDialog}
          textColor={theme.colors.surface}
          buttonColor={theme.colors.error}
          style={{ flex: 1 }}
        >
          Remove Batch
        </Button>
      </View>

      {/* Display stages in a list */}
      <Text style={styles.subTitle}>Stages:</Text>
      {batch.stages.length > 0 ? (
        <FlatList
          data={batch.stages}
          keyExtractor={(stage) => stage.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.stageItem}>
              <View style={{ flex: 6 }}>
                <Text style={styles.stageDescription}>{item.description}</Text>
                <Text style={styles.stageDate}>Date: {item.date}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <FAB
                  icon="trash-can"
                  onPress={() => handleRemoveStage(item.id)}
                  style={styles.fab}
                  color={theme.colors.surface}
                />
              </View>
            </View>
          )}
        />
      ) : (
        <Text style={styles.emptyText}>No stages added yet.</Text>
      )}

      <Button
        mode="text"
        onPress={toggleStageModal}
        textColor={theme.colors.surface}
        buttonColor={theme.colors.primary}
      >
        New Stage
      </Button>

      <AddStageModal
        isModalVisible={isStageModalVisible}
        toggleModal={toggleStageModal}
        batch={batch}
        onSave={handleUpdateBatch}
      />
      <BatchEditorModal
        isModalVisible={isEditModalVisible}
        toggleModal={toggleEditModal}
        onSave={handleUpdateBatch}
        mode={'edit'}
        batch={batch}
      />
      <CustomConfirmationDialog
        title="Warning"
        description="Do you really want to remove this batch and all of its stages? This action is irreversible"
        visible={isRemoveDialogVisible}
        toggle={toggleRemoveDialog}
        onCofirm={handleRemoveBatch}
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
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: 12,
      paddingBottom: 16,
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
    fab: {
      position: 'absolute',
      right: 0,
      top: 0,
      backgroundColor: theme.colors.error
    },
    removeStageText: {
      color: theme.colors.onError,
      textAlign: 'center'
    },
    emptyText: {
      margin: 16,
      textAlign: 'center',
      color: theme.colors.onBackground
    },
    buttonGroup: {
      justifyContent: 'space-between',
      flexDirection: 'row',
      gap: 16
    }
  })
