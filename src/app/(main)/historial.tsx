import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  StatusBar,
} from "react-native";
import { useFinanceStore } from "@/context/useFinanceStore";
import { COLORS } from "@/constants/theme";
import { CategoryIcon } from "@/components/common/CategoryIcon";

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

const etiquetaMes = () => {
  const [y, m] = hoyColombia().split("-").map(Number);
  const nombre = MESES[m - 1];
  return `${nombre.charAt(0).toUpperCase()}${nombre.slice(1)} ${y}`;
};

export default function HistoryScreen() {
  const { transactions, categories, selectedFilter, setFilter } = useFinanceStore();

  // Filtrar según el chip seleccionado
  const filteredTransactions = transactions.filter(
    (t) => selectedFilter === "todos" || t.kind === selectedFilter,
  );

  // Agrupar por fecha ("AAAA-MM-DD")
  const groupedByDate = filteredTransactions.reduce<Record<string, typeof transactions>>(
    (groups, tx) => {
      (groups[tx.date] ??= []).push(tx);
      return groups;
    },
    {},
  );

  // Ordenar de la fecha más reciente a la más antigua y calcular el neto de cada día
  const sortedDateGroups = Object.keys(groupedByDate)
    .sort((a, b) => b.localeCompare(a))
    .map((date) => {
      const movements = groupedByDate[date];
      const dayNet = movements.reduce(
        (acc, t) => (t.kind === "ingreso" ? acc + t.amount : acc - t.amount),
        0,
      );
      return { date, dayNet, movements };
    });

  // Nombre e ícono de la categoría (puede no tener)
  const getCategoryDetails = (categoryId: number | null) => {
    const cat = categoryId == null ? undefined : categories.find((c) => c.id === categoryId);
    return {
      name: cat?.name ?? "General",
      icon: cat?.icon ?? null,
    };
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.screenTitle}>Historial</Text>
          <View style={styles.monthSelector}>
            <Text style={styles.monthText}>{etiquetaMes()}</Text>
          </View>
        </View>

        {/* Filtros: Todos / Ingresos / Gastos */}
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

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {sortedDateGroups.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              No hay movimientos registrados con este filtro.
            </Text>
          </View>
        ) : (
          sortedDateGroups.map((group) => (
            <View key={group.date} style={styles.dayGroup}>
              {/* Cabecera del día */}
              <View style={styles.dayHeader}>
                <Text style={styles.dayTitle}>{etiquetaDia(group.date)}</Text>
                <Text
                  style={[
                    styles.dayNetText,
                    { color: group.dayNet >= 0 ? COLORS.secondary : COLORS.expense },
                  ]}
                >
                  {group.dayNet >= 0
                    ? `+ $${group.dayNet.toLocaleString("es-CO")}`
                    : `- $${Math.abs(group.dayNet).toLocaleString("es-CO")}`}
                </Text>
              </View>

              {/* Movimientos del día */}
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
  safeArea: { flex: 1, backgroundColor: COLORS.background, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
  header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12, backgroundColor: COLORS.background },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  screenTitle: { fontSize: 24, fontWeight: '800', color: COLORS.textPrimary },
  monthSelector: { backgroundColor: COLORS.card, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, borderWidth: 1, borderColor: COLORS.border },
  monthText: { fontSize: 13, fontWeight: '600', color: COLORS.primary },
  filterContainer: { flexDirection: 'row' },
  filterChip: { backgroundColor: COLORS.card, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12, marginRight: 8, borderWidth: 1, borderColor: COLORS.border },
  activeFilterChip: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  filterText: { fontSize: 13, fontWeight: '600', color: COLORS.textSecondary },
  activeFilterText: { color: '#FFFFFF' },
  container: { flex: 1, paddingHorizontal: 20 },
  emptyContainer: { alignItems: 'center', marginTop: 40 },
  emptyText: { color: COLORS.textSecondary, fontSize: 14 },
  dayGroup: { marginBottom: 20 },
  dayHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, paddingHorizontal: 4 },
  dayTitle: { fontSize: 14, fontWeight: '700', color: COLORS.textPrimary },
  dayNetText: { fontSize: 13, fontWeight: '700' },
  movementsCard: { backgroundColor: COLORS.card, borderRadius: 20, paddingHorizontal: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 6, elevation: 2 },
  movementRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  iconCircle: { width: 40, height: 40, borderRadius: 12, backgroundColor: COLORS.background, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  iconText: { fontSize: 18 },
  movementDetails: { flex: 1 },
  categoryName: { fontSize: 15, fontWeight: '600', color: COLORS.textPrimary },
  movementNote: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  amountText: { fontSize: 15, fontWeight: '700' },
});