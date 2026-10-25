
import {
  ScrollView,
  StyleSheet,
  Text,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "@/constants/theme";
import { CardAmount } from "@/features/gold/components/CardAmount";
import { GolsForm } from "@/features/gold/components/GoldForm";
import { HistoryGold } from "@/features/gold/components/HistoryGold";





export default function OroScreen() {
  
  

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
        <CardAmount/>

        {/* Formulario */}
        <GolsForm/>

        {/* Historial de oro */}
        <Text style={styles.sectionTitle}>Historial de oro</Text>
        <HistoryGold/>
        
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
  saveButton: {
    backgroundColor: COLORS.primary,
    height: 52,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 4,
  },
  saveText: { color: "#FFFFFF", fontSize: 15, fontWeight: "700" },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  
});
