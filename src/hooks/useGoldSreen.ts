import React, { useMemo, useState } from "react";
import { useFinanceStore } from "@/context/useFinanceStore";
import {
  Alert,
} from "react-native";
import type { GoldKind, GoldMovement } from "@/types/finance";
import { formatearGramos, resumenOro } from "@/lib/gold";

const hoyColombia = () =>
  new Date().toLocaleDateString("en-CA", { timeZone: "America/Bogota" });

export function useGoldSreen(){
    const goldMovements = useFinanceStore((s) => s.goldMovements);
      const addGold = useFinanceStore((s) => s.addGold);
    
      const [tipo, setTipo] = useState<GoldKind>("entrada");
      const [gramosTxt, setGramosTxt] = useState("");
      const [valorTxt, setValorTxt] = useState("");
      const [nota, setNota] = useState("");
      const [guardando, setGuardando] = useState(false);
    
      const resumen = useMemo(() => resumenOro(goldMovements), [goldMovements]);
    
      // Agrupar por día (el backend ya los manda del más reciente al más antiguo)
      const dias = useMemo(() => {
        const grupos = new Map<string, GoldMovement[]>();
        for (const m of goldMovements) {
          const lista = grupos.get(m.date) ?? [];
          lista.push(m);
          grupos.set(m.date, lista);
        }
        return [...grupos.entries()]
          .sort((a, b) => b[0].localeCompare(a[0]))
          .map(([fecha, movs]) => ({
            fecha,
            movs,
            neto:
              Math.round(
                movs.reduce(
                  (s, m) => s + (m.kind === "entrada" ? m.grams : -m.grams),
                  0,
                ) * 1000,
              ) / 1000,
          }));
      }, [goldMovements]);
    
      const handleSave = async () => {
        if (guardando) return;
    
        const g = Number(gramosTxt.replace(",", "."));
        if (!Number.isFinite(g) || g <= 0) {
          return Alert.alert("Error", "Ingresa los gramos (ejemplo: 12,5).");
        }
        if (Math.round(g * 1000) / 1000 !== g) {
          return Alert.alert("Error", "Usa máximo 3 decimales.");
        }
        if (
          tipo === "salida" &&
          Math.round(g * 1000) > Math.round(resumen.saldo * 1000)
        ) {
          return Alert.alert(
            "No alcanza",
            `Solo tienes ${formatearGramos(resumen.saldo)}.`,
          );
        }
    
        const valor = parseInt(valorTxt.replace(/\D/g, ""), 10);
    
        setGuardando(true);
        const error = await addGold({
          kind: tipo,
          grams: g,
          date: hoyColombia(),
          amount:
            tipo === "salida" && !Number.isNaN(valor) && valor > 0 ? valor : null,
          note: nota.trim() || null,
        });
        setGuardando(false);
    
        if (error) return Alert.alert("No se pudo guardar", error);
    
        setGramosTxt("");
        setValorTxt("");
        setNota("");
      };

    return {goldMovements,gramosTxt,setGramosTxt, valorTxt,setValorTxt, nota, setNota,guardando, setGuardando,addGold, tipo,setTipo, resumen, dias, handleSave,  }
}