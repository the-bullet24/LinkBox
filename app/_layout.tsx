import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ShareIntentProvider } from 'expo-share-intent';
import React from 'react';
import { FoldersProvider } from '../src/store/FoldersContext';
import { colors } from '../src/theme';

export default function RootLayout() {
  return (
    // ShareIntentProvider escucha el menú "Compartir" de Android.
    // En Expo Go no hay módulo nativo, así que simplemente no recibe nada (no rompe la app).
    <ShareIntentProvider>
      <FoldersProvider>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.bg },
            animation: 'slide_from_right',
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="folder/[id]" />
          <Stack.Screen name="save/index" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
          <Stack.Screen name="settings/index" />
        </Stack>
      </FoldersProvider>
    </ShareIntentProvider>
  );
}
