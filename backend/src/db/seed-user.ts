import "dotenv/config";
import { and, eq } from "drizzle-orm";
import { db } from "./index";
import { users, categories } from "./schema";
import { DEFAULT_CATEGORIES } from "./defaultCategories";

async function main() {
  const email = process.argv[2]?.trim().toLowerCase();
  if (!email) throw new Error("Uso: npx tsx src/db/seed-user.ts tucorreo@mail.com");

  const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
  if (!user) throw new Error(`No existe un usuario con el correo ${email}`);

  const existentes = await db.select().from(categories).where(eq(categories.userId, user.id));

  for (const c of DEFAULT_CATEGORIES) {
    const ya = existentes.find((e) => e.name === c.name);
    if (ya) {
      await db
        .update(categories)
        .set({ icon: c.icon })
        .where(and(eq(categories.id, ya.id), eq(categories.userId, user.id)));
    } else {
      await db.insert(categories).values({
        userId: user.id,
        name: c.name,
        scope: c.scope,
        icon: c.icon,
        monthlyBudget: 0,
      });
    }
  }
  console.log("Categorías listas para", email);
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });