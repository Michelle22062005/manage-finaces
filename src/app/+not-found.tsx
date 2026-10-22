import { Link, Stack } from "expo-router";
import { StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function NotFoundScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: "Página no encontrada" }} />
      <Text style={styles.title}>No encontramos esta pantalla</Text>
      <Link href="/" style={styles.link}>
        Volver al inicio
      </Link>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F4F9FD",
    padding: 24,
  },
  title: {
    color: "#2B2D42",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 16,
  },
  link: {
    color: "#4EA8DE",
    fontSize: 16,
    fontWeight: "600",
  },
});