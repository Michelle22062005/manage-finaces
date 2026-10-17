import { Link } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { categories } from '@/constants/categories';

export function CategoryChips() {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      {categories.map((category) => (
        <Link
          key={category.id}
          href={{ pathname: '/categoria/[id]', params: { id: category.id } }}
          asChild>
          <Text style={[styles.chip, { backgroundColor: category.color }]}>{category.name}</Text>
        </Link>
      ))}
      <View />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { gap: 10, paddingRight: 8 },
  chip: { overflow: 'hidden', borderRadius: 18, paddingHorizontal: 15, paddingVertical: 10, color: '#282B32', fontWeight: '600' },
});
