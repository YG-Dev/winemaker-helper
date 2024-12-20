import { Tabs } from 'expo-router'
import { Provider as PaperProvider } from 'react-native-paper'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { theme } from '@/constants/theme'

export default function HomeLayout() {
  return (
    <PaperProvider theme={theme}>
      <Tabs
        screenOptions={{
          tabBarStyle: {
            backgroundColor: theme.colors.surface,
            borderTopWidth: 0,
            elevation: 4 // Shadow for Android
          },
          tabBarActiveTintColor: theme.colors.primary,
          tabBarInactiveTintColor: theme.colors.backdrop,
          headerStyle: {
            backgroundColor: theme.colors.primary
          },
          headerTintColor: theme.colors.surface,
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '600'
          }
        }}
      >
        <Tabs.Screen
          name="batches/index"
          options={{
            title: 'Batches',
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons
                name="format-list-bulleted"
                size={24}
                color={color}
              />
            )
          }}
        />
        <Tabs.Screen
          name="calendar"
          options={{
            title: 'Calendar',
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="calendar" size={24} color={color} />
            )
          }}
        />
        <Tabs.Screen
          name="tools"
          options={{
            title: 'Tools',
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="tools" size={24} color={color} />
            )
          }}
        />
        <Tabs.Screen name="index" options={{ href: null }} />
        <Tabs.Screen
          name="batches/[id]"
          options={{ title: 'Batch Details', href: null }}
        />
      </Tabs>
    </PaperProvider>
  )
}
