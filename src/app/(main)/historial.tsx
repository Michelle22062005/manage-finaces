
import {
  Alert,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "@/constants/theme";
import { CategoryIcon } from "@/components/common/CategoryIcon";
import {
  moveMonth,
  nameMonth,
} from "@/lib/exportMonth";
import { useRecord } from "@/hooks/useRecord";

const MESES = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

// Hoy en Colombia, formato AAAA-MM-DD
const hoyColombia = () =>
  new Date().toLocaleDateString("en-CA", { timeZone: "America/Bogota" });

// Resta días a una fecha AAAA-MM-DD sin problemas de zona horaria
const restarDias = (fecha: string, dias: number) => {
  const [y, m, d] = fecha.split("-").map(Number);
  const f = new Date(Date.UTC(y, m - 1, d - dias));
  return f.toISOString().slice(0, 10);
};

const etiquetaDia = (fecha: string) => {
  const hoy = hoyColombia();
  if (fecha === hoy) return "Hoy";
  if (fecha === restarDias(hoy, 1)) return "Ayer";
  const [, m, d] = fecha.split("-").map(Number);
  return `${d} de ${MESES[m - 1]}`;
};

// Pesos con signo adelante: -$5.000 (no $-5.000)
const cop = (n: number) =>
  `${n < 0 ? "-" : ""}$${Math.abs(n).toLocaleString("es-CO")}`;

export default function HistoryScreen() {
   const { selectedFilter, setFilter, month, setMonth,  totales, sortedDateGroups, getCategoryDetails, esMesActual}= useRecord()
  
  
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

        {/* Fila 2: filtros + botón de descarga */}
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
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Resumen del mes */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryBox}>
            <Text style={styles.summaryLabel}>Ganado</Text>
            <Text style={[styles.summaryValue, { color: COLORS.secondary }]}>
              {cop(totales.income)}
            </Text>
          </View>

          <View style={styles.summaryDivider} />

          <View style={styles.summaryBox}>
            <Text style={styles.summaryLabel}>Gastado</Text>
            <Text style={[styles.summaryValue, { color: COLORS.expense }]}>
              {cop(totales.expenses)}
            </Text>
          </View>

          <View style={styles.summaryDivider} />

          <View style={styles.summaryBox}>
            <Text style={styles.summaryLabel}>Te quedó</Text>
            <Text
              style={[
                styles.summaryValue,
                { color: totales.neto < 0 ? COLORS.expense : COLORS.primary },
              ]}
            >
              {cop(totales.neto)}
            </Text>
          </View>
        </View>

        {/* Lista por día */}
        {sortedDateGroups.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {selectedFilter === "todos"
                ? `No hay movimientos en ${nameMonth(month)}.`
                : "No hay movimientos con este filtro en este mes."}
            </Text>
          </View>
        ) : (
          sortedDateGroups.map((group) => (
            <View key={group.date} style={styles.dayGroup}>
              <View style={styles.dayHeader}>
                <Text style={styles.dayTitle}>{etiquetaDia(group.date)}</Text>
                <Text
                  style={[
                    styles.dayNetText,
                    { color: group.dayNet >= 0 ? COLORS.secondary : COLORS.expense },
                  ]}
                >
                  {group.dayNet >= 0 ? "+ " : "- "}${Math.abs(group.dayNet).toLocaleString("es-CO")}
                </Text>
              </View>

              <View style={styles.movementsCard}>
                {group.movements.map((mov, movIndex) => {
                  const cat = getCategoryDetails(mov.categoryId);
                  const esIngreso = mov.kind === "ingreso";
                  return (
                    <View
                      key={mov.id}
                      style={[
                        styles.movementRow,
                        movIndex === group.movements.length - 1 && { borderBottomWidth: 0 },
                      ]}
                    >
                      <View style={styles.iconCircle}>
                        <CategoryIcon name={cat.icon} size={20} color="#4EA8DE" />
                      </View>

                      <View style={styles.movementDetails}>
                        <Text style={styles.categoryName}>{cat.name}</Text>
                        {mov.note ? <Text style={styles.movementNote}>{mov.note}</Text> : null}
                      </View>

                      <Text
                        style={[
                          styles.amountText,
                          { color: esIngreso ? COLORS.secondary : COLORS.expense },
                        ]}
                      >
                        {esIngreso ? "+" : "-"}${mov.amount.toLocaleString("es-CO")}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </View>
          ))
        )}
      </ScrollView>
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

  // Resumen del mes
  summaryCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.card,
    borderRadius: 20,
    paddingVertical: 16,
    marginTop: 4,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  summaryBox: { flex: 1, alignItems: "center" },
  summaryLabel: { fontSize: 12, color: COLORS.textSecondary, marginBottom: 4 },
  summaryValue: { fontSize: 14, fontWeight: "700" },
  summaryDivider: { width: 1, height: 28, backgroundColor: COLORS.border },

  // Lista
  emptyContainer: { alignItems: "center", marginTop: 40 },
  emptyText: { color: COLORS.textSecondary, fontSize: 14, textAlign: "center" },
  dayGroup: { marginBottom: 20 },
  dayHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  dayTitle: { fontSize: 14, fontWeight: "700", color: COLORS.textPrimary },
  dayNetText: { fontSize: 13, fontWeight: "700" },
  movementsCard: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  movementRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#E6F3FB",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  movementDetails: { flex: 1 },
  categoryName: { fontSize: 15, fontWeight: "600", color: COLORS.textPrimary },
  movementNote: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  amountText: { fontSize: 15, fontWeight: "700" },
});