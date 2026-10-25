import { useGoldSreen } from "@/hooks/useGoldSreen";
import {
  Text,
  View,
  StyleSheet
} from "react-native";
import { CategoryIcon } from "@/components/common/CategoryIcon";
import { formatearGramos, } from "@/lib/gold";
import { COLORS } from "@/constants/theme";



const MESES = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
];
const hoyColombia = () =>
  new Date().toLocaleDateString("en-CA", { timeZone: "America/Bogota" });

const etiquetaDia = (fecha: string) => {
  if (fecha === hoyColombia()) return "Hoy";
  const [, m, d] = fecha.split("-").map(Number);
  return `${d} de ${MESES[m - 1]}`;
};

const cop = (n: number) => `$${n.toLocaleString("es-CO")}`;

export function HistoryGold(){
    const { dias,} = useGoldSreen()

    return(
        <View>

            {dias.length === 0 ? (
                      <Text style={styles.emptyText}>Aún no hay movimientos de oro.</Text>
                    ) : (
                      dias.map((dia) => (
                        <View key={dia.fecha} style={styles.dayGroup}>
                          <View style={styles.dayHeader}>
                            <Text style={styles.dayTitle}>{etiquetaDia(dia.fecha)}</Text>
                            <Text
                              style={[
                                styles.dayNet,
                                {
                                  color: dia.neto >= 0 ? COLORS.secondary : COLORS.expense,
                                },
                              ]}
                            >
                              {dia.neto >= 0 ? "+ " : "- "}
                              {formatearGramos(Math.abs(dia.neto))}
                            </Text>
                          </View>
            
                          <View style={styles.movementsCard}>
                            {dia.movs.map((m, i) => {
                              const esEntrada = m.kind === "entrada";
                              return (
                                <View
                                  key={m.id}
                                  style={[
                                    styles.movementRow,
                                    i === dia.movs.length - 1 && { borderBottomWidth: 0 },
                                  ]}
                                >
                                  <View style={styles.iconCircle}>
                                    <CategoryIcon name="gold" size={20} color="#C9A227" />
                                  </View>
            
                                  <View style={styles.movementDetails}>
                                    <Text style={styles.movementTitle}>
                                      {esEntrada ? "Entrada" : "Salida / venta"}
                                    </Text>
                                    {m.note ? (
                                      <Text style={styles.movementNote}>{m.note}</Text>
                                    ) : null}
                                  </View>
            
                                  <View style={{ alignItems: "flex-end" }}>
                                    <Text
                                      style={[
                                        styles.gramsText,
                                        {
                                          color: esEntrada
                                            ? COLORS.secondary
                                            : COLORS.expense,
                                        },
                                      ]}
                                    >
                                      {esEntrada ? "+" : "-"}
                                      {formatearGramos(m.grams)}
                                    </Text>
                                    {m.amount ? (
                                      <Text style={styles.moneyText}>{cop(m.amount)}</Text>
                                    ) : null}
                                  </View>
                                </View>
                              );
                            })}
                          </View>
                        </View>
                      ))
                    )}
        </View>
    )
}

const styles = StyleSheet.create({
    emptyText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    textAlign: "center",
    marginTop: 12,
  },
    dayGroup: { marginBottom: 20 },
  dayHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  dayTitle: { fontSize: 14, fontWeight: "700", color: COLORS.textPrimary },
  dayNet: { fontSize: 13, fontWeight: "700" },
  movementsCard: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
   movementRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#FFF6D6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  movementDetails: { flex: 1 },
  movementTitle: { fontSize: 15, fontWeight: "600", color: COLORS.textPrimary },
  movementNote: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  gramsText: { fontSize: 15, fontWeight: "700" },
  moneyText: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
})