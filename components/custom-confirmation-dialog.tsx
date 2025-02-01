import { FC } from 'react'
import { StyleSheet } from 'react-native'
import { useTheme, Dialog, DialogProps, Text, Button } from 'react-native-paper'

type CustomConfirmationDialogProps = Omit<DialogProps, 'children'> & {
  title: string
  description: string
  toggle: () => void
  onCofirm: () => void
}

const CustomConfirmationDialog: FC<CustomConfirmationDialogProps> = ({
  title,
  description,
  toggle,
  onCofirm,
  ...props
}) => {
  const theme = useTheme()
  const styles = getStyles()

  const handleConfirm = () => {
    toggle()
    onCofirm()
  }
  return (
    <Dialog {...props}>
      <Dialog.Title>{title}</Dialog.Title>
      <Dialog.Content>
        <Text variant="bodyMedium">{description}</Text>
      </Dialog.Content>
      <Dialog.Actions style={styles.actionsContainer}>
        <Button
          onPress={toggle}
          textColor={theme.colors.error}
          style={{ flex: 1 }}
        >
          Cancel
        </Button>
        <Button
          onPress={handleConfirm}
          textColor={theme.colors.surface}
          buttonColor={theme.colors.primary}
          style={{ flex: 1 }}
        >
          Confirm
        </Button>
      </Dialog.Actions>
    </Dialog>
  )
}

const getStyles = () =>
  StyleSheet.create({
    actionsContainer: {
      justifyContent: 'flex-end',
      gap: 20
    }
  })

export default CustomConfirmationDialog
