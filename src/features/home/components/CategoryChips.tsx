import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useFinanceStore } from '@/context/useFinanceStore';

export function CategoryChips() {
  const router = useRouter();
  const { categories, getCategorySpent } = useFinanceStore();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      {categories.map((category) => {
        const spent = getCategorySpent(category.id);
        
        return (
          <TouchableOpacity
            key={category.id}
            style={styles.chipCard}
            activeOpacity={0.7}
            onPress={() => router.push(`/categoria/${category.id}` as any)}
          >
            <Text style={styles.icon}>{category.icon || '📁'}</Text>
            <Text style={styles.categoryName}>{category.name}</Text>
            <Text style={styles.spentAmount}>${spent.toLocaleString('es-CO')}</Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    paddingRight: 20,
    gap: 12,
  },
  chipCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 14,
    alignItems: 'center',
    minWidth: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  icon: {
    fontSize: 24,
    marginBottom: 6,
  },
  categoryName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2B2D42',
  },
  spentAmount: {
    fontSize: 13,
    fontWeight: '700',
    color: '#E76F51',
    marginTop: 2,
  },
});