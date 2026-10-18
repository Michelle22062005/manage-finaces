import { config } from "dotenv";
config({ path: ".env.local" });

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { categories } from "./schema";

const db = drizzle(neon(process.env.DATABASE_URL!));
const USER_ID = "usuario-prueba";

async function main() {
  await db.insert(categories).values([
    // --- Tus categorías originales ---
    { userId: USER_ID, name: "Carreras", scope: "taxi", monthlyBudget: 0 },
    { userId: USER_ID, name: "Gasolina", scope: "taxi", monthlyBudget: 0 },
    { userId: USER_ID, name: "Lavada", scope: "taxi", monthlyBudget: 0 },
    { userId: USER_ID, name: "Parqueadero", scope: "taxi", monthlyBudget: 0 },
    { userId: USER_ID, name: "Peajes", scope: "taxi", monthlyBudget: 0 },
    { userId: USER_ID, name: "Comida en la calle", scope: "propio", monthlyBudget: 0 },
    { userId: USER_ID, name: "Mercado", scope: "casa", monthlyBudget: 0 },

    // --- Nuevas categorías añadidas ---
    { userId: USER_ID, name: "Maquillaje y Skincare", scope: "propio", monthlyBudget: 0 },
    { userId: USER_ID, name: "Manicure y Pedicure", scope: "propio", monthlyBudget: 0 },
    { userId: USER_ID, name: "Depilación", scope: "propio", monthlyBudget: 0 },
    { userId: USER_ID, name: "Mercado de Verduras", scope: "casa", monthlyBudget: 0 },
    { userId: USER_ID, name: "Pasajes Universidad", scope: "propio", monthlyBudget: 0 },
    { userId: USER_ID, name: "Pasajes Hermana", scope: "propio", monthlyBudget: 0 },
    { userId: USER_ID, name: "Desayunos", scope: "propio", monthlyBudget: 0 },
    { userId: USER_ID, name: "Universidad y Materiales", scope: "propio", monthlyBudget: 0 },
    { userId: USER_ID, name: "Plan de Celular", scope: "propio", monthlyBudget: 0 },
    { userId: USER_ID, name: "Servicio de Energía / Luz", scope: "casa", monthlyBudget: 0 },
    { userId: USER_ID, name: "Servicio de Agua y Alcantarillado", scope: "casa", monthlyBudget: 0 },
    { userId: USER_ID, name: "Internet y Televisión", scope: "casa", monthlyBudget: 0 },
    { userId: USER_ID, name: "Gas Domiciliario", scope: "casa", monthlyBudget: 0 },
]);
  console.log("Categorías creadas");
}

main();