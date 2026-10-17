import type { ReactNode } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, Text, View, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';

import { palette } from '@/constants/theme';

type TextColor = 'default' | 'muted' | 'income' | 'danger';

export function Screen({
  children,
  contentStyle,
}: {
  children: ReactNode;
  contentStyle?: StyleProp<ViewStyle>;
}) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={[styles.content, contentStyle]}>{children}</View>
    </SafeAreaView>
  );
}

export function AppText({
  children,
  variant = 'body',
  color = 'default',
  style,
}: {
  children: ReactNode;
  variant?: 'body' | 'eyebrow' | 'title' | 'section';
  color?: TextColor;
  style?: StyleProp<TextStyle>;
}) {
  const colorValue = {
    default: palette.text,
    muted: palette.textMuted,
    income: palette.income,
    danger: palette.danger,
  }[color];

  return <Text style={[styles.text, textVariants[variant], { color: colorValue }, style]}>{children}</Text>;
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: palette.background },
  content: { flex: 1, padding: 20 },
  text: { color: palette.text, fontSize: 15, lineHeight: 22 },
});

const textVariants = StyleSheet.create({
  body: {},
  eyebrow: { color: palette.primaryDark, fontSize: 12, fontWeight: '800', letterSpacing: 1.4 },
  title: { fontSize: 30, lineHeight: 36, fontWeight: '800' },
  section: { fontSize: 18, lineHeight: 24, fontWeight: '700' },
});
