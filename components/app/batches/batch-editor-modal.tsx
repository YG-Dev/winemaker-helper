import { useCallback, useState } from 'react'
import { Modal, View, StyleSheet } from 'react-native'
import { Button, MD3Theme, Text, useTheme } from 'react-native-paper'
import CustomTextInput from '@/components/custom-text-input'
import { createBatch, editBatch } from '@/utils/batch-helpers'
import { Batch } from '@/constants/types'
import { useFocusEffect } from 'expo-router'

type CreateModeProps = {
  readonly mode: 'create'
  batch?: undefined
}

type EditModeProps = {
  readonly mode: 'edit'
  batch: Batch
}

type EditorBatchModalProps = (CreateModeProps | EditModeProps) & {
  isModalVisible: boolean
  toggleModal: () => void
  onSave: (handledBatch: Batch) => void
}

export default function BatchEditorModal({
  isModalVisible,
  toggleModal,
  onSave,
  mode,
  batch
}: EditorBatchModalProps) {
  const theme = useTheme()
  const styles = getStyles(theme)
  const isEdit = mode === 'edit'

  const [batchName, setBatchName] = useState(isEdit ? batch.name : '')
  const [batchQuantity, setBatchQuantity] = useState(
    isEdit ? String(batch.quantity) : ''
  )
  const [batchDescription, setBatchDescription] = useState(
    isEdit ? batch.description : ''
  )

  const handleAddBatch = () => {
    if (!batchName.trim() || !batchQuantity.trim()) {
      alert('Please provide a valid name and quantity for the batch.')
      return
    }

    const newBatch = createBatch(
      batchName.trim(),
      parseFloat(batchQuantity),
      batchDescription.trim()
    )

    setBatchName('')
    setBatchQuantity('')
    setBatchDescription('')
    onSave(newBatch)
    toggleModal()
  }

  const handleEditBatch = () => {
    if (mode !== 'edit') {
      console.error('Error. Tried to invoke edit in different mode')
      return
    }

    if (!batchName.trim() || !batchQuantity.trim()) {
      alert('Please provide a valid name and quantity for the batch.')
      return
    }

    const editedBach = editBatch(
      batch,
      batchName.trim(),
      parseFloat(batchQuantity),
      batchDescription.trim()
    )

    setBatchName('')
    setBatchQuantity('')
    setBatchDescription('')
    onSave(editedBach)
    toggleModal()
  }

  const handleSubmit = () => {
    mode === 'create' ? handleAddBatch() : handleEditBatch()
  }

  useFocusEffect(
    useCallback(() => {
      if (mode === 'edit' && batch) {
        setBatchName(batch.name)
        setBatchQuantity(String(batch.quantity))
        setBatchDescription(batch.description)
      }
    }, [batch])
  )

  return (
    <Modal
      visible={isModalVisible}
      animationType="slide"
      transparent
      key={isEdit ? batch.id : 'new'}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text variant="headlineSmall" style={styles.modalTitle}>
            {isEdit ? `Edit ${batch.name}` : 'Add New Batch'}
          </Text>

          <CustomTextInput
            label="Batch Name"
            value={batchName}
            onChangeText={setBatchName}
          />

          <CustomTextInput
            label="Batch Quantity (L)"
            value={batchQuantity}
            onChangeText={setBatchQuantity}
            keyboardType="numeric"
          />

          <CustomTextInput
            label="Batch Description (Optional)"
            value={batchDescription}
            onChangeText={setBatchDescription}
            multiline
          />

          <View style={styles.buttonContainer}>
            <Button
              mode="text"
              onPress={toggleModal}
              textColor={theme.colors.error}
            >
              Cancel
            </Button>
            <Button mode="contained" onPress={handleSubmit}>
              {isEdit ? 'Save Batch' : 'Add Batch'}
            </Button>
          </View>
        </View>
      </View>
    </Modal>
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
      marginBottom: 16,
      textAlign: 'center',
      color: theme.colors.onSurface,
      fontSize: 18,
      fontWeight: 'bold'
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between'
    }
  })
