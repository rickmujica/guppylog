import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import { Stack } from 'expo-router/stack';
import { SQLiteProvider, type SQLiteDatabase } from 'expo-sqlite';
import { StatusBar } from 'expo-status-bar';
import { Suspense } from 'react';
import { ActivityIndicator, View } from 'react-native';

import { DB_NAME, migrate } from '@/lib/db';
import { seedDemo } from '@/lib/demo';
import { SettingsProvider, useSettings } from '@/lib/settings';

async function initDb(db: SQLiteDatabase) {
  await migrate(db);
  await seedDemo(db);
}

function Loading() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <ActivityIndicator />
    </View>
  );
}

function ThemedStack() {
  const { theme } = useSettings();
  const base = theme.mode === 'dark' ? DarkTheme : DefaultTheme;
  const navTheme = {
    ...base,
    colors: { ...base.colors, primary: theme.accent, background: theme.bg, card: theme.bg, text: theme.text, border: theme.border },
  };
  return (
    <ThemeProvider value={navTheme}>
      <StatusBar style={theme.mode === 'dark' ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: theme.bg },
          headerTintColor: theme.text,
          headerShadowVisible: false,
          headerBackButtonDisplayMode: 'minimal',
          contentStyle: { backgroundColor: theme.bg },
        }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="aquarium/[id]/water" options={{ presentation: 'modal' }} />
        <Stack.Screen name="aquarium/[id]/params" options={{ presentation: 'modal' }} />
        <Stack.Screen name="aquarium/[id]/reminder" options={{ presentation: 'modal' }} />
      </Stack>
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <Suspense fallback={<Loading />}>
      <SQLiteProvider databaseName={DB_NAME} onInit={initDb} useSuspense>
        <SettingsProvider>
          <ThemedStack />
        </SettingsProvider>
      </SQLiteProvider>
    </Suspense>
  );
}
