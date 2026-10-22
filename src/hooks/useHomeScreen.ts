import { useAuth } from "@/lib/auth";
import { useState } from "react";
import { useFinanceStore } from "@/context/useFinanceStore";



export function useHomeSreen(){
    const {
        categories,
        transactions,
        isLoading,
        loadError,
        loadInitialData,
        getTotalIncome,
        getTotalExpenses,
        getNetBalance,
        getSpentPercentage,
        addTransaction,
      } = useFinanceStore();
      const user = useAuth((s) => s.user);
    
      const [transactionType, setTransactionType] = useState<"ingreso" | "gasto">(
        "gasto",
      );
      const [note, setNote] = useState("");
      const [amount, setAmount] = useState("");
      const [pickedCategoryId, setPickedCategoryId] = useState<number | null>(null);
      const [guardando, setGuardando] = useState(false);
    
      // Si no ha elegido ninguna, usa la primera que haya llegado de la API
      const selectedCategoryId = pickedCategoryId ?? categories[0]?.id ?? null;
    
      const nombre = user?.fullName ?? "Usuario";
      const inicial = nombre.charAt(0).toUpperCase();
    
      

      return {categories,
        transactions,
        isLoading,
        loadError,
        loadInitialData,
        getTotalIncome,
        getTotalExpenses,
        getNetBalance,
        getSpentPercentage,
        addTransaction, transactionType, setTransactionType, note, setNote, amount, setAmount, pickedCategoryId, setPickedCategoryId, guardando, setGuardando, selectedCategoryId, nombre, inicial, }
}