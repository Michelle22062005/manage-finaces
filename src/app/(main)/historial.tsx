
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "@/constants/theme";
import {
  moveMonth,
  nameMonth,
} from "@/lib/exportMonth";
import { useRecord } from "@/hooks/useRecord";
import { HistoryContent } from "@/features/history/components/HistoryContent";





export default function HistoryScreen() {
   const record = useRecord();
  const { selectedFilter, setFilter, month, setMonth, esMesActual } = record;
  
  
  return (
    <SafeAreaView style={styles.safeArea}>
      {/* ENCABEZADO */}
      <View style={styles.header}>
        {/* Fila 1: título + selector de mes */}
        <View style={styles.titleRow}>
          <Text style={styles.screenTitle}>Historial</Text>

          <View style={styles.monthSelector}>
            <TouchableOpacity
              onPress={() => setMonth(moveMonth(month, -1))}
              hitSlop={12}
              accessibilityLabel="Mes anterior"
            >
              <Text style={styles.monthArrow}>‹</Text>
            </TouchableOpacity>

            <Text style={styles.monthText}>{nameMonth(month)}</Text>

            <TouchableOpacity
              onPress={() => setMonth(moveMonth(month, 1))}
              disabled={esMesActual}
              hitSlop={12}
              accessibilityLabel="Mes siguiente"
            >
              <Text style={[styles.monthArrow, esMesActual && { opacity: 0.3 }]}>›</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Fila 2: filtros */}
        <View style={styles.filterRow}>
          <View style={styles.filterContainer}>
            <TouchableOpacity
              style={[styles.filterChip, selectedFilter === "todos" && styles.activeFilterChip]}
              onPress={() => setFilter("todos")}
            >
              <Text style={[styles.filterText, selectedFilter === "todos" && styles.activeFilterText]}>
                Todos
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.filterChip,
                selectedFilter === "ingreso" && {
                  backgroundColor: COLORS.secondary,
                  borderColor: COLORS.secondary,
                },
              ]}
              onPress={() => setFilter("ingreso")}
            >
              <Text style={[styles.filterText, selectedFilter === "ingreso" && styles.activeFilterText]}>
                Ingresos
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.filterChip,
                selectedFilter === "gasto" && {
                  backgroundColor: COLORS.expense,
                  borderColor: COLORS.expense,
                },
              ]}
              onPress={() => setFilter("gasto")}
            >
              <Text style={[styles.filterText, selectedFilter === "gasto" && styles.activeFilterText]}>
                Gastos
              </Text>
            </TouchableOpacity>
          </View>

        </View>
      </View>

      {/* CONTENIDO */}
      <HistoryContent {...record}/>
      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  // Encabezado
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: COLORS.background,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  screenTitle: { fontSize: 24, fontWeight: "800", color: COLORS.textPrimary },
  monthSelector: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: COLORS.card,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  monthArrow: { fontSize: 22, fontWeight: "700", color: COLORS.primary, lineHeight: 24 },
  monthText: { fontSize: 13, fontWeight: "600", color: COLORS.primary },

  // Filtros + descarga
  filterRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  filterContainer: { flexDirection: "row" },
  filterChip: {
    backgroundColor: COLORS.card,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    marginRight: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  activeFilterChip: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  filterText: { fontSize: 13, fontWeight: "600", color: COLORS.textSecondary },
  activeFilterText: { color: "#FFFFFF" },

  // Contenido
  container: { flex: 1, paddingHorizontal: 20 },
 
});