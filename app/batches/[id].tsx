import { useLocalSearchParams } from 'expo-router'
import { Text, View, StyleSheet } from 'react-native'

export default function BatchDetailsView() {
  const { id } = useLocalSearchParams()

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Batch Details</Text>
      <Text>Batch ID: {id}</Text>
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
  }
})
