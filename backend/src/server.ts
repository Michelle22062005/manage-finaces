import "dotenv/config";
import express from "express";
import { authRouter } from "./routes/auth";
import { financeRouter } from "./routes/finance";
import { goldRouter } from "./routes/gold";
import { accountRouter } from "./routes/account";
const app = express();
app.use(express.json());

app.get("/", (_req, res) => res.json({ ok: true }));
app.use("/api/auth", authRouter);
app.use("/api", financeRouter);
app.use("/api", goldRouter);
app.use("/api", accountRouter);

const port = Number(process.env.PORT ?? 3000);
app.listen(port, "0.0.0.0", () => console.log(`API en http://localhost:${port}`));