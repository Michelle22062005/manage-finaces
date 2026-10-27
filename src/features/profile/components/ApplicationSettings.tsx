import { CategoryIcon } from "@/components/common/CategoryIcon";
import { COLORS } from "@/constants/theme";
import { useProfile } from "@/hooks/useProfile";
import {
  Text,
  View,
  TouchableOpacity,
  Platform,
  StyleSheet,
} from "react-native";
import { moveMonth, nameMonth } from "@/lib/exportMonth";
import { useRouter } from "expo-router";

export function ApplicationSettings() {
  const { month, setMonth, exportando, esMesActual, ofTheMonth, exportar } =
    useProfile();
  const router = useRouter();

  return (
    <View style={styles.optionsCard}>
      {/* Mes a descargar */}
      <View style={styles.optionRow}>
        <View style={styles.optionIconContainer}>
          <CategoryIcon name="calendar-month" size={20} color="#4EA8DE" />
        </View>
        <View style={styles.optionTextContainer}>
          <Text style={styles.optionTitle}>Descargar registro</Text>
          <Text style={styles.optionSubtitle}>
            {ofTheMonth.length}{" "}
            {ofTheMonth.length === 1 ? "movimiento" : "movimientos"}
          </Text>
        </View>
        <View style={styles.monthPicker}>
          <TouchableOpacity
            onPress={() => setMonth(moveMonth(month, -1))}
            hitSlop={12}
            accessibilityLabel="Mes anterior"
          >
            <Text style={styles.monthArrow}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.monthLabel}>{nameMonth(month)}</Text>
          <TouchableOpacity
            onPress={() => setMonth(moveMonth(month, 1))}
            disabled={esMesActual}
            hitSlop={12}
            accessibilityLabel="Mes siguiente"
          >
            <Text style={[styles.monthArrow, esMesActual && { opacity: 0.3 }]}>
              ›
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Guardar en el celular (solo Android) */}
      {Platform.OS === "android" && (
        <TouchableOpacity
          style={[styles.optionRow, exportando && { opacity: 0.5 }]}
          onPress={() => exportar("guardar")}
          disabled={exportando}
          activeOpacity={0.7}
          accessibilityLabel={`Guardar en el celular los movimientos de ${nameMonth(month)}`}
        >
          <View style={styles.optionIconContainer}>
            <CategoryIcon
              name={exportando ? "timer-sand" : "content-save"}
              size={20}
              color="#4EA8DE"
            />
          </View>
          <View style={styles.optionTextContainer}>
            <Text style={styles.optionTitle}>Guardar</Text>
            <Text style={styles.optionSubtitle}>
              Elige la carpeta donde quedará el archivo
            </Text>
          </View>
          <Text style={styles.arrowIcon}>›</Text>
        </TouchableOpacity>
      )}

      {/* Compartir */}
      <TouchableOpacity
        style={[styles.optionRow, exportando && { opacity: 0.5 }]}
        onPress={() => exportar("compartir")}
        disabled={exportando}
        activeOpacity={0.7}
        accessibilityLabel={`Compartir los movimientos de ${nameMonth(month)}`}
      >
        <View style={styles.optionIconContainer}>
          <CategoryIcon name="share-variant" size={20} color="#4EA8DE" />
        </View>
        <View style={styles.optionTextContainer}>
          <Text style={styles.optionTitle}>Compartir archivo</Text>
          <Text style={styles.optionSubtitle}>
            Enviar por WhatsApp, correo o Drive
          </Text>
        </View>
        <Text style={styles.arrowIcon}>›</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.optionRow}
        activeOpacity={0.7}
        onPress={() => router.push("/how-function")}
      >
        <View style={styles.optionIconContainer}>
          <CategoryIcon name="help-circle-outline" size={20} color="#4EA8DE" />
        </View>
        <View style={styles.optionTextContainer}>
          <Text style={styles.optionTitle}>Cómo funciona la app</Text>
          <Text style={styles.optionSubtitle}>Qué hace y cómo usarla</Text>
        </View>
        <Text style={styles.arrowIcon}>›</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.optionRow, { borderBottomWidth: 0 }]}
        activeOpacity={0.7}
        onPress={() => router.push("/legal")}
      >
        <View style={styles.optionIconContainer}>
          <CategoryIcon
            name="file-document-outline"
            size={20}
            color="#4EA8DE"
          />
        </View>
        <View style={styles.optionTextContainer}>
          <Text style={styles.optionTitle}>Términos y privacidad</Text>
          <Text style={styles.optionSubtitle}>Cómo cuidamos tus datos</Text>
        </View>
        <Text style={styles.arrowIcon}>›</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.optionRow}
        activeOpacity={0.7}
        onPress={() => router.push("/how-function")}
      >
        <View style={styles.optionIconContainer}>
          <CategoryIcon name="help-circle-outline" size={20} color="#4EA8DE" />
        </View>
        <View style={styles.optionTextContainer}>
          <Text style={styles.optionTitle}>Cómo funciona la app</Text>
          <Text style={styles.optionSubtitle}>Qué hace y cómo usarla</Text>
        </View>
        <Text style={styles.arrowIcon}>›</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  optionsCard: {
    backgroundColor: COLORS.card,
    borderRadius: 24,
    paddingHorizontal: 16,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  optionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: COLORS.background,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  optionSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  arrowIcon: {
    fontSize: 20,
    color: COLORS.textSecondary,
    fontWeight: "300",
  },
  monthPicker: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  monthArrow: {
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.primary,
    lineHeight: 24,
  },
  monthLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.primary,
  },
  optionIcon: {
    fontSize: 18,
  },
});
