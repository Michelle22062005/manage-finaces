import { StyleSheet, Text, View } from 'react-native';

import { palette } from '@/constants/theme';

export function ProgressRing({ percentage, label }: { percentage: number; label: string }) {
  const safePercentage = Math.min(100, Math.max(0, Math.round(percentage)));

  return (
    <View
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: safePercentage }}
      style={styles.ring}>
      <Text style={styles.percentage}>{safePercentage}%</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  ring: {
    width: 112,
    height: 112,
    borderWidth: 10,
    borderColor: palette.primary,
    borderRadius: 56,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.surface,
  },
  percentage: { color: palette.text, fontSize: 22, fontWeight: '800' },
  label: { color: palette.textMuted, fontSize: 11 },
});
