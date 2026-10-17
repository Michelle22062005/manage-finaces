import { StyleSheet, Text, View } from 'react-native';

import { palette } from '@/constants/theme';

export type BarChartItem = {
  label: string;
  value: number;
};

export function BarChart({ data }: { data: BarChartItem[] }) {
  const maxValue = Math.max(...data.map((item) => item.value), 1);

  return (
    <View accessibilityLabel="Gráfico de movimientos diarios" style={styles.chart}>
      {data.map((item) => (
        <View key={item.label} style={styles.column}>
          <View style={styles.track}>
            <View style={[styles.bar, { height: `${Math.max(6, (item.value / maxValue) * 100)}%` }]} />
          </View>
          <Text style={styles.label}>{item.label}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  chart: { height: 132, flexDirection: 'row', alignItems: 'flex-end', gap: 12 },
  column: { flex: 1, alignItems: 'center', gap: 8 },
  track: {
    height: 100,
    width: '100%',
    maxWidth: 28,
    backgroundColor: '#F1F1EC',
    borderRadius: 12,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  bar: { width: '100%', backgroundColor: palette.primaryDark, borderRadius: 12 },
  label: { color: palette.textMuted, fontSize: 11 },
});
