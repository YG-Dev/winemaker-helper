import { View, StyleSheet } from 'react-native'
import { Text, RadioButton } from 'react-native-paper'
import usePreferredVolumeUnits from '@/hooks/usePreferredVolumeUnit'
import { VolumeUnit } from '@/constants/types'

export default function SettingsScreen() {
  const { preferredVolumeUnit, savePreferredVolumeUnit } =
    usePreferredVolumeUnits()

  return (
    <View style={styles.container}>
      <Text variant="headlineSmall">Select preferred volume unit</Text>

      <RadioButton.Group
        onValueChange={(value) => savePreferredVolumeUnit(value as VolumeUnit)}
        value={preferredVolumeUnit}
      >
        <RadioButton.Item label="Liters (L)" value="L" />
        <RadioButton.Item label="Gallons (Gal)" value="Gal" />
      </RadioButton.Group>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 20
  }
})
