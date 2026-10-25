import { Button } from "@/components/common/Button";
import { CategoryIcon } from "@/components/common/CategoryIcon";
import { Input } from "@/components/common/Input";
import { COLORS } from "@/constants/theme";
import { CategoryChips } from "@/features/home/components/CategoryChips";
import { SummaryCard } from "@/features/home/components/SummaryCard";
import { useHomeSreen } from "@/hooks/useHomeScreen";

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

// Fecha de hoy en Colombia, formato AAAA-MM-DD
const hoyColombia = () =>
  new Date().toLocaleDateString("en-CA", { timeZone: "America/Bogota" });

export default function HomeScreen() {
  const {
    categories,
    transactions,
    isLoading,
    loadError,
    loadInitialData,
    totalIncome,
    totalExpenses,
    netBalance,
    spentPercentage,
    addTransaction,
    transactionType,
    setTransactionType,
    note,
    setNote,
    amount,
    setAmount,
    setPickedCategoryId,
    guardando,
    setGuardando,
    selectedCategoryId,
    nombre,
    inicial,
  } = useHomeSreen();

  const handleSave = async () => {
    if (guardando) return;

    // Quita puntos, comas y espacios: "45.000" -> 45000
    const numericAmount = parseInt(amount.replace(/\D/g, ""), 10);
    if (!numericAmount || numericAmount <= 0) {
      return Alert.alert("Error", "Ingresa un monto válido mayor a 0");
    }

    setGuardando(true);
    const ok = await addTransaction({
      kind: transactionType,
      amount: numericAmount,
      date: hoyColombia(),
      categoryId: selectedCategoryId,
      note: note.trim() || null,
    });
    setGuardando(false);

    if (!ok) {
      return Alert.alert(
        "No se pudo guardar",
        "Revisa tu conexión e inténtalo de nuevo.",
      );
    }

    setAmount("");
    setNote("");
    Alert.alert("¡Éxito!", "Movimiento guardado correctamente");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* 1. Header / Navbar */}
        <View style={styles.navbar}>
          <View>
            <Text style={styles.appName}>Mi Cuenta</Text>
            <Text style={styles.subGreeting}>Hola, {nombre}</Text>
          </View>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{inicial}</Text>
          </View>
        </View>

        {/* 2. Tarjeta de Resumen del Mes */}
        <SummaryCard
          income={totalIncome}
          expenses={totalExpenses}
          netBalance={netBalance}
          spentPercentage={spentPercentage}
          isLoading={isLoading}
        />
        {loadError ? (
          <View style={styles.dataMessageContainer}>
            <Text style={styles.dataMessage}>
              {loadError} Revisa tu conexión e inténtalo de nuevo.
            </Text>
            <TouchableOpacity
              onPress={() => void loadInitialData()}
              disabled={isLoading}
              accessibilityRole="button"
            >
              <Text style={styles.retryText}>
                {isLoading ? "Cargando..." : "Reintentar"}
              </Text>
            </TouchableOpacity>
          </View>
        ) : !isLoading && transactions.length === 0 ? (
          <Text style={styles.dataMessage}>
            Aún no hay movimientos. Registra un ingreso o un gasto para ver tus
            totales aquí.
          </Text>
        ) : null}

        {/* 3. Gastos por Categoría */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Gastos por Categoría</Text>
          <CategoryChips />
        </View>

        {/* 4. Formulario Agregar Movimiento */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Agregar Movimiento</Text>

          <View style={styles.toggleContainer}>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                transactionType === "ingreso" && { backgroundColor: "#38A169" },
              ]}
              onPress={() => setTransactionType("ingreso")}
            >
              <Text
                style={[
                  styles.toggleText,
                  transactionType === "ingreso" && styles.toggleTextActive,
                ]}
              >
                + Ingreso
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.toggleButton,
                transactionType === "gasto" && { backgroundColor: "#E76F51" },
              ]}
              onPress={() => setTransactionType("gasto")}
            >
              <Text
                style={[
                  styles.toggleText,
                  transactionType === "gasto" && styles.toggleTextActive,
                ]}
              >
                - Gasto
              </Text>
            </TouchableOpacity>
          </View>

          <Input
            label="Valor (COP)"
            placeholder="$ 0"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
          />

          <Text style={styles.inputLabel}>Seleccionar Categoría</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.catRow}
            style={styles.catScroll}
          >
            {categories.map((cat) => {
              const activa = selectedCategoryId === cat.id;
              return (
                <TouchableOpacity
                  key={cat.id}
                  style={[
                    styles.selectCatChip,
                    activa && styles.selectCatChipActive,
                  ]}
                  onPress={() => setPickedCategoryId(cat.id)}
                  activeOpacity={0.7}
                >
                  <CategoryIcon
                    name={cat.icon}
                    size={16}
                    color={activa ? "#FFFFFF" : "#4EA8DE"}
                  />
                  <Text
                    style={[
                      styles.selectCatText,
                      activa && styles.selectCatTextActive,
                    ]}
                  >
                    {cat.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <Text style={styles.inputLabel}>Nota (Opcional)</Text>
          <TextInput
            style={styles.smallInput}
            placeholder="Ej. Tanque lleno en Terpel"
            placeholderTextColor={COLORS.textSecondary}
            value={note}
            onChangeText={setNote}
          />

          <Button
            title="Guardar Movimiento"
            onPress={handleSave}
            loading={guardando}
            variant={transactionType === "ingreso" ? "secondary" : "expense"}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ...los styles se quedan exactamente igual
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F4F9FD",
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  navbar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 16,
  },
  appName: {
    fontSize: 22,
    fontWeight: "800",
    color: "#4EA8DE",
  },
  subGreeting: {
    fontSize: 15,
    fontWeight: "600",
    color: "#2B2D42",
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#4EA8DE",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 18,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2B2D42",
    marginBottom: 12,
  },
  dataMessage: {
    color: "#8D99AE",
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 16,
    textAlign: "center",
  },
  dataMessageContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  retryText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: "700",
  },
  categoriesContainer: {
    marginBottom: 20,
    flexDirection: "row",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 20,
    marginBottom: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2B2D42",
    marginBottom: 14,
  },
  toggleContainer: {
    flexDirection: "row",
    backgroundColor: "#F4F9FD",
    borderRadius: 14,
    padding: 4,
    marginBottom: 16,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  toggleText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#8D99AE",
  },
  toggleTextActive: {
    color: "#FFFFFF",
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginBottom: 6,
  },
  selectCatChip: {
    backgroundColor: COLORS.background,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    marginRight: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  selectCatChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  selectCatText: { fontSize: 13, color: COLORS.textPrimary, fontWeight: "600" },
  selectCatTextActive: { color: "#FFFFFF" },
  smallInput: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    height: 48,
    paddingHorizontal: 12,
    fontSize: 14,
    color: COLORS.textPrimary,
    marginBottom: 16,
  },
  section: {
    marginTop: 24,
    marginBottom: 24,
  },
  catScroll: {
    marginBottom: 16,
  },
  catRow: {
    paddingRight: 8,
    gap: 8,
  },
});
