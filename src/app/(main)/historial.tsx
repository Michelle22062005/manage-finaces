import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  StatusBar,
} from 'react-native';
import { useFinanceStore } from '@/context/useFinanceStore';
import { COLORS } from '@/constants/theme';

export default function HistoryScreen() {
  const { transactions, categories, selectedFilter, setFilter } = useFinanceStore();

  // Filtrar transacciones según el chip seleccionado
  const filteredTransactions = transactions.filter((t) => {
    if (selectedFilter === 'todos') return true;
    return t.kind === selectedFilter;
  });

  // Agrupar transacciones por fecha
  const groupedByDate = filteredTransactions.reduce((groups: Record<string, typeof transactions>, tx) => {
    const dateKey = tx.date; // "YYYY-MM-DD"
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(tx);
    return groups;
  }, {});

  // Convertir el objeto agrupado en un array ordenado por fecha descendente
  const sortedDateGroups = Object.keys(groupedByDate)
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
    .map((date) => {
      const dayTxs = groupedByDate[date];
      // Calcular el neto del día (Ingresos - Gastos de ese día)
      const dayNet = dayTxs.reduce((acc, t) => {
        return t.kind === 'ingreso' ? acc + t.amount : acc - t.amount;
      }, 0);

      return {
        date,
        dayNet,
        movements: dayTxs,
      };
    });

  // Helper para buscar los datos de la categoría (nombre e ícono)
  const getCategoryDetails = (categoryId: number) => {
    const cat = categories.find((c) => c.id === categoryId);
    return {
      name: cat ? cat.name : 'General',
      icon: cat ? cat.icon || '📁' : '📁',
    };
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.screenTitle}>Historial</Text>
          <View style={styles.monthSelector}>
            <Text style={styles.monthText}>Octubre 2026 ▾</Text>
          </View>
        </View>

        {/* Filtros Chips: Todos / Ingresos / Gastos */}
        <View style={styles.filterContainer}>
          <TouchableOpacity
            style={[styles.filterChip, selectedFilter === 'todos' && styles.activeFilterChip]}
            onPress={() => setFilter('todos')}
          >
            <Text style={[styles.filterText, selectedFilter === 'todos' && styles.activeFilterText]}>
              Todos
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterChip, selectedFilter === 'ingreso' && { backgroundColor: COLORS.secondary, borderColor: COLORS.secondary }]}
            onPress={() => setFilter('ingreso')}
          >
            <Text style={[styles.filterText, selectedFilter === 'ingreso' && styles.activeFilterText]}>
              Ingresos
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterChip, selectedFilter === 'gasto' && { backgroundColor: COLORS.expense, borderColor: COLORS.expense }]}
            onPress={() => setFilter('gasto')}
          >
            <Text style={[styles.filterText, selectedFilter === 'gasto' && styles.activeFilterText]}>
              Gastos
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {sortedDateGroups.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No hay movimientos registrados con este filtro.</Text>
          </View>
        ) : (
          sortedDateGroups.map((group) => (
            <View key={group.date} style={styles.dayGroup}>
              {/* Cabecera del día */}
              <View style={styles.dayHeader}>
                <Text style={styles.dayTitle}>{group.date}</Text>
                <Text
                  style={[
                    styles.dayNetText,
                    { color: group.dayNet >= 0 ? COLORS.secondary : COLORS.expense },
                  ]}
                >
                  {group.dayNet >= 0
                    ? `+ $${group.dayNet.toLocaleString('es-CO')}`
                    : `- $${Math.abs(group.dayNet).toLocaleString('es-CO')}`}
                </Text>
              </View>

              {/* Lista de movimientos */}
              <View style={styles.movementsCard}>
                {group.movements.map((mov, movIndex) => {
                  const cat = getCategoryDetails(mov.categoryId);
                  return (
                    <View
                      key={mov.id}
                      style={[
                        styles.movementRow,
                        movIndex === group.movements.length - 1 && { borderBottomWidth: 0 },
                      ]}
                    >
                      <View style={styles.iconCircle}>
                        <Text style={styles.iconText}>{cat.icon}</Text>
                      </View>

                      <View style={styles.movementDetails}>
                        <Text style={styles.categoryName}>{cat.name}</Text>
                        {mov.note ? <Text style={styles.movementNote}>{mov.note}</Text> : null}
                      </View>

                      <Text
                        style={[
                          styles.amountText,
                          { color: mov.kind === 'ingreso' ? COLORS.secondary : COLORS.expense },
                        ]}
                      >
                        {mov.kind === 'ingreso' ? '+' : '-'}${mov.amount.toLocaleString('es-CO')}
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