import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/common/Screen';
import { palette } from '@/constants/theme';
import type { MovementType } from '@/types/movement';

export type MovementFilter = 'all' | MovementType;

const options: { value: MovementFilter; label: string }[] = [
  { value: 'all', label: 'Todos' },
  { value: 'income', label: 'Ingresos' },
  { value: 'expense', label: 'Gastos' },
];

export function FilterChips({
  value,
  onChange,
}: {
  value: MovementFilter;
  onChange: (filter: MovementFilter) => void;
}) {
  return (
    <View style={styles.row}>
      {options.map((option) => {
        const selected = value === option.value;
        return (
          <Pressable
            key={option.value}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            onPress={() => onChange(option.value)}
            style={[styles.chip, selected && styles.selected]}>
            <AppText color={selected ? 'income' : 'muted'}>{option.label}</AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 8 },
  chip: { borderRadius: 16, backgroundColor: '#EFEFEA', paddingHorizontal: 15, paddingVertical: 9 },
  selected: { backgroundColor: palette.primary },
});
