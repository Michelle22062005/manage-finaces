import { Router } from "express";
import { authService } from "../services/authService";
import { signToken } from "../lib/jwt";

export const authRouter = Router();

authRouter.post("/register", async (req, res) => {
  try {
    const { email, password, fullName } = req.body;
    if (!email || !password || !fullName) return res.status(400).json({ message: "Faltan datos." });
    const user = await authService.register(email, password, fullName);
    res.status(201).json({ token: await signToken(user.id), user });
  } catch (e) {
    res.status(400).json({ message: (e as Error).message });
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const user = await authService.login(req.body.email ?? "", req.body.password ?? "");
    res.json({ token: await signToken(user.id), user });
  } catch (e) {
    res.status(401).json({ message: (e as Error).message });
  }
});