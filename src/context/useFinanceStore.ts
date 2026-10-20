import { create } from "zustand";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { Category, Kind, Transaction } from "../types/finance";

interface FinanceState {
  categories: Category[];
  transactions: Transaction[];
  selectedFilter: "todos" | Kind;
  isLoading: boolean;

  // Acciones de sincronización
  loadInitialData: (_userId?: string) => Promise<void>;
  addTransaction: (transaction: Omit<Transaction, "id">) => Promise<boolean>;
  setFilter: (filter: "todos" | Kind) => void;
  reset: () => void;

  // Selectores y cálculos
  getTotalIncome: () => number;
  getTotalExpenses: () => number;
  getNetBalance: () => number;
  getSpentPercentage: () => number;
  getCategorySpent: (categoryId: number) => number;
}

const token = () => useAuth.getState().token;

export const useFinanceStore = create<FinanceState>((set, get) => ({
  categories: [],
  transactions: [],
  selectedFilter: "todos",
  isLoading: false,

  // El parámetro se ignora: el usuario sale del token, no de la app
  loadInitialData: async () => {
    set({ isLoading: true });
    try {
      const [categories, transactions] = await Promise.all([
        api<Category[]>("/api/categories", {}, token()),
        api<Transaction[]>("/api/transactions", {}, token()),
      ]);
      set({ categories, transactions });
    } catch (error) {
      console.error("Error al cargar datos:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  setFilter: (selectedFilter) => set({ selectedFilter }),

  addTransaction: async (newTx) => {
    try {
      const saved = await api<Transaction>(
        "/api/transactions",
        {
          method: "POST",
          body: JSON.stringify({
            kind: newTx.kind,
            amount: newTx.amount,
            date: newTx.date,
            categoryId: newTx.categoryId ?? null,
            note: newTx.note ?? null,
          }),
        },
        token(),
      );
      set((state) => ({ transactions: [saved, ...state.transactions] }));
      return true;
    } catch (error) {
      console.error("No se pudo guardar el movimiento:", error);
      return false;
    }
  },

  // Al cerrar sesión, limpiar los datos de la usuaria anterior
  reset: () =>
    set({ categories: [], transactions: [], selectedFilter: "todos" }),

  getTotalIncome: () =>
    get()
      .transactions.filter((t) => t.kind === "ingreso")
      .reduce((sum, t) => sum + t.amount, 0),

  getTotalExpenses: () =>
    get()
      .transactions.filter((t) => t.kind === "gasto")
      .reduce((sum, t) => sum + t.amount, 0),

  getNetBalance: () => get().getTotalIncome() - get().getTotalExpenses(),

  getSpentPercentage: () => {
    const income = get().getTotalIncome();
    const expenses = get().getTotalExpenses();
    if (income === 0) return 0;
    return Math.min(Math.round((expenses / income) * 100), 100);
  },

  getCategorySpent: (categoryId: number) =>
    get()
      .transactions.filter((t) => t.categoryId === categoryId && t.kind === "gasto")
      .reduce((sum, t) => sum + t.amount, 0),
}));