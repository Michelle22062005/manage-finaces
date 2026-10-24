import { useMemo, useEffect } from 'react';
import { Tabs } from 'expo-router';
import { Text } from 'react-native';
import { useFinanceStore } from '@/context/useFinanceStore';
import { isCategoriaGold } from "@/lib/gold";
import { CategoryIcon } from '@/components/common/CategoryIcon';


export default function MainLayout() {
  const loadInitialData = useFinanceStore((state) => state.loadInitialData);
  const categories = useFinanceStore((s) => s.categories);
  const transactions = useFinanceStore((s) => s.transactions);
  const goldMovements = useFinanceStore((s) => s.goldMovements);

  const itHasGold = useMemo(() => {
  if (goldMovements.length > 0) return true;
  const idsGold = new Set(categories.filter((c) => isCategoriaGold(c.name)).map((c) => c.id));
  return transactions.some(
    (t) => t.kind === "ingreso" && t.categoryId != null && idsGold.has(t.categoryId),
  );
}, [categories, transactions, goldMovements]);

  useEffect(() => {
    // Cargar datos del usuario desde Neon al abrir la app
    loadInitialData();
  }, [loadInitialData]);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#4EA8DE',
        tabBarInactiveTintColor: '#8D99AE',
        tabBarStyle: {
          height: 64,
          paddingBottom: 10,
          paddingTop: 8,
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E2E8F0',
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 18, color }}>🏠</Text>,
        }}
      />
      <Tabs.Screen
        name="historial"
        options={{
          title: 'Historial',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 18, color }}>📋</Text>,
        }}
      />
        <Tabs.Screen
    name="gold"
    options={{
      title: "Oro",
      href: itHasGold ? undefined : null, // null = pestaña oculta
      tabBarIcon: ({ color }) => <CategoryIcon name="gold" size={20} color={color} />,
    }}
  />
      <Tabs.Screen
        name="perfil"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 18, color }}>👤</Text>,
        }}
      />
    </Tabs>
  );
}