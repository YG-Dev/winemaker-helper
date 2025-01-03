import { FC } from 'react'
import { StyleSheet, ViewStyle, StyleProp } from 'react-native'
import {
  MD3Theme,
  TextInput,
  TextInputProps,
  useTheme
} from 'react-native-paper'

type CustomTextInputProps = TextInputProps & {
  style?: StyleProp<ViewStyle>
}

const CustomTextInput: FC<CustomTextInputProps> = ({ style, ...props }) => {
  const theme = useTheme()
  const styles = getStyles(theme)

  return <TextInput mode="outlined" style={[styles.input, style]} {...props} />
}

const getStyles = (theme: MD3Theme) =>
  StyleSheet.create({
    input: {
      marginBottom: 16,
      backgroundColor: theme.colors.surface,
      borderRadius: theme.roundness
    }
  })

export default CustomTextInput
