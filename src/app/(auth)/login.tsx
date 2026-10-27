import { useAuth } from "@/lib/auth";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
// Colores basados en tu paleta "Calidez en Ruta"
import { Button } from "@/components/common/Button";
import { COLORS } from "@/constants/theme";
import { CategoryIcon } from "@/components/common/CategoryIcon";
import { Image } from "expo-image";


export default function LoginScreen() {
  const { login, register } = useAuth();
  const [modoRegistro, setModoRegistro] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const [acepta, setAcepta] = useState(false);

  const handleSubmit = async () => {
    if (modoRegistro && !acepta) {
  return setError("Debes aceptar los términos y la política de privacidad para crear tu cuenta.");
}
if (enviando) return;
setError("");
setEnviando(true);
try {
  if (modoRegistro) await register(email, password, fullName, acepta);
  else await login(email, password);
      // no hace falta navegar: Stack.Protected lo hace solo
    } catch (e) {
      const message = e instanceof Error ? e.message : "";
      setError(
        /fetch|network|connect/i.test(message)
          ? "No pudimos conectar con el servidor. Verifica que esté iniciado e inténtalo de nuevo."
          : message ||
              "No se pudo iniciar sesión. Verifica tus datos e inténtalo de nuevo.",
      );
    } finally {
      setEnviando(false);
    }
  };

  const handleGoogleLogin = () => {
    // Lógica para autenticación con Google
    router.replace("/(main)");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Cabecera / Logo */}
        <View style={styles.headerContainer}>
          <View style={styles.logoPlaceholder}>
            <Image
              source={require("@/assets/images/icon.png")}
              style={{ width: 48, height:48}}
              contentFit="contain"/>
          </View>
          <Text style={styles.appName}>Mis Finanzas</Text>
          <Text style={styles.tagline}>Seguridad en tu dinero</Text>
        </View>

        {/* Tarjeta del Formulario */}
        <View style={styles.card}>
          {modoRegistro && (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Nombre</Text>
              <TextInput
                style={styles.input}
                placeholder="Tu nombre"
                placeholderTextColor={COLORS.textSecondary}
                value={fullName}
                onChangeText={setFullName}
              />
            </View>
          )}

          {/* Campo Correo */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Correo electrónico</Text>
            <TextInput
              style={styles.input}
              placeholder="tucorreo@ejemplo.com"
              placeholderTextColor={COLORS.textSecondary}
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          {/* Campo Contraseña */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Contraseña</Text>
            <View style={styles.passwordRow}>
              <TextInput
                style={[styles.input, { flex: 1, borderWidth: 0 }]}
                placeholder="••••••••"
                placeholderTextColor={COLORS.textSecondary}
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeButton}
              >
                <Text style={styles.eyeText}>
                  {showPassword ? "Ocultar" : "Ver"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Mensaje de error, justo antes del botón principal */}
          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          {/* ¿Olvidaste tu contraseña? */}
          <TouchableOpacity style={styles.forgotContainer}>
            <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
          </TouchableOpacity>

          {/* Botón Iniciar Sesión */}

          <Button
            title={modoRegistro ? "Crear cuenta" : "Iniciar sesión"}
            onPress={handleSubmit}
            loading={enviando}
          />

          {/* Separador */}
          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>o</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Botón Continuar con Google */}
          <TouchableOpacity
            style={styles.googleButton}
            onPress={handleGoogleLogin}
            activeOpacity={0.8}
          >
            <Text style={styles.googleButtonText}>Continuar con Google</Text>
          </TouchableOpacity>

          {modoRegistro && (
  <View style={styles.termsRow}>
    <TouchableOpacity
      onPress={() => setAcepta(!acepta)}
      hitSlop={8}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: acepta }}
    >
      <CategoryIcon
        name={acepta ? "checkbox-marked" : "checkbox-blank-outline"}
        size={24}
        color="#4EA8DE"
      />
    </TouchableOpacity>
    <Text style={styles.termsText}>
      Acepto los{" "}
      <Text style={styles.termsLink} onPress={() => router.push("/legal")}>
        Términos y la Política de privacidad
      </Text>
    </Text>
  </View>
)}
          <TouchableOpacity
            onPress={() => {
              setModoRegistro(!modoRegistro);
              setError("");
            }}
            style={{ marginTop: 16, alignItems: "center" }}
          >
            <Text style={styles.forgotText}>
              {modoRegistro ? "Ya tengo cuenta" : "Crear cuenta nueva"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  termsRow: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 16 },
termsText: { flex: 1, fontSize: 13, color: COLORS.textSecondary },
termsLink: { color: COLORS.primary, fontWeight: "600" },
  errorText: {
    color: "#D9534F",
    fontSize: 14,
    marginBottom: 12,
    textAlign: "center",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  logoPlaceholder: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: "#CDE8F7",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  logoEmoji: {
    fontSize: 32,
  },
  appName: {
    fontSize: 28,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  tagline: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 24,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 52,
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  passwordRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    height: 52,
    paddingRight: 12,
  },
  eyeButton: {
    paddingHorizontal: 8,
  },
  eyeText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: "600",
  },
  forgotContainer: {
    alignItems: "flex-end",
    marginBottom: 24,
  },
  forgotText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: "600",
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    height: 54,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },
  dividerText: {
    marginHorizontal: 12,
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  googleButton: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: COLORS.border,
    height: 54,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  googleButtonText: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: "600",
  },
});
