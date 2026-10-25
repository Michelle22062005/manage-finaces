import React from "react";
import {
  ActivityIndicator,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import { COLORS } from "@/constants/theme";

type Variant = "primary" | "secondary" | "expense" | "outline";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: Variant;
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
}

const BACKGROUND: Record<Variant, string> = {
  primary: COLORS.primary,
  secondary: COLORS.secondary,
  expense: COLORS.expense,
  outline: COLORS.card,
};

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = "primary",
  loading = false,
  disabled = false,
  style,
  accessibilityLabel,
}) => {
  const inactivo = loading || disabled;
  const esOutline = variant === "outline";

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: BACKGROUND[variant] },
        esOutline && styles.outlineBorder,
        inactivo && styles.inactive,
        style,
      ]}
      onPress={onPress}
      disabled={inactivo}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? title}
      accessibilityState={{ disabled: inactivo, busy: loading }}
    >
      {loading ? (
        <ActivityIndicator color={esOutline ? COLORS.textPrimary : "#FFFFFF"} />
      ) : (
        <Text style={[styles.text, esOutline && styles.outlineText]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 52,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  outlineBorder: {
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  inactive: {
    opacity: 0.6,
  },
  text: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  outlineText: {
    color: COLORS.textPrimary,
  },
});