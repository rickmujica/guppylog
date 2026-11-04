import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router/js-tabs';

import { useUI } from '@/lib/settings';

export default function TabsLayout() {
  const { theme, t } = useUI();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.accent,
        tabBarInactiveTintColor: theme.muted,
        tabBarStyle: { backgroundColor: theme.bg, borderTopColor: theme.border },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: t('tab.aquariums'),
          tabBarIcon: ({ color, size }) => <Ionicons name="water-outline" size={size} color={color as string} />,
        }}
      />
      <Tabs.Screen
        name="reminders"
        options={{
          title: t('tab.reminders'),
          tabBarIcon: ({ color, size }) => <Ionicons name="notifications-outline" size={size} color={color as string} />,
        }}
      />
      <Tabs.Screen
        name="library"
        options={{
          title: t('tab.library'),
          tabBarIcon: ({ color, size }) => <Ionicons name="book-outline" size={size} color={color as string} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t('tab.settings'),
          tabBarIcon: ({ color, size }) => <Ionicons name="options-outline" size={size} color={color as string} />,
        }}
      />
    </Tabs>
  );
}
