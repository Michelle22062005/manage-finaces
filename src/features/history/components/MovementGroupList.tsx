import { StyleSheet, View } from 'react-native';

import { AppCard } from '@/components/common/Card';
import { AppText } from '@/components/common/Screen';
import { categories } from '@/constants/categories';
import type { Movement } from '@/types/movement';
import { formatCOP } from '@/utils/formatters';
import { formatDayLabel, getLocalDateKey } from '@/utils/dates';

export function MovementGroupList({ movements }: { movements: Movement[] }) {
  const sortedMovements = [...movements].sort(
    (first, second) => new Date(second.date).getTime() - new Date(first.date).getTime(),
  );
  const groups = sortedMovements.reduce<Map<string, Movement[]>>((result, movement) => {
    const key = getLocalDateKey(new Date(movement.date));
    const group = result.get(key) ?? [];
    group.push(movement);
    result.set(key, group);
    return result;
  }, new Map());

  if (!groups.size) {
    return <AppText color="muted">No hay movimientos para este filtro.</AppText>;
  }

  return (
    <View style={styles.groups}>
      {[...groups.entries()].map(([date, dayMovements]) => (
        <View key={date} style={styles.group}>
          <AppText variant="section">{formatDayLabel(dayMovements[0].date)}</AppText>
          {dayMovements.map((movement) => {
            const category = categories.find((item) => item.id === movement.categoryId);
            return (
              <AppCard key={movement.id} style={styles.row}>
                <View style={styles.info}>
                  <AppText>{movement.note || category?.name || 'Movimiento'}</AppText>
                  <AppText color="muted">{category?.name ?? 'Sin categoría'}</AppText>
                </View>
                <AppText color={movement.type === 'income' ? 'income' : 'danger'} style={styles.amount}>
                  {movement.type === 'income' ? '+' : '-'}
                  {formatCOP(movement.amount)}
                </AppText>
              </AppCard>
            );
          })}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  groups: { gap: 20 },
  group: { gap: 10 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 14 },
  info: { flex: 1, gap: 3 },
  amount: { fontWeight: '700' },
});
