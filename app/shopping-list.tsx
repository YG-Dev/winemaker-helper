import { ShoppingItem } from '@/constants/types'
import { useState } from 'react'
import {
  Text,
  View,
  TextInput,
  Button,
  FlatList,
  StyleSheet
} from 'react-native'

export default function ShoppingListView() {
  const [items, setItems] = useState<ShoppingItem[]>([])
  const [input, setInput] = useState('')

  const addItem = () => {
    if (input.trim()) {
      setItems([...items, { id: Date.now().toString(), text: input }])
      setInput('')
    }
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Add an item to purchase"
        value={input}
        onChangeText={setInput}
      />
      <Button title="Add" onPress={addItem} />
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <Text style={styles.item}>{item.text}</Text>}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16
  },
  input: {
    borderWidth: 1,
    padding: 8,
    marginBottom: 8,
    borderRadius: 4
  },
  item: {
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc'
  }
})
