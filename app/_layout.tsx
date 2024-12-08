import { Tabs } from 'expo-router'

export default function HomeLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="shopping-list" options={{ title: 'Shopping List' }} />
      <Tabs.Screen name="batches/index" options={{ title: 'Batches' }} />
      <Tabs.Screen name="calendar" options={{ title: 'Calendar' }} />
      <Tabs.Screen name="settings" options={{ title: 'Settings' }} />
    </Tabs>
  )
}
