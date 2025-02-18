import { useState } from 'react'
import { FlatList, StyleSheet, View } from 'react-native'
import { useRouter } from 'expo-router'
import useBatches from '@/hooks/useBatches'
import { Batch } from '@/constants/types'
import {
  Card,
  Text,
  FAB,
  Provider as PaperProvider,
  useTheme,
  MD3Theme
} from 'react-native-paper'
import PageLoader from '@/components/page-loader'
import BatchEditorModal from '@/components/app/batches/batch-editor-modal'
import usePreferredVolumeUnits from '@/hooks/usePreferredVolumeUnit'

export default function BatchesView() {
  const router = useRouter()
  const { batches, isLoading, setBatches } = useBatches()
  const { preferredVolumeUnit } = usePreferredVolumeUnits()
  const [isModalVisible, setModalVisible] = useState(false)

  const theme = useTheme()
  const styles = getStyles(theme)

  const toggleModal = () => setModalVisible(!isModalVisible)

  const onAddBatchSave = (newBatch: Batch) => {
    setBatches([...(batches as Batch[]), newBatch])
  }

  if (isLoading) {
    return <PageLoader />
  }

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
                subtitle={`Quantity: ${item.quantity} ${preferredVolumeUnit}`}
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

        <BatchEditorModal
          isModalVisible={isModalVisible}
          toggleModal={toggleModal}
          onSave={onAddBatchSave}
          mode={'create'}
        />
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
    }
  })
