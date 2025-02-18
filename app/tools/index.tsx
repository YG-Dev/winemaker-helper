import { View, StyleSheet } from 'react-native'
import { Button } from 'react-native-paper'
import { router } from 'expo-router'
import { MaterialCommunityIcons } from '@expo/vector-icons' // Import icons

export default function ToolsView() {
  return (
    <View style={styles.container}>
      <Button
        mode="contained"
        icon={({ color }) => (
          <MaterialCommunityIcons name="cog" size={28} color={color} />
        )}
        onPress={() => router.push('/tools/settings')}
        style={styles.button}
        contentStyle={styles.buttonContent}
        labelStyle={styles.buttonLabel}
      >
        App Settings
      </Button>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 16
  },
  button: {
    width: '100%',
    marginTop: 16,
    paddingVertical: 12
  },
  buttonContent: { justifyContent: 'flex-start' },
  buttonLabel: { fontSize: 18 }
})
