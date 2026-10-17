import { StyleSheet, View } from 'react-native';

import { ProgressRing } from '@/components/charts/ProgressRing';
import { AppCard } from '@/components/common/Card';
import { AppText } from '@/components/common/Screen';
import type { Category } from '@/types/category';
import { formatCOP } from '@/utils/formatters';

export function CategoryHeaderCard({
  category,
  total,
}: {
  category: Category;
  total: number;
}) {
  return (
    <AppCard style={styles.card}>
      <View style={[styles.icon, { backgroundColor: category.color }]}>
        <AppText variant="section">{category.icon}</AppText>
      </View>
      <View style={styles.summary}>
        <AppText variant="section">{category.name}</AppText>
        <AppText color="muted">Total registrado</AppText>
        <AppText style={styles.amount}>{formatCOP(total)}</AppText>
      </View>
      <ProgressRing percentage={total > 0 ? 100 : 0} label="registrado" />
    </AppCard>
  );
}

const styles = StyleSheet.create({
  card: { alignItems: 'center' },
  icon: { width: 52, height: 52, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  summary: { alignItems: 'center', gap: 3 },
  amount: { fontSize: 22, lineHeight: 28, fontWeight: '800' },
});
