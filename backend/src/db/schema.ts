import { pgTable, serial, text, integer, date, pgEnum, timestamp } from "drizzle-orm/pg-core";

export const kindEnum = pgEnum("kind", ["ingreso", "gasto"]);
export const scopeEnum = pgEnum("scope", ["casa", "propio", "taxi", "deuda","oro"]);
export const goldKindEnum = pgEnum("gold_kind", ["entrada", "salida"]);


export const users = pgTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  fullName: text("full_name").notNull(),
  termsAcceptedAt: timestamp("terms_accepted_at"),
  termsVersion: text("terms_version"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  scope: scopeEnum("scope").notNull(),
  monthlyBudget: integer("monthly_budget").default(0),
  icon: text("icon"),
});

export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  kind: kindEnum("kind").notNull(),
  amount: integer("amount").notNull(),
  date: date("date").notNull(),
  categoryId: integer("category_id").references(() => categories.id),
  note: text("note"),
  createdAt: timestamp("created_at").defaultNow(),
});
export const goldMovements = pgTable("gold_movements", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  kind: goldKindEnum("kind").notNull(),
  milligrams: integer("milligrams").notNull(),
  amount: integer("amount"), // pesos recibidos en la venta (solo salidas)
  date: date("date").notNull(),
  note: text("note"),
  createdAt: timestamp("created_at").defaultNow(),
});