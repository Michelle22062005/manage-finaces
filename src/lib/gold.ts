import type { GoldMovement } from "@/types/finance";

export const isCategoriaGold = (nombre: string) => /\boro\b/i.test(nombre);

const r3 = (n: number) => Math.round(n * 1000) / 1000;

export function resumenOro(movs: GoldMovement[]) {
  let entradas = 0;
  let salidas = 0;
  let vendido = 0;
  for (const m of movs) {
    if (m.kind === "entrada") entradas += m.grams;
    else {
      salidas += m.grams;
      vendido += m.amount ?? 0;
    }
  }
  return { entradas: r3(entradas), salidas: r3(salidas), saldo: r3(entradas - salidas), vendido };
}

export const formatearGramos = (g: number) =>
  `${g.toLocaleString("es-CO", { maximumFractionDigits: 3 })} g`;