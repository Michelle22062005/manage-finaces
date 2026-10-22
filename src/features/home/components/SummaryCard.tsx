import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Svg, { Circle } from "react-native-svg";

interface SummaryCardProps {
  income: number;
  expenses: number;
  netBalance: number;
  spentPercentage: number;
  isLoading: boolean;
}

const SIZE = 120;
const STROKE = 10;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

// Formatea pesos y maneja negativos: -$5.000 en vez de $-5.000
const cop = (n: number) => `${n < 0 ? "-" : ""}$${Math.abs(n).toLocaleString("es-CO")}`;

export const SummaryCard: React.FC<SummaryCardProps> = ({
  income,
  expenses,
  netBalance,
  spentPercentage,
  isLoading,
}) => {
  const pct = Math.max(0, Math.min(100, spentPercentage));
  const offset = CIRCUMFERENCE * (1 - pct / 100);
  const colorAnillo = pct >= 90 ? "#E76F51" : "#4EA8DE"; // coral cuando casi no queda nada

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Resumen del Mes</Text>

      <View style={styles.ringContainer}>
        <View style={{ width: SIZE, height: SIZE }}>
          <Svg width={SIZE} height={SIZE}>
            {/* Pista de fondo */}
            <Circle
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={RADIUS}
              stroke="#E6F3FB"
              strokeWidth={STROKE}
              fill="none"
            />
            {/* Progreso */}
            <Circle
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={RADIUS}
              stroke={colorAnillo}
              strokeWidth={STROKE}
              fill="none"
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={offset}
              rotation="-90"
              origin={`${SIZE / 2}, ${SIZE / 2}`}
            />
          </Svg>

          {/* Texto centrado sobre el anillo */}
          <View style={styles.ringText}>
            <Text style={styles.progressPercentage}>
              {isLoading ? "…" : `${pct}%`}
            </Text>
            <Text style={styles.progressLabel}>gastado</Text>
          </View>
        </View>
      </View>

      <View style={styles.metricsRow}>
        <View style={styles.metricBox}>
          <Text style={styles.metricLabel}>Ganado</Text>
          <Text style={[styles.metricValue, { color: "#38A169" }]}>
            {isLoading ? "…" : cop(income)}
          </Text>
        </View>

        <View style={styles.metricDivider} />

        <View style={styles.metricBox}>
          <Text style={styles.metricLabel}>Gastado</Text>
          <Text style={[styles.metricValue, { color: "#E76F51" }]}>
            {isLoading ? "…" : cop(expenses)}
          </Text>
        </View>

        <View style={styles.metricDivider} />

        <View style={styles.metricBox}>
          <Text style={styles.metricLabel}>Te quedó</Text>
          <Text
            style={[
              styles.metricValue,
              { color: netBalance < 0 ? "#E76F51" : "#4EA8DE" },
            ]}
          >
            {isLoading ? "…" : cop(netBalance)}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: { backgroundColor: "#FFFFFF", borderRadius: 24, padding: 20, marginBottom: 20 },
  cardTitle: { fontSize: 16, fontWeight: "700", color: "#2B2D42", marginBottom: 12 },
  ringContainer: { alignItems: "center", marginVertical: 10 },
  ringText: {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  justifyContent: "center",
  alignItems: "center",
},
  progressPercentage: { fontSize: 24, fontWeight: "800", color: "#2B2D42" },
  progressLabel: { fontSize: 12, color: "#8D99AE" },
  metricsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
  },
  metricBox: { alignItems: "center", flex: 1 },
  metricLabel: { fontSize: 12, color: "#8D99AE", marginBottom: 4 },
  metricValue: { fontSize: 13, fontWeight: "700" },
  metricDivider: { width: 1, height: 24, backgroundColor: "#E2E8F0" },
});