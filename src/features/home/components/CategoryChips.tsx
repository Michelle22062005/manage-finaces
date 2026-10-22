import React, { useMemo } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { useFinanceStore } from "@/context/useFinanceStore";
import { CategoryIcon } from "@/components/common/CategoryIcon";

export function CategoryChips() {
  const router = useRouter();
  const categories = useFinanceStore((s) => s.categories);
  const transactions = useFinanceStore((s) => s.transactions);

  const { items, totalGastado } = useMemo(() => {
    const totals = new Map<number, number>();
    let total = 0;

    for (const t of transactions) {
      if (t.kind !== "gasto" || t.categoryId == null) continue;
      totals.set(t.categoryId, (totals.get(t.categoryId) ?? 0) + t.amount);
      total += t.amount;
    }

    const lista = categories
      .map((c) => ({ ...c, spent: totals.get(c.id) ?? 0 }))
      .sort((a, b) => b.spent - a.spent); // las que más gastas, primero

    return { items: lista, totalGastado: total };
  }, [categories, transactions]);

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      {items.map((category) => {
        const pct = totalGastado > 0 ? Math.round((category.spent / totalGastado) * 100) : 0;

        return (
          <TouchableOpacity
            key={category.id}
            style={styles.chipCard}
            activeOpacity={0.7}
            onPress={() =>
              router.push({
                pathname: "/categoria/[id]",
                params: { id: String(category.id) },
              })
            }
          >
            <View style={styles.iconCircle}>
              <CategoryIcon name={category.icon} size={22} color="#4EA8DE" />
            </View>

            <Text style={styles.categoryName} numberOfLines={2}>
              {category.name}
            </Text>

            <Text style={styles.spentAmount}>
              ${category.spent.toLocaleString("es-CO")}
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