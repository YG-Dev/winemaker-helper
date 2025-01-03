import { FC } from 'react'
import { Calendar, CalendarProps } from 'react-native-calendars'
import { useTheme } from 'react-native-paper'

const CustomCalendar: FC<CalendarProps> = ({ ...props }) => {
  const theme = useTheme()

  const defaultTheme = {
    arrowColor: theme.colors.secondary,
    calendarBackground: theme.colors.background,
    textSectionTitleColor: theme.colors.primary,
    selectedDayBackgroundColor: theme.colors.primary,
    todayTextColor: theme.colors.primary,
    dayTextColor: theme.colors.onSurface,
    textDisabledColor: theme.colors.surfaceDisabled,
    dotColor: theme.colors.secondary,
    selectedDotColor: theme.colors.onPrimary
  }

  return <Calendar {...props} theme={{ defaultTheme, ...props?.theme }} />
}

export default CustomCalendar
