import { DarkTheme, DefaultTheme, ThemeProvider, Stack } from "expo-router";
import { Platform, useColorScheme } from "react-native";
import { useEffect } from "react";
import * as NavigationBar from "expo-navigation-bar";
import { MovementsStoreProvider } from "@/context/useMovementsStore";
import { useAuth } from "@/lib/auth";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { user, loading, init } = useAuth();

  useEffect(() => {
    init();
    if (Platform.OS === "android") {
      NavigationBar.setVisibilityAsync("hidden");
    }
  }, []);

  if (loading) return null;

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <MovementsStoreProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Protected guard={!!user}>
            <Stack.Screen name="(main)" />
            <Stack.Screen
              name="categoria/[id]"
              options={{ headerShown: true, title: "Categoría" }}
            />
          </Stack.Protected>

          <Stack.Protected guard={!user}>
            <Stack.Screen name="(auth)" />
          </Stack.Protected>

          <Stack.Screen name="+not-found" />
        </Stack>
      </MovementsStoreProvider>
    </ThemeProvider>
  );
}