import { Router } from "express";
import { and, desc, eq, gte, lte } from "drizzle-orm";
import { db } from "../db/index";
import { categories, transactions } from "../db/schema";
import { requireAuth } from "../middleware/requireAuth";

export const financeRouter = Router();
financeRouter.use(requireAuth);

financeRouter.get("/categories", async (_req, res) => {
  const rows = await db.select().from(categories).where(eq(categories.userId, res.locals.userId));
  res.json(rows);
});

financeRouter.get("/transactions", async (req, res) => {
  const userId = res.locals.userId as string;
  const { from, to } = req.query as { from?: string; to?: string };
  const conds = [eq(transactions.userId, userId)];
  if (from) conds.push(gte(transactions.date, from));
  if (to) conds.push(lte(transactions.date, to));

  const rows = await db
    .select({
      id: transactions.id,
      kind: transactions.kind,
      amount: transactions.amount,
      date: transactions.date,
      note: transactions.note,
      categoryId: transactions.categoryId,
      category: categories.name,
    })
    .from(transactions)
    .leftJoin(categories, eq(transactions.categoryId, categories.id))
    .where(and(...conds))
    .orderBy(desc(transactions.date), desc(transactions.id));

  res.json(rows);
});

financeRouter.post("/transactions", async (req, res) => {
  const userId = res.locals.userId as string;
  const { kind, amount, date, categoryId, note } = req.body;

  if (kind !== "ingreso" && kind !== "gasto") return res.status(400).json({ message: "Tipo inválido." });
  if (!Number.isFinite(amount) || amount <= 0) return res.status(400).json({ message: "Monto inválido." });
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date ?? "")) return res.status(400).json({ message: "Fecha inválida." });

  if (categoryId) {
    const [cat] = await db
      .select({ id: categories.id })
      .from(categories)
      .where(and(eq(categories.id, categoryId), eq(categories.userId, userId)));
    if (!cat) return res.status(400).json({ message: "Categoría inválida." });
  }

  const [row] = await db
    .insert(transactions)
    .values({ userId, kind, amount: Math.round(amount), date, categoryId: categoryId ?? null, note: note?.trim() || null })
    .returning();

  res.status(201).json(row);
});