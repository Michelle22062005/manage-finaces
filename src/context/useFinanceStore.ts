import { create } from 'zustand';
import { Category, Transaction, Kind } from '../types/finance';
import { dbService } from '../services/db';

interface FinanceState {
  categories: Category[];
  transactions: Transaction[];
  selectedFilter: 'todos' | Kind;
  isLoading: boolean;

  // Acciones de Sincronización
  loadInitialData: (userId: string) => Promise<void>;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => Promise<boolean>;
  setFilter: (filter: 'todos' | Kind) => void;

  // Selectores y Cálculos
  getTotalIncome: () => number;
  getTotalExpenses: () => number;
  getNetBalance: () => number;
  getSpentPercentage: () => number;
  getCategorySpent: (categoryId: number) => number;
}

export const useFinanceStore = create<FinanceState>((set, get) => ({
  categories: [],
  transactions: [],
  selectedFilter: 'todos',
  isLoading: false,

  // Cargar datos iniciales desde Neon al abrir la app
  loadInitialData: async (userId: string) => {
    set({ isLoading: true });
    try {
      const [remoteCategories, remoteTransactions] = await Promise.all([
        dbService.fetchCategories(userId),
        dbService.fetchTransactions(userId),
      ]);

      set({
        categories: remoteCategories,
        transactions: remoteTransactions,
        isLoading: false,
      });
    } catch (error) {
      console.error('Error al sincronizar datos iniciales:', error);
      set({ isLoading: false });
    }
  },

  setFilter: (selectedFilter) => set({ selectedFilter }),

  // Agregar movimiento en Neon + Zustand
  addTransaction: async (newTxData) => {
    // 1. Guardar en Neon vía Drizzle/API
    const savedTx = await dbService.saveTransaction(newTxData);

    if (savedTx) {
      // 2. Actualizar estado local si la BD respondió con éxito
      set((state) => ({
        transactions: [savedTx, ...state.transactions],
      }));
      return true;
    } else {
      // Fallback local en caso de estar offline
      const fallbackTx: Transaction = {
        ...newTxData,
        id: Date.now(),
      };
      set((state) => ({
        transactions: [fallbackTx, ...state.transactions],
      }));
      return false;
    }
  },

  getTotalIncome: () => {
    return get()
      .transactions.filter((t) => t.kind === 'ingreso')
      .reduce((sum, t) => sum + t.amount, 0);
  },

  getTotalExpenses: () => {
    return get()
      .transactions.filter((t) => t.kind === 'gasto')
      .reduce((sum, t) => sum + t.amount, 0);
  },

  getNetBalance: () => {
    return get().getTotalIncome() - get().getTotalExpenses();
  },

  getSpentPercentage: () => {
    const income = get().getTotalIncome();
    const expenses = get().getTotalExpenses();
    if (income === 0) return 0;
    return Math.min(Math.round((expenses / income) * 100), 100);
  },

  getCategorySpent: (categoryId: number) => {
    return get()
      .transactions.filter((t) => t.categoryId === categoryId && t.kind === 'gasto')
      .reduce((sum, t) => sum + t.amount, 0);
  },
}));