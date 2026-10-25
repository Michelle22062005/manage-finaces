import { useFinanceStore } from "@/context/useFinanceStore";
import { useAuth } from "@/lib/auth";
import { currentMonth, nameMonth, saveCsv, shareCsv } from "@/lib/exportMonth";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { Alert } from "react-native";
import { DeleteAccountModal } from "@/features/profile/components/DeleteAccountModal";

export function useProfile() {
  const router = useRouter();
  const user = useAuth((s) => s.user);
  const logout = useAuth((s) => s.logout);
  const transactions = useFinanceStore((s) => s.transactions);
  const categories = useFinanceStore((s) => s.categories);
  const [month, setMonth] = useState(currentMonth());
  const [exportando, setExportando] = useState(false);

  const nombre = user?.fullName ?? "Usuario";
  const inicial = nombre.charAt(0).toUpperCase();
  const esMesActual = month >= currentMonth();

  const ofTheMonth = useMemo(
    () => transactions.filter((t) => t.date.startsWith(month)),
    [transactions, month],
  );
  const deleteAccount = useAuth((s) => s.deleteAccount);
const [mostrarEliminar, setMostrarEliminar] = useState(false);

const handleDeleteAccount = async (password: string) => {
  await deleteAccount(password);
  useFinanceStore.getState().reset();
};

  const handleLogout = () => {
    Alert.alert(
      "Cerrar sesión",
      "¿Estás segura de que deseas salir de Mi Cuenta?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sí, salir",
          style: "destructive",
          onPress: async () => {
            await logout();
            useFinanceStore.getState().reset();
            router.replace("/(auth)/login");
          },
        },
      ],
    );
  };

  const exportar = async (modo: "guardar" | "compartir") => {
    if (exportando) return;

    if (ofTheMonth.length === 0) {
      return Alert.alert(
        "Sin movimientos",
        `No hay movimientos en ${nameMonth(month)}.`,
      );
    }

    try {
      setExportando(true);
      if (modo === "compartir") {
        await shareCsv(ofTheMonth, categories, month);
      } else {
        const resultado = await saveCsv(ofTheMonth, categories, month);
        if (resultado === "guardado") {
          Alert.alert(
            "Listo",
            "El archivo se guardó en la carpeta que elegiste.",
          );
        }
      }
    } catch (e) {
      Alert.alert(
        "No se pudo exportar",
        e instanceof Error ? e.message : "Error inesperado.",
      );
    } finally {
      setExportando(false);
    }
  };

  return {
    router,
    user,
    logout,
    transactions,
    categories,
    month,
    setMonth,
    exportando,
    setExportando,
    nombre,
    inicial,
    esMesActual,
    ofTheMonth,
    handleLogout,
    exportar,
    deleteAccount ,mostrarEliminar, setMostrarEliminar,handleDeleteAccount ,
  };
}
