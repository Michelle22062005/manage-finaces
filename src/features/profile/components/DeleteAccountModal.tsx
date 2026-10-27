import { Button } from "@/components/common/Button";
import { CategoryIcon } from "@/components/common/CategoryIcon";
import { COLORS } from "@/constants/theme";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

const SEGUNDOS_MENSAJE = 3;

type Props = {
  visible: boolean;
  onClose: () => void;
  /** Borra la cuenta en el servidor. Lanza un error si algo falla. */
  onConfirm: (password: string) => Promise<void>;
  /** Se llama cuando termina de mostrarse el mensaje de éxito. */
  onFinished: () => void;
};

export function DeleteAccountModal({
  visible,
  onClose,
  onConfirm,
  onFinished,
}: Props) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  // Guardamos la función en una referencia para que el temporizador
  // no se reinicie si la pantalla se vuelve a dibujar.
  const onFinishedRef = useRef(onFinished);
  onFinishedRef.current = onFinished;

  useEffect(() => {
    if (!done) return;
    const id = setTimeout(
      () => onFinishedRef.current(),
      SEGUNDOS_MENSAJE * 2000,
    );
    return () => clearTimeout(id);
  }, [done]);

  const cerrar = () => {
    if (loading || done) return;
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
      setLoading(false);
      setDone(true);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "No se pudo eliminar la cuenta.",
      );
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={cerrar}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.overlay}
      >
        <View style={styles.card}>
          {done ? (
            <View style={styles.doneBox}>
              <View style={styles.doneIcon}>
                <CategoryIcon
                  name="check-circle"
                  size={40}
                  color={COLORS.secondary}
                />
              </View>
              <Text style={styles.doneTitle}>Cuenta eliminada</Text>
              <Text style={styles.body}>
                Tu cuenta y todos tus datos se borraron correctamente. Te
                llevaremos al inicio de sesión.
              </Text>
              <ActivityIndicator
                color={COLORS.primary}
                style={{ marginTop: 8 }}
              />
            </View>
          ) : (
            <>
              <Text style={styles.title}>Eliminar Mis Finanzas</Text>
              <Text style={styles.body}>
                Se borrarán para siempre tu cuenta y todos tus datos: ingresos,
                gastos, categorías y registros de oro. Esta acción no se puede
                deshacer.
              </Text>

              <Text style={styles.label}>
                Escribe tu contraseña para confirmar
              </Text>
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
                <Button
                  title="Cancelar"
                  variant="outline"
                  onPress={cerrar}
                  disabled={loading}
                  style={styles.actionButton}
                />
                <Button
                  title="Eliminar"
                  variant="expense"
                  onPress={confirmar}
                  loading={loading}
                  style={styles.actionButton}
                />
              </View>
            </>
          )}
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
  title: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  body: {
    fontSize: 14,
    lineHeight: 21,
    color: COLORS.textSecondary,
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
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

  // Mensaje de éxito
  doneBox: { alignItems: "center", paddingVertical: 8 },
  doneIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#E6F7EC",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  doneTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
});
