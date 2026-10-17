import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { AppText, Screen } from '@/components/common/Screen';
import { FilterChips, MovementFilter } from '@/features/history/components/FilterChips';
import { MovementGroupList } from '@/features/history/components/MovementGroupList';
import { useMovementsStore } from '@/context/useMovementsStore';

export default function HistoryScreen() {
  const movements = useMovementsStore((state) => state.movements);
  const [filter, setFilter] = useState<MovementFilter>('all');
  const filteredMovements = useMemo(
    () => movements.filter((movement) => filter === 'all' || movement.type === filter),
    [filter, movements],
  );

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.heading}>
          <AppText variant="eyebrow">MOVIMIENTOS</AppText>
          <AppText variant="title">Historial</AppText>
          <AppText color="muted">Consulta tus ingresos y gastos.</AppText>
        </View>
        <FilterChips value={filter} onChange={setFilter} />
        <MovementGroupList movements={filteredMovements} />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { gap: 20, paddingBottom: 32 },
  heading: { gap: 8 },
});
