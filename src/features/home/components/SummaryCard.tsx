import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface SummaryCardProps {
  income: number;
  expenses: number;
  netBalance: number;
  spentPercentage: number;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({
  income,
  expenses,
  netBalance,
  spentPercentage,
}) => {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Resumen del Mes</Text>

      <View style={styles.ringContainer}>
        <View style={styles.progressCircle}>
          <Text style={styles.progressPercentage}>{spentPercentage}%</Text>
          <Text style={styles.progressLabel}>gastado</Text>
        </View>
      </View>

      <View style={styles.metricsRow}>
        <View style={styles.metricBox}>
          <Text style={styles.metricLabel}>Ganado</Text>
          <Text style={[styles.metricValue, { color: '#38A169' }]}>
            ${income.toLocaleString('es-CO')}
          </Text>
        </View>

        <View style={styles.metricDivider} />

        <View style={styles.metricBox}>
          <Text style={styles.metricLabel}>Gastado</Text>
          <Text style={[styles.metricValue, { color: '#E76F51' }]}>
            ${expenses.toLocaleString('es-CO')}
          </Text>
        </View>

        <View style={styles.metricDivider} />

        <View style={styles.metricBox}>
          <Text style={styles.metricLabel}>Te quedó</Text>
          <Text style={[styles.metricValue, { color: '#4EA8DE' }]}>
            ${netBalance.toLocaleString('es-CO')}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: { backgroundColor: '#FFFFFF', borderRadius: 24, padding: 20, marginBottom: 20 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#2B2D42', marginBottom: 12 },
  ringContainer: { alignItems: 'center', marginVertical: 10 },
  progressCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 8,
    borderColor: '#4EA8DE',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F8FF',
  },
  progressPercentage: { fontSize: 22, fontWeight: '800', color: '#2B2D42' },
  progressLabel: { fontSize: 12, color: '#8D99AE' },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  metricBox: { alignItems: 'center', flex: 1 },
  metricLabel: { fontSize: 12, color: '#8D99AE', marginBottom: 4 },
  metricValue: { fontSize: 13, fontWeight: '700' },
  metricDivider: { width: 1, height: 24, backgroundColor: '#E2E8F0' },
});