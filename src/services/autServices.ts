import bcrypt from 'bcryptjs';
import { db } from '../db'; // Tu conexión de Drizzle
import { randomUUID } from "crypto";

import { users, categories } from '../db/schema';
import { eq } from 'drizzle-orm';

// Hash falso para que el login tarde lo mismo exista o no el correo
const DUMMY_HASH = bcrypt.hashSync("contrasena-falsa", 10);

const normalizarEmail = (email: string) => email.trim().toLowerCase();

export const authService = {
  // REGISTRO DE USUARIA
  async register(email: string, passwordPlain: string, fullName: string) {
    const emailNorm = normalizarEmail(email);

    if(passwordPlain.length < 8 || passwordPlain.length > 30) {
        throw new Error('La contraseña debe tener entre 8 y 30 caracteres.');
    }
    // 1. Verificar si el usuario ya existe
   const [existing] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, emailNorm))
      .limit(1);
    if (existing) throw new Error("El correo ya está registrado.");

    // 2. Encriptar contraseña (salt rounds = 10)
    const passwordHash = await bcrypt.hash(passwordPlain, 10);
    const id = randomUUID(); // Generar un ID único para el usuario

    // 3. Guardar usuario en la base de datos de Neon
    try {
      await db.insert(users).values({
        id,
        email: emailNorm,
        passwordHash,
        fullName: fullName.trim(),
      });
    } catch {
      // Si dos registros llegan a la vez, la restricción unique lo atrapa aquí
      throw new Error("El correo ya está registrado.");
    }
    // Nota: Aquí también puedes insertar las categorías por defecto para este nuevo userId
    // Categorías por defecto para la nueva usuaria
    await db.insert(categories).values([
      { userId: id, name: "Carreras", scope: "taxi", monthlyBudget: 0 },
      { userId: id, name: "Gasolina", scope: "taxi", monthlyBudget: 0 },
      { userId: id, name: "Comida en la calle", scope: "propio", monthlyBudget: 0 },
      { userId: id, name: "Mercado", scope: "casa", monthlyBudget: 0 },
    ]);
    return { id, email: emailNorm, fullName: fullName.trim() };
  },

  // LOGIN DE USUARIA
  async login(email: string, passwordPlain: string) {
    // 1. Buscar usuario por correo
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, normalizarEmail(email)))
      .limit(1);

      // Siempre se ejecuta una comparación, exista o no el usuario
    const valida = await bcrypt.compare(passwordPlain, user?.passwordHash ?? DUMMY_HASH);

    if (!user || !valida) {
      throw new Error('Correo o contraseña incorrectos.');
    }

    return { id: user.id, email: user.email, fullName: user.fullName };
  }
};