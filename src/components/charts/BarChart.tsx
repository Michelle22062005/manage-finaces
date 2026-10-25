import { StyleSheet, Text, View } from "react-native";
import type { ColorValue } from "react-native";
import { COLORS } from "@/constants/theme";

export type BarChartItem = {
  label: string;
  value: number; // se espera 0 o mayor
};

type BarChartProps = {
  data: BarChartItem[];
  accessibilityLabel?: string;
  barColor?: ColorValue;
  trackColor?: ColorValue;
  trackHeight?: number;
};

export function BarChart({
  data,
  accessibilityLabel = "Gráfico de barras",
  barColor = COLORS.primary,
  trackColor = "#E6F3FB",
  trackHeight = 100,
}: BarChartProps) {
  const maxValue = Math.max(...data.map((item) => item.value), 1);

  return (
    <View accessibilityLabel={accessibilityLabel} style={styles.chart}>
      {data.map((item, index) => {
        const porcentaje = item.value > 0 ? Math.max(6, (item.value / maxValue) * 100) : 0;

        return (
          <View key={`${item.label}-${index}`} style={styles.column}>
            <View style={[styles.track, { height: trackHeight, backgroundColor: trackColor }]}>
              <View
                style={[styles.bar, { height: `${porcentaje}%`, backgroundColor: barColor }]}
              />
            </View>
            <Text style={styles.label}>{item.label}</Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  chart: { flexDirection: "row", alignItems: "flex-end", gap: 12 },
  column: { flex: 1, alignItems: "center", gap: 8 },
  track: {
    width: "100%",
    maxWidth: 28,
    borderRadius: 12,
    justifyContent: "flex-end",
    overflow: "hidden",
  },
  bar: { width: "100%", borderRadius: 12 },
  label: { color: COLORS.textSecondary, fontSize: 11 },
});