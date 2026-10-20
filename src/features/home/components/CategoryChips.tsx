import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { useFinanceStore } from "@/context/useFinanceStore";
import { CategoryIcon } from "@/components/common/CategoryIcon";

export function CategoryChips() {
  const router = useRouter();
  const { categories, getCategorySpent } = useFinanceStore();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      {categories.map((category) => {
        const spent = getCategorySpent(category.id);

        return (
          <TouchableOpacity
            key={category.id}
            style={styles.chipCard}
            activeOpacity={0.7}
            onPress={() => router.push({
  pathname: "/categoria/[id]",
  params: { id: String(category.id) },
})}
          >
            <View style={styles.iconCircle}>
              <CategoryIcon name={category.icon} size={22} color="#4EA8DE" />
            </View>
            <Text style={styles.categoryName} numberOfLines={2}>
              {category.name}
            </Text>
            <Text style={styles.spentAmount}>
              ${spent.toLocaleString("es-CO")}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    paddingRight: 20,
    gap: 12,
  },
  chipCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 14,
    alignItems: "center",
    width: 112,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#E6F3FB", // celeste pastel
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 13,
    fontWeight: "600",
    color: "#2B2D42",
    textAlign: "center",
    minHeight: 32, // para que todas las tarjetas queden del mismo alto
  },
  spentAmount: {
    fontSize: 13,
    fontWeight: "700",
    color: "#E76F51",
    marginTop: 2,
  },
});