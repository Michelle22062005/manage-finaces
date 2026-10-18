import { pgTable, serial, text, integer, date, pgEnum, timestamp } from "drizzle-orm/pg-core";

export const kindEnum = pgEnum("kind", ["ingreso", "gasto"]);
export const scopeEnum = pgEnum("scope", ["casa", "propio", "taxi"]);

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  name: text("name").notNull(),
  scope: scopeEnum("scope").notNull(),
  monthlyBudget: integer("monthly_budget").default(0),
});

export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  kind: kindEnum("kind").notNull(),
  amount: integer("amount").notNull(),
  date: date("date").notNull(),
  categoryId: integer("category_id").references(() => categories.id),
  note: text("note"),
  createdAt: timestamp("created_at").defaultNow(),
});