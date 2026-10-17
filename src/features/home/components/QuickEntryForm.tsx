import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppButton } from '@/components/common/Button';
import { AppCard } from '@/components/common/Card';
import { AppInput } from '@/components/common/Input';
import { AppText } from '@/components/common/Screen';
import { categories } from '@/constants/categories';
import { palette } from '@/constants/theme';
import { useMovementsStore } from '@/context/useMovementsStore';
import type { MovementType } from '@/types/movement';

export function QuickEntryForm() {
  const addMovement = useMovementsStore((state) => state.addMovement);
  const [type, setType] = useState<MovementType>('expense');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [categoryId, setCategoryId] = useState(categories[0].id);
  const [message, setMessage] = useState('');

  function handleSubmit() {
    const normalizedAmount = Number(amount.replace(',', '.'));
    if (!Number.isFinite(normalizedAmount) || normalizedAmount <= 0) {
      setMessage('Ingresa un monto mayor que cero.');
      return;
    }

    addMovement({
      type,
      amount: normalizedAmount,
      categoryId,
      note: note.trim(),
    });
    setAmount('');
    setNote('');
    setMessage('Movimiento agregado.');
  }

  return (
    <AppCard>
      <View style={styles.typeRow}>
        {(['expense', 'income'] as const).map((option) => {
          const selected = type === option;
          return (
            <Pressable
              key={option}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              onPress={() => setType(option)}
              style={[styles.typeButton, selected && styles.typeSelected]}>
              <AppText color={selected ? 'income' : 'muted'}>
                {option === 'expense' ? 'Gasto' : 'Ingreso'}
              </AppText>
            </Pressable>
          );
        })}
      </View>
      <AppInput
        label="Monto (COP)"
        value={amount}
        onChangeText={(value) => {
          setAmount(value.replace(/[^\d.,]/g, ''));
          setMessage('');
        }}
        keyboardType="decimal-pad"
        placeholder="25000"
      />
      <AppInput
        label="Nota (opcional)"
        value={note}
        onChangeText={setNote}
        placeholder="¿En qué consiste?"
      />
      <View style={styles.categorySection}>
        <AppText color="muted">Categoría</AppText>
        <View style={styles.categories}>
          {categories.map((category) => {
            const selected = categoryId === category.id;
            return (
              <Pressable
                key={category.id}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                onPress={() => setCategoryId(category.id)}
                style={[
                  styles.category,
                  { backgroundColor: category.color },
                  selected && styles.categorySelected,
                ]}>
                <AppText>{category.name}</AppText>
              </Pressable>
            );
          })}
        </View>
      </View>
      {message ? <AppText color={message === 'Movimiento agregado.' ? 'income' : 'danger'}>{message}</AppText> : null}
      <AppButton label="Guardar movimiento" onPress={handleSubmit} />
    </AppCard>
  );
}

const styles = StyleSheet.create({
  typeRow: { flexDirection: 'row', gap: 10 },
  typeButton: {
    flex: 1,
    minHeight: 42,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 14,
    backgroundColor: '#F4F4F0',
  },
  typeSelected: { backgroundColor: palette.primary },
  categorySection: { gap: 8 },
  categories: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  category: { borderRadius: 14, paddingHorizontal: 10, paddingVertical: 7 },
  categorySelected: { borderWidth: 2, borderColor: palette.primaryDark },
});
