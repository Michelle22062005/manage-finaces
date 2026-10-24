import { create } from "zustand";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import type { Category, GoldKind, GoldMovement, Kind, Transaction} from "../types/finance"; // 


interface FinanceState {
  categories: Category[];
  transactions: Transaction[];
  selectedFilter: "todos" | Kind;
  isLoading: boolean;
  loadError: string | null;
  goldMovements: GoldMovement[];
addGold: (m: {
  kind: GoldKind;
  grams: number;
  date: string;
  amount: number | null;
  note: string | null;
}) => Promise<string | null>;



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
  isLoading: true,
  loadError: null,
  goldMovements: [],


  // El parámetro se ignora: el usuario sale del token, no de la app
  loadInitialData: async () => {
    set({ isLoading: true, loadError: null });
    try {
      const [categories, transactions, goldMovements] = await Promise.all([
        api<Category[]>("/api/categories", {}, token()),
        api<Transaction[]>("/api/transactions", {}, token()),
        api<GoldMovement[]>("/api/gold", {}, token()).catch(() => [] as GoldMovement[]),
      ]);
      set((state) => {
        const loadedIds = new Set(transactions.map((transaction) => transaction.id));
        const transactionsAddedDuringLoad = state.transactions.filter(
          (transaction) => !loadedIds.has(transaction.id),
        );
       
        return {
          categories,
          transactions: [...transactionsAddedDuringLoad, ...transactions],
          goldMovements 
        };
      });
    } catch {
      set({ loadError: "No pudimos cargar tus datos." });
    } finally {
      set({ isLoading: false });
    }
  },

  setFilter: (selectedFilter) => set({ selectedFilter }),

// nueva acción:
addGold: async (m) => {
  try {
    await api("/api/gold", { method: "POST", body: JSON.stringify(m) }, token());
    await get().loadInitialData(); // recarga: la venta también creó un ingreso de dinero
    return null;
  } catch (e) {
    return e instanceof Error ? e.message : "Error inesperado.";
  }
},
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
    set({
      categories: [],
      transactions: [],
      goldMovements: [],
      selectedFilter: "todos",
      loadError: null,
    }),

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