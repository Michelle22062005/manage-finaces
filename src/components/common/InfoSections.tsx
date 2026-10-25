import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { COLORS } from "@/constants/theme";
import { CategoryIcon } from "@/components/common/CategoryIcon";

export type InfoSection = {
  icon?: string;
  title: string;
  body: string;
};

type Props = {
  intro?: string;
  sections: InfoSection[];
  footer?: string;
};

export function InfoSections({ intro, sections, footer }: Props) {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {intro ? <Text style={styles.intro}>{intro}</Text> : null}

      {sections.map((s) => (
        <View key={s.title} style={styles.card}>
          <View style={styles.titleRow}>
            {s.icon ? (
              <View style={styles.iconCircle}>
                <CategoryIcon name={s.icon} size={20} color="#4EA8DE" />
              </View>
            ) : null}
            <Text style={styles.title}>{s.title}</Text>
          </View>
          <Text style={styles.body}>{s.body}</Text>
        </View>
      ))}

      {footer ? <Text style={styles.footer}>{footer}</Text> : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: 20, paddingBottom: 40 },
  intro: {
    fontSize: 15,
    lineHeight: 22,
    color: COLORS.textPrimary,
    marginBottom: 16,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  titleRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: "#E6F3FB",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  title: { flex: 1, fontSize: 15, fontWeight: "700", color: COLORS.textPrimary },
  body: { fontSize: 14, lineHeight: 21, color: COLORS.textSecondary },
  footer: {
    fontSize: 12,
    lineHeight: 18,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginTop: 8,
  },
});