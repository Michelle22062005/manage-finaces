import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';

import { Avatar } from '@/components/common/Avatar';
import { AppButton } from '@/components/common/Button';
import { AppCard } from '@/components/common/Card';
import { AppText, Screen } from '@/components/common/Screen';
import { useAuthStore } from '@/context/useAuthStore';

export default function ProfileScreen() {
  const user = useAuthStore((state) => state.user);
  const signOut = useAuthStore((state) => state.signOut);

  function handleSignOut() {
    signOut();
    router.replace('/login');
  }

  return (
    <Screen contentStyle={styles.content}>
      <View style={styles.heading}>
        <AppText variant="eyebrow">CUENTA</AppText>
        <AppText variant="title">Tu perfil</AppText>
      </View>
      <AppCard style={styles.profileCard}>
        <Avatar name={user?.name ?? 'Invitado'} />
        <View style={styles.identity}>
          <AppText variant="section">{user?.name ?? 'Invitado'}</AppText>
          <AppText color="muted">{user?.email ?? 'Sin sesión iniciada'}</AppText>
        </View>
      </AppCard>
      <AppButton label="Cerrar sesión" variant="secondary" onPress={handleSignOut} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { gap: 20 },
  heading: { gap: 8 },
  profileCard: { alignItems: 'center', gap: 14 },
  identity: { alignItems: 'center', gap: 4 },
});
