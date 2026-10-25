import { Router } from "express";
import { authService } from "../services/authService";
import { requireAuth } from "../middleware/requireAuth";

export const accountRouter = Router();
accountRouter.use(requireAuth);

accountRouter.post("/account/delete", async (req, res) => {
  const userId = res.locals.userId as string;
  const password: unknown = req.body?.password;

  if (typeof password !== "string" || password.length === 0) {
    return res.status(400).json({ message: "Escribe tu contraseña para confirmar." });
  }

  try {
    await authService.deleteAccount(userId, password);
    res.json({ ok: true });
  } catch (e) {
    const mensaje = e instanceof Error ? e.message : "No se pudo eliminar la cuenta.";
    // 403 y no 401: así la app no lo confunde con una sesión vencida
    res.status(403).json({ message: mensaje });
  }
});