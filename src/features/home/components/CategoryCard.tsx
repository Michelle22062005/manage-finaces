import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface CategoryCardProps {
  name: string;
  spent: number;
  icon?: string;
  onPress: () => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ name, spent, icon = '📁', onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.name} numberOfLines={1}>{name}</Text>
      <Text style={styles.spent}>${spent.toLocaleString('es-CO')}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginRight: 12,
    width: 110,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  icon: {
    fontSize: 28,
    marginBottom: 8,
  },
  name: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2B2D42',
    textAlign: 'center',
  },
  spent: {
    fontSize: 13,
    fontWeight: '700',
    color: '#E76F51',
    marginTop: 4,
  },
});