import { pgTable, serial, text, integer, date, pgEnum, timestamp } from "drizzle-orm/pg-core";

export const kindEnum = pgEnum("kind", ["ingreso", "gasto"]);
export const scopeEnum = pgEnum("scope", ["casa", "propio", "taxi"]);

// Nueva tabla de Usuarios para producción y multi-cuenta
export const users = pgTable("users", {
  id: text("id").primaryKey(), // ID único entregado por el proveedor de Auth (ej. Supabase / Clerk / Firebase)
  passwordHash: text("password_hash").notNull(),
  email: text("email").notNull().unique(),
  fullName: text("full_name"),
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }), // Relación con el usuario
  name: text("name").notNull(),
  scope: scopeEnum("scope").notNull(),
  monthlyBudget: integer("monthly_budget").default(0),
});

export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }), // Relación con el usuario
  kind: kindEnum("kind").notNull(),
  amount: integer("amount").notNull(),
  date: date("date").notNull(),
  categoryId: integer("category_id").references(() => categories.id),
  note: text("note"),
  createdAt: timestamp("created_at").defaultNow(),
});