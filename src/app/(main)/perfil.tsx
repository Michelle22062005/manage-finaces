import { COLORS } from "@/constants/theme";
import { ApplicationSettings } from "@/features/profile/components/ApplicationSettings";
import { DeleteAccountModal } from "@/features/profile/components/DeleteAccountModal";
import { useProfile } from "@/hooks/useProfile";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const {
    user,
    categories,
    handleLogout,
    deleteAccount,
    mostrarEliminar,
    setMostrarEliminar,
    handleDeleteAccount,
  } = useProfile();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header de la pantalla */}
        <Text style={styles.screenTitle}>Perfil</Text>

        {/* 1. Tarjeta de Usuario */}
        <View style={styles.profileCard}>
          <View style={styles.avatarLarge}>
            <Text style={styles.avatarTextLarge}>D</Text>
          </View>
          <Text style={styles.userName}>{user?.fullName || "Usuario"}</Text>
          {/* <Text style={styles.userRole}>Conductora de Taxi 🚕</Text> */}
          <Text style={styles.userEmail}>
            {user?.email || "correo@ejemplo.com"}
          </Text>
        </View>

        {/* 2. Resumen de Estadísticas */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{categories.length}</Text>
            <Text style={styles.statLabel}>Categorías</Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statBox}>
            <Text style={styles.statNumber}>COP ($)</Text>
            <Text style={styles.statLabel}>Moneda</Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statBox}>
            <Text style={styles.statNumber}>Activo</Text>
            <Text style={styles.statLabel}>Estado</Text>
          </View>
        </View>

        {/* 3. Menú de Opciones y Configuración */}
        <Text style={styles.sectionTitle}>Ajustes de la Aplicación</Text>
        <ApplicationSettings />

        {/* 4. Botón de Cerrar Sesión */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteLink}
          onPress={() => setMostrarEliminar(true)}
          accessibilityRole="button"
        >
          <Text style={styles.deleteLinkText}>Eliminar mi cuenta</Text>
        </TouchableOpacity>

        <DeleteAccountModal
          visible={mostrarEliminar}
          onClose={() => setMostrarEliminar(false)}
          onConfirm={handleDeleteAccount}
        />

        {/* Versión de la app */}
        <Text style={styles.versionText}>
          Mi Cuenta v1.0.0 • Calidez en Ruta
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  downloadButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#E6F3FB",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: COLORS.textPrimary,
    marginTop: 16,
    marginBottom: 16,
  },
  profileCard: {
    backgroundColor: COLORS.card,
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  avatarLarge: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  avatarTextLarge: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "800",
  },
  userName: {
    fontSize: 20,
    fontWeight: "800",
    color: COLORS.textPrimary,
  },
  userRole: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.primary,
    marginTop: 2,
  },
  userEmail: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  statsRow: {
    flexDirection: "row",
    backgroundColor: COLORS.card,
    borderRadius: 20,
    paddingVertical: 16,
    marginBottom: 24,
    justifyContent: "space-around",
    alignItems: "center",
  },
  statBox: {
    alignItems: "center",
    flex: 1,
  },
  statNumber: {
    fontSize: 15,
    fontWeight: "800",
    color: COLORS.textPrimary,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: COLORS.border,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 12,
  },

  logoutButton: {
    backgroundColor: "#9acffa",
    height: 52,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  logoutButtonText: {
    color: COLORS.expense,
    fontSize: 15,
    fontWeight: "700",
  },
  deleteLink: { alignItems: "center", paddingVertical: 12, marginBottom: 8 },
  deleteLinkText: { color: COLORS.expense, fontSize: 14, fontWeight: "600" },
  versionText: {
    textAlign: "center",
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 30,
  },
});
