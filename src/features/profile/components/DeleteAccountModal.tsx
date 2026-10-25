import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Button } from "@/components/common/Button";
import { COLORS } from "@/constants/theme";

type Props = {
  visible: boolean;
  onClose: () => void;
  onConfirm: (password: string) => Promise<void>;
};

export function DeleteAccountModal({ visible, onClose, onConfirm }: Props) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const cerrar = () => {
    if (loading) return;
    setPassword("");
    setError("");
    onClose();
  };

  const confirmar = async () => {
    if (!password) return setError("Escribe tu contraseña para confirmar.");
    setError("");
    setLoading(true);
    try {
      await onConfirm(password);
      // Si sale bien, la sesión se cierra y la app te lleva al inicio de sesión
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo eliminar la cuenta.");
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={cerrar}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.overlay}
      >
        <View style={styles.card}>
          <Text style={styles.title}>Eliminar mi cuenta</Text>
          <Text style={styles.body}>
            Se borrarán para siempre tu cuenta y todos tus datos: ingresos, gastos, categorías
            y registros de oro. Esta acción no se puede deshacer.
          </Text>

          <Text style={styles.label}>Escribe tu contraseña para confirmar</Text>
          <TextInput
            style={styles.input}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
            value={password}
            onChangeText={setPassword}
            placeholder="Contraseña"
            placeholderTextColor={COLORS.textSecondary}
          />
          {error ? <Text style={styles.error}>{error}</Text> : null}

          <View style={styles.actions}>
            <Button title="Cancelar" variant="outline" onPress={cerrar} disabled={loading} style={styles.actionButton} />
            <Button
              title="Eliminar"
              variant="expense"
              onPress={confirmar}
              loading={loading}
              style={styles.actionButton}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(43, 45, 66, 0.45)",
    justifyContent: "center",
    padding: 24,
  },
  card: { backgroundColor: COLORS.card, borderRadius: 24, padding: 20 },
  title: { fontSize: 18, fontWeight: "800", color: COLORS.textPrimary, marginBottom: 8 },
  body: { fontSize: 14, lineHeight: 21, color: COLORS.textSecondary, marginBottom: 16 },
  label: { fontSize: 13, fontWeight: "600", color: COLORS.textPrimary, marginBottom: 8 },
  input: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    height: 48,
    paddingHorizontal: 12,
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  error: { color: COLORS.expense, fontSize: 13, marginTop: 8 },
  actions: { flexDirection: "row", gap: 10, marginTop: 20 },
  actionButton: { flex: 1 },
});