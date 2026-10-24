import React, { useMemo, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFinanceStore } from "@/context/useFinanceStore";
import { COLORS } from "@/constants/theme";
import { CategoryIcon } from "@/components/common/CategoryIcon";
import { formatearGramos, resumenOro } from "@/lib/gold";
import type { GoldKind, GoldMovement } from "@/types/finance";

const MESES = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

const hoyColombia = () =>
  new Date().toLocaleDateString("en-CA", { timeZone: "America/Bogota" });

const etiquetaDia = (fecha: string) => {
  if (fecha === hoyColombia()) return "Hoy";
  const [, m, d] = fecha.split("-").map(Number);
  return `${d} de ${MESES[m - 1]}`;
};

const cop = (n: number) => `$${n.toLocaleString("es-CO")}`;

export default function OroScreen() {
  const goldMovements = useFinanceStore((s) => s.goldMovements);
  const addGold = useFinanceStore((s) => s.addGold);

  const [tipo, setTipo] = useState<GoldKind>("entrada");
  const [gramosTxt, setGramosTxt] = useState("");
  const [valorTxt, setValorTxt] = useState("");
  const [nota, setNota] = useState("");
  const [guardando, setGuardando] = useState(false);

  const resumen = useMemo(() => resumenOro(goldMovements), [goldMovements]);

  // Agrupar por día (el backend ya los manda del más reciente al más antiguo)
  const dias = useMemo(() => {
    const grupos = new Map<string, GoldMovement[]>();
    for (const m of goldMovements) {
      const lista = grupos.get(m.date) ?? [];
      lista.push(m);
      grupos.set(m.date, lista);
    }
    return [...grupos.entries()]
      .sort((a, b) => b[0].localeCompare(a[0]))
      .map(([fecha, movs]) => ({
        fecha,
        movs,
        neto: Math.round(
          movs.reduce((s, m) => s + (m.kind === "entrada" ? m.grams : -m.grams), 0) * 1000,
        ) / 1000,
      }));
  }, [goldMovements]);

  const handleSave = async () => {
    if (guardando) return;

    const g = Number(gramosTxt.replace(",", "."));
    if (!Number.isFinite(g) || g <= 0) {
      return Alert.alert("Error", "Ingresa los gramos (ejemplo: 12,5).");
    }
    if (Math.round(g * 1000) / 1000 !== g) {
      return Alert.alert("Error", "Usa máximo 3 decimales.");
    }
    if (tipo === "salida" && Math.round(g * 1000) > Math.round(resumen.saldo * 1000)) {
      return Alert.alert("No alcanza", `Solo tienes ${formatearGramos(resumen.saldo)}.`);
    }

    const valor = parseInt(valorTxt.replace(/\D/g, ""), 10);

    setGuardando(true);
    const error = await addGold({
      kind: tipo,
      grams: g,
      date: hoyColombia(),
      amount: tipo === "salida" && !Number.isNaN(valor) && valor > 0 ? valor : null,
      note: nota.trim() || null,
    });
    setGuardando(false);

    if (error) return Alert.alert("No se pudo guardar", error);

    setGramosTxt("");
    setValorTxt("");
    setNota("");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.screenTitle}>Oro</Text>

        {/* Saldo */}
        <View style={styles.balanceCard}>
          <View style={styles.balanceIcon}>
            <CategoryIcon name="gold" size={26} color="#C9A227" />
          </View>
          <Text style={styles.balanceLabel}>Tienes</Text>
          <Text style={styles.balanceValue}>{formatearGramos(resumen.saldo)}</Text>

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

        {/* Formulario */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Registrar oro</Text>

          <View style={styles.toggleContainer}>
            <TouchableOpacity
              style={[styles.toggleButton, tipo === "entrada" && { backgroundColor: "#38A169" }]}
              onPress={() => setTipo("entrada")}
            >
              <Text style={[styles.toggleText, tipo === "entrada" && styles.toggleTextActive]}>
                + Entrada
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toggleButton, tipo === "salida" && { backgroundColor: "#E76F51" }]}
              onPress={() => setTipo("salida")}
            >
              <Text style={[styles.toggleText, tipo === "salida" && styles.toggleTextActive]}>
                − Salida / venta
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.inputLabel}>Gramos</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej. 12,5"
            placeholderTextColor={COLORS.textSecondary}
            keyboardType="decimal-pad"
            value={gramosTxt}
            onChangeText={setGramosTxt}
          />

          {tipo === "salida" && (
            <>
              <Text style={styles.inputLabel}>Dinero recibido (opcional)</Text>
              <TextInput
                style={styles.input}
                placeholder="$ 0"
                placeholderTextColor={COLORS.textSecondary}
                keyboardType="numeric"
                value={valorTxt}
                onChangeText={setValorTxt}
              />
              <Text style={styles.helper}>
                Si lo escribes, también queda como ingreso en el historial de dinero.
              </Text>
            </>
          )}

          <Text style={styles.inputLabel}>Nota (opcional)</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej. Vendido en el centro"
            placeholderTextColor={COLORS.textSecondary}
            value={nota}
            onChangeText={setNota}
          />

          <TouchableOpacity
            style={[styles.saveButton, guardando && { opacity: 0.6 }]}
            onPress={handleSave}
            disabled={guardando}
            activeOpacity={0.8}
          >
            <Text style={styles.saveText}>{guardando ? "Guardando..." : "Guardar"}</Text>
          </TouchableOpacity>
        </View>

        {/* Historial de oro */}
        <Text style={styles.sectionTitle}>Historial de oro</Text>

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
                    { color: dia.neto >= 0 ? COLORS.secondary : COLORS.expense },
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
                        {m.note ? <Text style={styles.movementNote}>{m.note}</Text> : null}
                      </View>

                      <View style={{ alignItems: "flex-end" }}>
                        <Text
                          style={[
                            styles.gramsText,
                            { color: esEntrada ? COLORS.secondary : COLORS.expense },
                          ]}
                        >
                          {esEntrada ? "+" : "-"}
                          {formatearGramos(m.grams)}
                        </Text>
                        {m.amount ? <Text style={styles.moneyText}>{cop(m.amount)}</Text> : null}
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  container: { flex: 1, paddingHorizontal: 20 },
  screenTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: COLORS.textPrimary,
    marginTop: 16,
    marginBottom: 16,
  },

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
  balanceValue: { fontSize: 30, fontWeight: "800", color: COLORS.textPrimary, marginTop: 2 },
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

  card: {
    backgroundColor: COLORS.card,
    borderRadius: 24,
    padding: 20,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTitle: { fontSize: 16, fontWeight: "700", color: COLORS.textPrimary, marginBottom: 16 },
  toggleContainer: {
    flexDirection: "row",
    backgroundColor: COLORS.background,
    borderRadius: 14,
    padding: 4,
    marginBottom: 16,
  },
  toggleButton: { flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: "center" },
  toggleText: { fontSize: 13, fontWeight: "700", color: "#8D99AE" },
  toggleTextActive: { color: "#FFFFFF" },
  inputLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginTop: 4,
    marginBottom: 8,
  },
  input: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    height: 48,
    paddingHorizontal: 12,
    fontSize: 14,
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  helper: { fontSize: 12, color: COLORS.textSecondary, marginTop: -4, marginBottom: 12 },
  saveButton: {
    backgroundColor: COLORS.primary,
    height: 52,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 4,
  },
  saveText: { color: "#FFFFFF", fontSize: 15, fontWeight: "700" },

  sectionTitle: { fontSize: 16, fontWeight: "700", color: COLORS.textPrimary, marginBottom: 12 },
  emptyText: { color: COLORS.textSecondary, fontSize: 14, textAlign: "center", marginTop: 12 },
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
});