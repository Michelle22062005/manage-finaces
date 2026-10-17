import { Link } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { AppText, Screen } from '@/components/common/Screen';
import { palette } from '@/constants/theme';

export default function NotFoundScreen() {
  return (
    <Screen contentStyle={styles.content}>
      <View style={styles.message}>
        <AppText variant="title">Página no encontrada</AppText>
        <Link href="/" style={styles.link}>
          Volver al inicio
        </Link>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { justifyContent: 'center' },
  message: { alignItems: 'center', gap: 16 },
  link: { color: palette.primaryDark, fontWeight: '700' },
});
