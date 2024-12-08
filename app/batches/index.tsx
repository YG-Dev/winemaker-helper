import { useState } from 'react'
import { View, Text, Button, FlatList, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import { Batch } from '@/constants/types'

export default function BatchesView() {
  const router = useRouter()
  const [batches, setBatches] = useState<Batch[]>([])

  const addBatch = () => {
    const newBatch = {
      id: Date.now().toString(),
      name: `Batch ${batches.length + 1}`
    }
    setBatches([...batches, newBatch])
  }

  return (
    <View style={styles.container}>
      <Button title="Add Batch" onPress={addBatch} />
      <FlatList
        data={batches}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Text
            style={styles.item}
            onPress={() => router.push(`/batches/${item.id}`)}
          >
            {item.name}
          </Text>
        )}
      />
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
  }
})
