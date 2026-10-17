import { ScrollView, StyleSheet, View } from 'react-native';

import { BarChart } from '@/components/charts/BarChart';
import { ProgressRing } from '@/components/charts/ProgressRing';
import { AppCard } from '@/components/common/Card';
import { AppText, Screen } from '@/components/common/Screen';
import { CategoryChips } from '@/features/home/components/CategoryChips';
import { QuickEntryForm } from '@/features/home/components/QuickEntryForm';
import { SummaryCard } from '@/features/home/components/SummaryCard';
import { useMovementsStore } from '@/context/useMovementsStore';
import { categories } from '@/constants/categories';
import { formatCOP } from '@/utils/formatters';

export default function HomeScreen() {
  const movements = useMovementsStore((state) => state.movements);
  const income = movements
    .filter((movement) => movement.type === 'income')
    .reduce((total, movement) => total + movement.amount, 0);
  const expenses = movements
    .filter((movement) => movement.type === 'expense')
    .reduce((total, movement) => total + movement.amount, 0);
  const categoryExpenses = categories.map((category) => ({
    label: category.name.slice(0, 3),
    value: movements
      .filter((movement) => movement.type === 'expense' && movement.categoryId === category.id)
      .reduce((total, movement) => total + movement.amount, 0),
  }));
  const spentPercentage = income > 0 ? Math.min(100, (expenses / income) * 100) : 0;

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.heading}>
          <AppText variant="eyebrow">MISCUENTAS</AppText>
          <AppText variant="title">Tu resumen</AppText>
          <AppText color="muted">Ten una mirada clara de tu dinero.</AppText>
        </View>
        <View style={styles.summary}>
          <SummaryCard label="Ingresos" amount={income} tone="income" />
          <SummaryCard label="Gastos" amount={expenses} tone="expense" />
          <SummaryCard label="Disponible" amount={income - expenses} tone="balance" />
        </View>
        <AppCard style={styles.chartCard}>
          <View style={styles.chartHeading}>
            <View style={styles.chartCopy}>
              <AppText variant="section">Gastos por categoría</AppText>
              <AppText color="muted">Distribución de tus gastos</AppText>
            </View>
            <ProgressRing percentage={spentPercentage} label="del ingreso" />
          </View>
          <BarChart data={categoryExpenses} />
          <AppText color="muted">Total gastado: {formatCOP(expenses)}</AppText>
        </AppCard>
        <View style={styles.section}>
          <AppText variant="section">Categorías</AppText>
          <CategoryChips />
        </View>
        <View style={styles.section}>
          <AppText variant="section">Agregar movimiento</AppText>
          <QuickEntryForm />
        </View>
        <AppText color="muted" style={styles.count}>
          {movements.length} movimientos · Saldo {formatCOP(income - expenses)}
        </AppText>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { gap: 24, paddingBottom: 32 },
  heading: { gap: 8 },
  summary: { gap: 12 },
  chartCard: { gap: 18 },
  chartHeading: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 12 },
  chartCopy: { flex: 1, gap: 4 },
  section: { gap: 12 },
  count: { textAlign: 'center', fontSize: 12 },
});
