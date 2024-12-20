import { DefaultTheme } from 'react-native-paper'

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: 'rgb(98, 0, 238)',
    secondary: 'rgb(0, 0, 180)',
    background: 'rgb(243, 237, 247)',
    surface: 'rgb(255, 255, 255)',
    surfaceDisabled: 'rgb(153, 153, 153)',
    onSurface: 'rgb(22, 22, 22)',
    onBackground: 'rgb(74, 74, 74)',
    backdrop: 'rgba(0, 0, 0, 0.5)'
  }
}
