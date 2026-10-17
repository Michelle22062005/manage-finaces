import { StyleSheet, Text, View } from 'react-native';

import { palette } from '@/constants/theme';

export function Avatar({ name }: { name: string }) {
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');

  return (
    <View accessibilityLabel={`Avatar de ${name}`} style={styles.avatar}>
      <Text style={styles.initials}>{initials || 'U'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: palette.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: { color: palette.primaryDark, fontSize: 22, fontWeight: '800' },
});
