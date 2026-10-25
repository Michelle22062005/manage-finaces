import { useGoldSreen } from "@/hooks/useGoldSreen";
import {
  Text,
  View,
  StyleSheet
} from "react-native";
import { COLORS } from "@/constants/theme";
import { formatearGramos, } from "@/lib/gold";
import { CategoryIcon } from "@/components/common/CategoryIcon";

const cop = (n: number) => `$${n.toLocaleString("es-CO")}`;


export function CardAmount(){
    const { resumen, } = useGoldSreen()

    return(
        <View style={styles.balanceCard}>
                  <View style={styles.balanceIcon}>
                    <CategoryIcon name="gold" size={26} color="#C9A227" />
                  </View>
                  <Text style={styles.balanceLabel}>Tienes</Text>
                  <Text style={styles.balanceValue}>
                    {formatearGramos(resumen.saldo)}
                  </Text>
        
                  <View style={styles.metricsRow}>
                    <View style={styles.metricBox}>
                      <Text style={styles.metricLabel}>Entraron</Text>
                      <Text style={[styles.metricValue, { color: COLORS.secondary }]}>
                        {formatearGramos(resumen.entradas)}
                      </Text>
                    </View>
                    <View style={styles.metricDivider} />
                    <View style={styles.metricBox}>
                      <Text style={styles.metricLabel}>Salieron</Text>
                      <Text style={[styles.metricValue, { color: COLORS.expense }]}>
                        {formatearGramos(resumen.salidas)}
                      </Text>
                    </View>
                    <View style={styles.metricDivider} />
                    <View style={styles.metricBox}>
                      <Text style={styles.metricLabel}>Vendido</Text>
                      <Text style={[styles.metricValue, { color: COLORS.primary }]}>
                        {cop(resumen.vendido)}
                      </Text>
                    </View>
                  </View>
                </View>
    )
}
const styles = StyleSheet.create({
     balanceCard: {
    backgroundColor: COLORS.card,
    borderRadius: 24,
    padding: 20,
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  balanceIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#FFF6D6",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  balanceLabel: { fontSize: 13, color: COLORS.textSecondary },
  balanceValue: {
    fontSize: 30,
    fontWeight: "800",
    color: COLORS.textPrimary,
    marginTop: 2,
  },
  metricsRow: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "stretch",
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  metricBox: { flex: 1, alignItems: "center" },
  metricLabel: { fontSize: 12, color: COLORS.textSecondary, marginBottom: 4 },
  metricValue: { fontSize: 13, fontWeight: "700" },
  metricDivider: { width: 1, height: 24, backgroundColor: COLORS.border },
})