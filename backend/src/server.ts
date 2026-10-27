import "dotenv/config";
import express from "express";
import { authRouter } from "./routes/auth";
import { financeRouter } from "./routes/finance";
import { goldRouter } from "./routes/gold";
import { accountRouter } from "./routes/account";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

const app = express();

app.set("trust proxy", 1);                  // Render pone un proxy delante: así se ve la IP real
app.use(helmet());
app.use(express.json({ limit: "20kb" }));  

// Límite de intentos para login, registro y eliminar cuenta
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: {message: "Demasiados intentos, Intentalo de nuevo en unos minutos"}
})

app.get("/", (_req, res) => res.json({ ok: true }));
app.use("/api/auth",authLimiter, authRouter);
app.use("/api/account/delete", authLimiter);
app.use("/api", accountRouter);
app.use("/api", financeRouter);
app.use("/api", goldRouter);

const port = Number(process.env.PORT ?? 3000);
app.listen(port, "0.0.0.0", () => console.log(`API en http://localhost:${port}`));