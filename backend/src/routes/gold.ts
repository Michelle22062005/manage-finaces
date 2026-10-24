import { Router } from "express";
import { desc, eq } from "drizzle-orm";
import { db } from "../db/index";
import { categories, goldMovements, transactions } from "../db/schema";
import { requireAuth } from "../middleware/requireAuth";

export const goldRouter = Router();
goldRouter.use(requireAuth);

const esOro = (nombre: string) => /\boro\b/i.test(nombre);

type GoldBody = {
  kind?: unknown;
  grams?: unknown;
  date?: unknown;
  amount?: unknown;
  note?: unknown;
};

goldRouter.get("/gold", async (_req, res) => {
  const userId = res.locals.userId as string;
  const rows = await db
    .select()
    .from(goldMovements)
    .where(eq(goldMovements.userId, userId))
    .orderBy(desc(goldMovements.date), desc(goldMovements.id));

  res.json(
    rows.map((r) => ({
      id: r.id,
      kind: r.kind,
      grams: r.milligrams / 1000,
      amount: r.amount,
      date: r.date,
      note: r.note,
    })),
  );
});

goldRouter.post("/gold", async (req, res) => {
  const userId = res.locals.userId as string;
  const b: GoldBody = req.body ?? {};

  if (b.kind !== "entrada" && b.kind !== "salida") {
    return res.status(400).json({ message: "Tipo inválido." });
  }
  const kind = b.kind;

  if (typeof b.grams !== "number" || !Number.isFinite(b.grams) || b.grams <= 0) {
    return res.status(400).json({ message: "Los gramos deben ser mayores a 0." });
  }
  const grams = b.grams;
  const milligrams = Math.round(grams * 1000);
  if (milligrams < 1) return res.status(400).json({ message: "Cantidad demasiado pequeña." });

  if (typeof b.date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(b.date)) {
    return res.status(400).json({ message: "Fecha inválida." });
  }
  const date = b.date;

  const amount =
    kind === "salida" && typeof b.amount === "number" && Number.isFinite(b.amount) && b.amount > 0
      ? Math.round(b.amount)
      : null;
  const note = typeof b.note === "string" && b.note.trim() ? b.note.trim() : null;

  // No se puede sacar más de lo que hay
  if (kind === "salida") {
    const todos = await db
      .select({ kind: goldMovements.kind, mg: goldMovements.milligrams })
      .from(goldMovements)
      .where(eq(goldMovements.userId, userId));
    const saldo = todos.reduce((s, m) => (m.kind === "entrada" ? s + m.mg : s - m.mg), 0);
    if (milligrams > saldo) {
      return res.status(400).json({ message: "No tienes suficientes gramos de oro." });
    }
  }

  // Si fue una venta con dinero, se registra también como ingreso en la categoría de oro
  let transactionId: number | null = null;
  if (kind === "salida" && amount) {
    const cats = await db.select().from(categories).where(eq(categories.userId, userId));
    const oro = cats.find((c) => esOro(c.name));
    const [tx] = await db
      .insert(transactions)
      .values({
        userId,
        kind: "ingreso",
        amount,
        date,
        categoryId: oro?.id ?? null,
        note: `Venta de ${grams} g de oro`,
      })
      .returning({ id: transactions.id });
    transactionId = tx.id;
  }

  try {
    const [row] = await db
      .insert(goldMovements)
      .values({ userId, kind, milligrams, amount, date, note })
      .returning();

    res.status(201).json({
      id: row.id,
      kind: row.kind,
      grams: row.milligrams / 1000,
      amount: row.amount,
      date: row.date,
      note: row.note,
    });
  } catch (e) {
    // Si falló, deshacer el ingreso de dinero para no dejar datos a medias
    if (transactionId !== null) {
      await db.delete(transactions).where(eq(transactions.id, transactionId));
    }
    console.error("Error al guardar oro:", e);
    res.status(500).json({ message: "No se pudo guardar el movimiento de oro." });
  }
});