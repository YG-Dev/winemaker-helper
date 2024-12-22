import { View } from 'react-native'
import { ActivityIndicator, useTheme } from 'react-native-paper'

export default function PageLoader() {
  const theme = useTheme()

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ActivityIndicator
        size="large"
        color={theme.colors.primary}
        style={{ flex: 1 }}
      />
    </View>
  )
}
