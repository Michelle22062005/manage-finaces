import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  Platform,
  StatusBar,
  Alert,
} from 'react-native';
import { useFinanceStore } from '@/context/useFinanceStore';
import { useRouter } from 'expo-router';
import { COLORS } from '@/constants/theme';

export default function HomeScreen() {
  const router = useRouter();

  // Consumir datos del Store de Zustand
  const { 
    categories, 
    addTransaction, 
    getTotalIncome, 
    getTotalExpenses, 
    getNetBalance, 
    getSpentPercentage,
    getCategorySpent 
  } = useFinanceStore();

  // Estados del formulario local
  const [transactionType, setTransactionType] = useState<'ingreso' | 'gasto'>('gasto');
  const [amount, setAmount] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number>(categories[0]?.id || 1);
  const [note, setNote] = useState('');

  // Valores dinámicos calculados por Zustand
  const totalIncome = getTotalIncome();
  const totalExpenses = getTotalExpenses();
  const netBalance = getNetBalance();
  const spentPercentage = getSpentPercentage();

  const handleSave = () => {
    const numericAmount = parseInt(amount, 10);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      Alert.alert('Monto inválido', 'Por favor ingresa un valor mayor a 0');
      return;
    }

    // Agregar al estado global
    addTransaction({
      userId: 'usuario-prueba',
      kind: transactionType,
      amount: numericAmount,
      date: new Date().toISOString().split('T')[0], // Fecha de hoy YYYY-MM-DD
      categoryId: selectedCategoryId,
      note: note.trim() || null,
    });

    // Limpiar formulario y notificar
    setAmount('');
    setNote('');
    Alert.alert('¡Éxito!', 'Movimiento guardado correctamente');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <View style={styles.navbar}>
          <View>
            <Text style={styles.appName}>Mis Cuentas</Text>
            <Text style={styles.subGreeting}>Hola, Danna 👋</Text>
          </View>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>D</Text>
          </View>
        </View>

        {/* Tarjeta de Resumen DÍNAMICA */}
        <View style={styles.summaryCard}>
          <Text style={styles.cardTitle}>Resumen del Mes</Text>

          <View style={styles.ringContainer}>
            <View style={styles.progressCircle}>
              <Text style={styles.progressPercentage}>{spentPercentage}%</Text>
              <Text style={styles.progressLabel}>gastado</Text>
            </View>
          </View>

          <View style={styles.metricsRow}>
            <View style={styles.metricBox}>
              <Text style={styles.metricLabel}>Ganado</Text>
              <Text style={[styles.metricValue, { color: COLORS.secondary }]}>
                ${totalIncome.toLocaleString('es-CO')}
              </Text>
            </View>

            <View style={styles.metricDivider} />

            <View style={styles.metricBox}>
              <Text style={styles.metricLabel}>Gastado</Text>
              <Text style={[styles.metricValue, { color: COLORS.expense }]}>
                ${totalExpenses.toLocaleString('es-CO')}
              </Text>
            </View>

            <View style={styles.metricDivider} />

            <View style={styles.metricBox}>
              <Text style={styles.metricLabel}>Te quedó</Text>
              <Text style={[styles.metricValue, { color: COLORS.primary }]}>
                ${netBalance.toLocaleString('es-CO')}
              </Text>
            </View>
          </View>
        </View>

        {/* Fila de Categorías DINÁMICA */}
        <Text style={styles.sectionTitle}>Gastos por Categoría</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsContainer}>
          {categories.map((cat) => {
            const spent = getCategorySpent(cat.id);
            return (
              <TouchableOpacity
                key={cat.id}
                style={styles.categoryChip}
                onPress={() => router.push(`/categoria/${cat.id}` as any)}
                activeOpacity={0.7}
              >
                <Text style={styles.chipIcon}>{cat.icon || '📁'}</Text>
                <Text style={styles.chipName} numberOfLines={1}>{cat.name}</Text>
                <Text style={styles.chipSpent}>${spent.toLocaleString('es-CO')}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Formulario de Entrada Rápida CONECTADO */}
        <View style={styles.quickEntryCard}>
          <Text style={styles.cardTitle}>Agregar Movimiento</Text>

          <View style={styles.toggleContainer}>
            <TouchableOpacity
              style={[styles.toggleButton, transactionType === 'ingreso' && { backgroundColor: COLORS.secondary }]}
              onPress={() => setTransactionType('ingreso')}
            >
              <Text style={[styles.toggleText, transactionType === 'ingreso' && styles.toggleTextActive]}>
                + Ingreso
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.toggleButton, transactionType === 'gasto' && { backgroundColor: COLORS.expense }]}
              onPress={() => setTransactionType('gasto')}
            >
              <Text style={[styles.toggleText, transactionType === 'gasto' && styles.toggleTextActive]}>
                - Gasto
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.inputLabel}>Valor (COP)</Text>
          <TextInput
            style={styles.amountInput}
            placeholder="$ 0"
            keyboardType="numeric"
            placeholderTextColor={COLORS.textSecondary}
            value={amount}
            onChangeText={setAmount}
          />

          <Text style={styles.inputLabel}>Seleccionar Categoría</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.selectCatChip,
                  selectedCategoryId === cat.id && styles.selectCatChipActive
                ]}
                onPress={() => setSelectedCategoryId(cat.id)}
              >
                <Text style={[
                  styles.selectCatText,
                  selectedCategoryId === cat.id && styles.selectCatTextActive
                ]}>
                  {cat.icon} {cat.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Text style={styles.inputLabel}>Nota (Opcional)</Text>
          <TextInput
            style={styles.smallInput}
            placeholder="Ej. Tanque lleno en Terpel"
            placeholderTextColor={COLORS.textSecondary}
            value={note}
            onChangeText={setNote}
          />

          <TouchableOpacity
            style={[
              styles.saveButton,
              { backgroundColor: transactionType === 'ingreso' ? COLORS.secondary : COLORS.expense }
            ]}
            onPress={handleSave}
            activeOpacity={0.8}
          >
            <Text style={styles.saveButtonText}>Guardar Movimiento</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
  container: { flex: 1, paddingHorizontal: 20 },
  navbar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 16 },
  appName: { fontSize: 22, fontWeight: '800', color: COLORS.primary },
  subGreeting: { fontSize: 15, fontWeight: '600', color: COLORS.textPrimary },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center' },
  avatarText: { color: '#FFFFFF', fontWeight: '700', fontSize: 18 },
  summaryCard: { backgroundColor: COLORS.card, borderRadius: 24, padding: 20, marginBottom: 20 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 12 },
  ringContainer: { alignItems: 'center', marginVertical: 10 },
  progressCircle: { width: 110, height: 110, borderRadius: 55, borderWidth: 8, borderColor: COLORS.primary, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F0F8FF' },
  progressPercentage: { fontSize: 22, fontWeight: '800', color: COLORS.textPrimary },
  progressLabel: { fontSize: 12, color: COLORS.textSecondary },
  metricsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: COLORS.border },
  metricBox: { alignItems: 'center', flex: 1 },
  metricLabel: { fontSize: 12, color: COLORS.textSecondary, marginBottom: 4 },
  metricValue: { fontSize: 13, fontWeight: '700' },
  metricDivider: { width: 1, height: 24, backgroundColor: COLORS.border },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 12 },
  chipsContainer: { marginBottom: 20, flexDirection: 'row' },
  categoryChip: { backgroundColor: COLORS.card, borderRadius: 18, padding: 14, marginRight: 12, width: 120, alignItems: 'center' },
  chipIcon: { fontSize: 24, marginBottom: 6 },
  chipName: { fontSize: 13, fontWeight: '600', color: COLORS.textPrimary },
  chipSpent: { fontSize: 12, fontWeight: '700', color: COLORS.expense, marginTop: 4 },
  quickEntryCard: { backgroundColor: COLORS.card, borderRadius: 24, padding: 20, marginBottom: 30 },
  toggleContainer: { flexDirection: 'row', backgroundColor: COLORS.background, borderRadius: 14, padding: 4, marginBottom: 16 },
  toggleButton: { flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
  toggleText: { fontSize: 14, fontWeight: '700', color: COLORS.textSecondary },
  toggleTextActive: { color: '#FFFFFF' },
  inputLabel: { fontSize: 13, fontWeight: '600', color: COLORS.textPrimary, marginBottom: 6 },
  amountInput: { backgroundColor: COLORS.background, borderRadius: 14, height: 52, paddingHorizontal: 16, fontSize: 20, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 12 },
  selectCatChip: { backgroundColor: COLORS.background, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, marginRight: 8, borderWidth: 1, borderColor: COLORS.border },
  selectCatChipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  selectCatText: { fontSize: 13, color: COLORS.textPrimary, fontWeight: '600' },
  selectCatTextActive: { color: '#FFFFFF' },
  smallInput: { backgroundColor: COLORS.background, borderRadius: 12, height: 48, paddingHorizontal: 12, fontSize: 14, color: COLORS.textPrimary, marginBottom: 16 },
  saveButton: { height: 52, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  saveButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
});