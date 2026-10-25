import { useGoldSreen } from "@/hooks/useGoldSreen"
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { COLORS } from "@/constants/theme";
import { Button } from "@/components/common/Button";


export function GolsForm(){
    const {gramosTxt,setGramosTxt, valorTxt, setValorTxt, nota,setNota, guardando,  tipo, setTipo, handleSave,  } = useGoldSreen()

    return (
        <View style={styles.card}>
                  <Text style={styles.cardTitle}>Registrar oro</Text>
        
                  <View style={styles.toggleContainer}>
                    <TouchableOpacity
                      style={[
                        styles.toggleButton,
                        tipo === "entrada" && { backgroundColor: "#38A169" },
                      ]}
                      onPress={() => setTipo("entrada")}
                    >
                      <Text
                        style={[
                          styles.toggleText,
                          tipo === "entrada" && styles.toggleTextActive,
                        ]}
                      >
                        + Entrada
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.toggleButton,
                        tipo === "salida" && { backgroundColor: "#E76F51" },
                      ]}
                      onPress={() => setTipo("salida")}
                    >
                      <Text
                        style={[
                          styles.toggleText,
                          tipo === "salida" && styles.toggleTextActive,
                        ]}
                      >
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
                        Si lo escribes, también queda como ingreso en el historial de
                        dinero.
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
        
                  <Button
                    title="Guardar"
                    onPress={handleSave}
                    loading={guardando}
                    variant={tipo === "entrada" ? "secondary" : "expense"}
                  />
                </View>
    )
}
const styles = StyleSheet.create({
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
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 16,
  },
  toggleContainer: {
    flexDirection: "row",
    backgroundColor: COLORS.background,
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
  helper: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: -4,
    marginBottom: 12,
  },
})