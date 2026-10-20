import { and, eq, sql } from "drizzle-orm";
import { Category, Transaction } from "../../../src/types/finance";
import { db } from "../db";
import { categories, transactions } from "../db/schema";

const DATABASE_URL = process.env.EXPO_PUBLIC_DATABASE_URL;
// 1. Obtener todas las categorías de un usuario
export async function getCategoriesByUser(userId: string) {
  return await db
    .select()
    .from(categories)
    .where(eq(categories.userId, userId));
}

// 2. Obtener resumen de Ingresos, Gastos y Saldo Neto del mes actual
export async function getMonthlySummary(userId: string, yearMonth: string) {
  // yearMonth ej: '2026-10'
  const movements = await db
    .select({
      kind: transactions.kind,
      amount: transactions.amount,
    })
    .from(transactions)
    .where(
      and(
        eq(transactions.userId, userId),
        sql`TO_CHAR(${transactions.date}, 'YYYY-MM') = ${yearMonth}`,
      ),
    );

  const totalIncome = movements
    .filter((m) => m.kind === "ingreso")
    .reduce((acc, m) => acc + m.amount, 0);

  const totalExpense = movements
    .filter((m) => m.kind === "gasto")
    .reduce((acc, m) => acc + m.amount, 0);

  const netBalance = totalIncome - totalExpense;
  const spentPercentage =
    totalIncome > 0 ? Math.round((totalExpense / totalIncome) * 100) : 0;

  return {
    totalIncome,
    totalExpense,
    netBalance,
    spentPercentage,
  };
}

// 3. Crear una nueva transacción desde la app
export async function createTransaction(data: {
  userId: string;
  kind: "ingreso" | "gasto";
  amount: number;
  date: string; // "YYYY-MM-DD"
  categoryId?: number;
  note?: string;
}) {
  return await db.insert(transactions).values(data).returning();
}

export const dbService = {
  async fetchCategories(userId: string): Promise<Category[]> {
    try {
      // Petición al backend / API route o cliente servidor
      const response = await fetch(
        `${DATABASE_URL}/categories?userId=${userId}`,
      );
      if (!response.ok) throw new Error(`Error al obtener categorias`);
      return await response.json();
    } catch (error) {
      console.error("Error fetching categories:", error);
      return [];
    }
  },

  // Obtener transacciones del usuario
  async fetchTransactions(userId: string): Promise<Transaction[]> {
    try {
      const response = await fetch(
        `${DATABASE_URL}/transactions?userId=${userId}`,
      );
      if (!response.ok) throw new Error(`Error al obtener transacciones`);
      return await response.json();
    } catch (error) {
      console.error("Error fetching transactions:", error);
      return [];
    }
  },
  // Guardar un nuevo movimiento en Neon
  async saveTransaction(
    newTx: Omit<Transaction, "id">,
  ): Promise<Transaction | null> {
    try {
      const response = await fetch(`${DATABASE_URL}/transections`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTx),
      });
      if (!response.ok) throw new Error(`Error al guardar transacción`);
      return await response.json();
    } catch (error) {
      console.error("Error saving transaction:", error);
      return null;
    }
  },
};
