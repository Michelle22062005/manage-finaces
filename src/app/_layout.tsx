import { DarkTheme, DefaultTheme, ThemeProvider, Stack } from 'expo-router';
import { useColorScheme } from 'react-native';

import { AuthStoreProvider } from '@/context/useAuthStore';
import { MovementsStoreProvider } from '@/context/useMovementsStore';

import { useEffect } from "react";
import * as NavigationBar from "expo-navigation-bar";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  
  useEffect(() => {
    NavigationBar.setVisibilityAsync("hidden")
  }, []);
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AuthStoreProvider>
        <MovementsStoreProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(main)" />
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="categoria/[id]" options={{ headerShown: true, title: 'Categoría' }} />
            <Stack.Screen name="+not-found" />
          </Stack>
        </MovementsStoreProvider>
      </AuthStoreProvider>
    </ThemeProvider>
  );
}
