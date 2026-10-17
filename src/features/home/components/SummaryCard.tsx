import { StyleSheet, View } from 'react-native';

import { AppCard } from '@/components/common/Card';
import { AppText } from '@/components/common/Screen';
import { palette } from '@/constants/theme';
import { formatCOP } from '@/utils/formatters';

export function SummaryCard({
  label,
  amount,
  tone,
}: {
  label: string;
  amount: number;
  tone: 'income' | 'expense' | 'balance';
}) {
  const amountColor = tone === 'expense' ? palette.expense : palette.income;

  return (
    <AppCard style={styles.card}>
      <View style={styles.text}>
        <AppText color="muted">{label}</AppText>
        <AppText style={[styles.amount, { color: amountColor }]}>{formatCOP(amount)}</AppText>
      </View>
      <View style={[styles.dot, { backgroundColor: amountColor }]} />
    </AppCard>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
  text: { gap: 3, flex: 1 },
  amount: { fontSize: 21, lineHeight: 28, fontWeight: '800' },
  dot: { width: 11, height: 11, borderRadius: 6 },
});
