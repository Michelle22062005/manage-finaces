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
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useFinanceStore } from '@/context/useFinanceStore';
import { COLORS } from '@/constants/theme';

export default function CategoryDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const categoryId = Number(id);

  // Obtener estado y selectores desde Zustand
  const { categories, transactions, getTotalExpenses, getCategorySpent } = useFinanceStore();

  // Buscar la categoría seleccionada
  const category = categories.find((c) => c.id === categoryId);

  // Filtrar las transacciones de esta categoría
  const categoryMovements = transactions
    .filter((t) => t.categoryId === categoryId && t.kind === 'gasto')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Cálculos dinámicos
  const totalSpentInCategory = getCategorySpent(categoryId);
  const totalExpensesMonth = getTotalExpenses();

  // % que representa respecto al gasto total del mes
  const percentageOfTotal = totalExpensesMonth > 0
    ? ((totalSpentInCategory / totalExpensesMonth) * 100).toFixed(1)
    : '0';

  // % de presupuesto consumido (si tiene presupuesto asignado)
  const monthlyBudget = category?.monthlyBudget || 0;
  const budgetProgress = monthlyBudget > 0
    ? Math.min((totalSpentInCategory / monthlyBudget) * 100, 100)
    : 0;

  // Manejo de caso cuando no existe la categoría
  if (!category) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.notFoundContainer}>
          <Text style={styles.notFoundText}>Categoría no encontrada.</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backText}>← Volver</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* 1. Header con botón Atrás */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backText}>← Volver</Text>
        </TouchableOpacity>
        <View style={styles.titleRow}>
          <Text style={styles.categoryIcon}>{category.icon || '📁'}</Text>
          <Text style={styles.categoryTitle}>{category.name}</Text>
          <View style={styles.scopeBadge}>
            <Text style={styles.scopeText}>{category.scope.toUpperCase()}</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        
        {/* 2. Tarjeta Resumen del Presupuesto Dinámica */}
        <View style={styles.summaryCard}>
          <Text style={styles.cardLabel}>Gastado este mes</Text>
          <Text style={styles.totalSpentText}>
            ${totalSpentInCategory.toLocaleString('es-CO')}
          </Text>
          <Text style={styles.percentageSubtext}>
            Representa el <Text style={styles.boldText}>{percentageOfTotal}%</Text> de tus gastos totales.
          </Text>

          {/* Barra de Progreso vs Presupuesto */}
          <View style={styles.budgetSection}>
            <View style={styles.budgetLabelRow}>
              <Text style={styles.budgetLabel}>Presupuesto mensual</Text>
              <Text style={styles.budgetAmount}>
                ${totalSpentInCategory.toLocaleString('es-CO')} /${monthlyBudget.toLocaleString('es-CO')}
              </Text>
            </View>

            <View style={styles.progressBarBackground}>
              <View
                style={[
                  styles.progressBarFill,
                  { 
                    width: `${budgetProgress}%`,
                    backgroundColor: budgetProgress >= 100 ? COLORS.expense : COLORS.primary
                  }
                ]}
              />
            </View>
          </View>
        </View>

        {/* 3. Gráfico de Consumo Visual */}
        <View style={styles.chartCard}>
          <Text style={styles.cardTitle}>Gasto por Semana</Text>
          <View style={styles.chartBarsContainer}>
            <View style={styles.barColumn}>
              <View style={[styles.bar, { height: 30 }]} />
              <Text style={styles.barLabel}>Sem 1</Text>
            </View>
            <View style={styles.barColumn}>
              <View style={[styles.bar, { height: 65, backgroundColor: COLORS.expense }]} />
              <Text style={styles.barLabel}>Sem 2</Text>
            </View>
            <View style={styles.barColumn}>
              <View style={[styles.bar, { height: 20 }]} />
              <Text style={styles.barLabel}>Sem 3</Text>
            </View>
            <View style={styles.barColumn}>
              <View style={[styles.bar, { height: 10 }]} />
              <Text style={styles.barLabel}>Sem 4</Text>
            </View>
          </View>
        </View>

        {/* 4. Lista de Movimientos Reales en esta Categoría */}
        <Text style={styles.sectionTitle}>Historial en {category.name}</Text>

        {categoryMovements.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>Aún no hay gastos registrados en esta categoría.</Text>
          </View>
        ) : (
          <View style={styles.movementsList}>
            {categoryMovements.map((item, index) => (
              <View
                key={item.id}
                style={[
                  styles.movementItem,
                  index === categoryMovements.length - 1 && { borderBottomWidth: 0 }
                ]}
              >
                <View style={styles.movementInfo}>
                  <Text style={styles.movementNote}>{item.note || category.name}</Text>
                  <Text style={styles.movementDate}>{item.date}</Text>
                </View>
                <Text style={styles.movementAmount}>
                  -${item.amount.toLocaleString('es-CO')}
                </Text>
              </View>
            ))}
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notFoundText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: 12,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  backButton: {
    marginBottom: 8,
  },
  backText: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.primary,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryIcon: {
    fontSize: 28,
    marginRight: 10,
  },
  categoryTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginRight: 10,
  },
  scopeBadge: {
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  scopeText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  summaryCard: {
    backgroundColor: COLORS.card,
    borderRadius: 24,
    padding: 20,
    marginVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  cardLabel: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  totalSpentText: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.expense,
  },
  percentageSubtext: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 4,
    marginBottom: 16,
  },
  boldText: {
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  budgetSection: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 14,
  },
  budgetLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  budgetLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  budgetAmount: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  progressBarBackground: {
    height: 10,
    backgroundColor: COLORS.background,
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 5,
  },
  chartCard: {
    backgroundColor: COLORS.card,
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 16,
  },
  chartBarsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 100,
  },
  barColumn: {
    alignItems: 'center',
    width: 40,
  },
  bar: {
    width: 18,
    backgroundColor: COLORS.primary,
    borderRadius: 9,
    marginBottom: 8,
  },
  barLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  emptyCard: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    marginBottom: 30,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  movementsList: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    paddingHorizontal: 16,
    marginBottom: 30,
  },
  movementItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  movementInfo: {
    flex: 1,
  },
  movementNote: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  movementDate: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  movementAmount: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.expense,
  },
});