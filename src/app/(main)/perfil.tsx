import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  StatusBar,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useFinanceStore } from '@/context/useFinanceStore';
import { COLORS } from '@/constants/theme';
import { useAuthStore } from '@/context/useAuthStore';

export default function ProfileScreen() {
  const router = useRouter();
  const { categories } = useFinanceStore();
  const user = useAuthStore((state) => state.user);

  const handleLogout = () => {
    Alert.alert(
      'Cerrar sesión',
      '¿Estás segura de que deseas salir de Mis Cuentas?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sí, salir',
          style: 'destructive',
          onPress: () => router.replace('/(auth)/login'),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        
        {/* Header de la pantalla */}
        <Text style={styles.screenTitle}>Perfil</Text>

        {/* 1. Tarjeta de Usuario */}
        <View style={styles.profileCard}>
          <View style={styles.avatarLarge}>
            <Text style={styles.avatarTextLarge}>D</Text>
          </View>
          <Text style={styles.userName}>{user?.name || 'Usuario'}</Text>
          <Text style={styles.userRole}>Conductora de Taxi 🚕</Text>
          <Text style={styles.userEmail}>{user?.email || 'correo@ejemplo.com'}</Text>
        </View>

        {/* 2. Resumen de Estadísticas */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{categories.length}</Text>
            <Text style={styles.statLabel}>Categorías</Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statBox}>
            <Text style={styles.statNumber}>COP ($)</Text>
            <Text style={styles.statLabel}>Moneda</Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statBox}>
            <Text style={styles.statNumber}>Activo</Text>
            <Text style={styles.statLabel}>Estado</Text>
          </View>
        </View>

        {/* 3. Menú de Opciones y Configuración */}
        <Text style={styles.sectionTitle}>Ajustes de la Aplicación</Text>

        <View style={styles.optionsCard}>
          <TouchableOpacity style={styles.optionRow} activeOpacity={0.7}>
            <View style={styles.optionIconContainer}>
              <Text style={styles.optionIcon}>📊</Text>
            </View>
            <View style={styles.optionTextContainer}>
              <Text style={styles.optionTitle}>Presupuestos por Categoría</Text>
              <Text style={styles.optionSubtitle}>Ajustar metas mensuales de gasto</Text>
            </View>
            <Text style={styles.arrowIcon}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionRow} activeOpacity={0.7}>
            <View style={styles.optionIconContainer}>
              <Text style={styles.optionIcon}>🔔</Text>
            </View>
            <View style={styles.optionTextContainer}>
              <Text style={styles.optionTitle}>Recordatorios de Registro</Text>
              <Text style={styles.optionSubtitle}>Aviso al finalizar el turno diario</Text>
            </View>
            <Text style={styles.arrowIcon}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionRow} activeOpacity={0.7}>
            <View style={styles.optionIconContainer}>
              <Text style={styles.optionIcon}>🔒</Text>
            </View>
            <View style={styles.optionTextContainer}>
              <Text style={styles.optionTitle}>Seguridad y Cuenta</Text>
              <Text style={styles.optionSubtitle}>Cambiar contraseña o correo</Text>
            </View>
            <Text style={styles.arrowIcon}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.optionRow, { borderBottomWidth: 0 }]}
            activeOpacity={0.7}
          >
            <View style={styles.optionIconContainer}>
              <Text style={styles.optionIcon}>💬</Text>
            </View>
            <View style={styles.optionTextContainer}>
              <Text style={styles.optionTitle}>Ayuda y Soporte</Text>
              <Text style={styles.optionSubtitle}>Preguntas frecuentes y contacto</Text>
            </View>
            <Text style={styles.arrowIcon}>›</Text>
          </TouchableOpacity>
        </View>

        {/* 4. Botón de Cerrar Sesión */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.8}>
          <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
        </TouchableOpacity>

        {/* Versión de la app */}
        <Text style={styles.versionText}>Mis Cuentas v1.0.0 • Calidez en Ruta</Text>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginTop: 16,
    marginBottom: 16,
  },
  profileCard: {
    backgroundColor: COLORS.card,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  avatarLarge: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarTextLarge: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '800',
  },
  userName: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  userRole: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
    marginTop: 2,
  },
  userEmail: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.card,
    borderRadius: 20,
    paddingVertical: 16,
    marginBottom: 24,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: COLORS.border,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  optionsCard: {
    backgroundColor: COLORS.card,
    borderRadius: 24,
    paddingHorizontal: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  optionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  optionIcon: {
    fontSize: 18,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  optionSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  arrowIcon: {
    fontSize: 20,
    color: COLORS.textSecondary,
    fontWeight: '300',
  },
  logoutButton: {
    backgroundColor: COLORS.coralSoft,
    height: 52,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoutButtonText: {
    color: COLORS.expense,
    fontSize: 15,
    fontWeight: '700',
  },
  versionText: {
    textAlign: 'center',
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 30,
  },
});