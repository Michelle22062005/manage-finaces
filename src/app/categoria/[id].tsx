import { Stack, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';

import { AppCard } from '@/components/common/Card';
import { AppText, Screen } from '@/components/common/Screen';
import { CategoryHeaderCard } from '@/features/categories/components/CategoryHeaderCard';
import { categories } from '@/constants/categories';
import { useMovementsStore } from '@/context/useMovementsStore';
import { formatCOP } from '@/utils/formatters';

export default function CategoryDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const category = categories.find((item) => item.id === id);
  const movements = useMovementsStore((state) =>
    state.movements.filter((movement) => movement.categoryId === id),
  );
  const total = movements.reduce((sum, movement) => sum + movement.amount, 0);

  return (
    <Screen>
      <Stack.Screen options={{ title: category?.name ?? 'Categoría' }} />
      <ScrollView contentContainerStyle={styles.content}>
        {category ? (
          <>
            <CategoryHeaderCard category={category} total={total} />
            <AppText variant="section">Movimientos</AppText>
            {movements.length ? (
              movements.map((movement) => (
                <AppCard key={movement.id} style={styles.row}>
                  <View style={styles.movementInfo}>
                    <AppText>{movement.note || category.name}</AppText>
                    <AppText color="muted">{new Date(movement.date).toLocaleDateString('es-CO')}</AppText>
                  </View>
                  <AppText color={movement.type === 'income' ? 'income' : 'danger'}>
                    {formatCOP(movement.amount)}
                  </AppText>
                </AppCard>
              ))
            ) : (
              <AppText color="muted">Aún no hay movimientos en esta categoría.</AppText>
            )}
          </>
        ) : (
          <AppText variant="title">No encontramos esta categoría.</AppText>
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { gap: 16, paddingBottom: 32 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  movementInfo: { gap: 4, flexShrink: 1 },
});
