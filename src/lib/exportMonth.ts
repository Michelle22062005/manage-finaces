import { File, Paths } from "expo-file-system";
import * as Sharing from "expo-sharing";
import type { Category, Transaction } from "@/types/finance";

// En Colombia, Excel usa ";" como separador (la coma es el decimal).
// Si al abrirlo todo queda en una sola columna, cámbialo por ",".
const SEP = ";";

const MESES = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

/** Mes actual en Colombia, formato "AAAA-MM" */
export const currentMonth = () =>
  new Date()
    .toLocaleDateString("en-CA", { timeZone: "America/Bogota" })
    .slice(0, 7);

/** Suma o resta meses a un "AAAA-MM" */
export const moveMonth = (mes: string, delta: number) => {
  const [y, m] = mes.split("-").map(Number);
  const f = new Date(Date.UTC(y, m - 1 + delta, 1));
  return f.toISOString().slice(0, 7);
};

/** "2026-10" -> "Octubre 2026" */
export const nameMonth = (mes: string) => {
  const [y, m] = mes.split("-").map(Number);
  const n = MESES[m - 1];
  return `${n.charAt(0).toUpperCase()}${n.slice(1)} ${y}`;
};

/** Escapa un campo para CSV y evita que Excel lo interprete como fórmula */
const field = (valor: string | number | null | undefined) => {
  let s = String(valor ?? "");
  if (/^[=+\-@]/.test(s) && typeof valor === "string") s = `'${s}`;
  return /[;"\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

export function totalForTheMonth(movs: Transaction[]) {
  let income = 0;
  let expenses = 0;
  for (const t of movs) {
    if (t.kind === "ingreso") income += t.amount;
    else expenses += t.amount;
  }
  return { income, expenses, neto: income - expenses };
}

export function buildCsv(movs: Transaction[], categories: Category[]) {
  const nameCat = new Map(categories.map((c) => [c.id, c.name]));

  const ordered = [...movs].sort((a, b) => a.date.localeCompare(b.date));

  const filas = ordered.map((t) =>
    [
      field(t.date),
      field(t.kind === "ingreso" ? "Ingreso" : "Gasto"),
      field(t.categoryId == null ? "General" : (nameCat.get(t.categoryId) ?? "General")),
      field(t.note),
      field(t.amount),
    ].join(SEP),
  );

  const { income, expenses, neto } = totalForTheMonth(movs);

  const lineas = [
    ["Fecha", "Tipo", "Categoría", "Nota", "Monto (COP)"].join(SEP),
    ...filas,
    "",
    ["", "", "", "Total ingresos", income].join(SEP),
    ["", "", "", "Total gastos", expenses].join(SEP),
    ["", "", "", "Te quedó", neto].join(SEP),
  ];

  // \uFEFF hace que Excel lea bien las tildes y la ñ
  return "\uFEFF" + lineas.join("\r\n");
}

export async function shareCsv(
  movs: Transaction[],
  categories: Category[],
  mes: string,
) {
  if (!(await Sharing.isAvailableAsync())) {
    throw new Error("Este dispositivo no permite compartir archivos.");
  }

  const file = new File(Paths.cache, `mis-cuentas-${mes}.csv`);
  if (file.exists) file.delete(); // por si ya lo habías exportado antes
  file.create();
  file.write(buildCsv(movs, categories));

  await Sharing.shareAsync(file.uri, {
    mimeType: "text/csv",
    dialogTitle: `Movimientos de ${nameMonth(mes)}`,
    UTI: "public.comma-separated-values-text",
  });
}