import React, { useMemo, useState } from "react";
import {
  currentMonth,
  totalForTheMonth,
} from "@/lib/exportMonth";
import { useFinanceStore } from "@/context/useFinanceStore";


export function useRecord(){
    const { transactions, categories, selectedFilter, setFilter } = useFinanceStore();
      const [month, setMonth] = useState(currentMonth());
    
      // Movimientos del mes elegido (el archivo lleva todo el mes, sin el filtro de chips)
      const ofTheMonth = useMemo(
        () => transactions.filter((t) => t.date.startsWith(month)),
        [transactions, month],
      );
    
      // Lo que se ve en pantalla: el mes + el filtro de chips
      const filteredTransactions = ofTheMonth.filter(
        (t) => selectedFilter === "todos" || t.kind === selectedFilter,
      );
    
      const totales = totalForTheMonth(ofTheMonth);
    
      // Agrupar por fecha ("AAAA-MM-DD")
      const groupedByDate = filteredTransactions.reduce<Record<string, typeof transactions>>(
        (groups, tx) => {
          (groups[tx.date] ??= []).push(tx);
          return groups;
        },
        {},
      );
    
      // Ordenar de la fecha más reciente a la más antigua y calcular el neto de cada día
      const sortedDateGroups = Object.keys(groupedByDate)
        .sort((a, b) => b.localeCompare(a))
        .map((date) => {
          const movements = groupedByDate[date];
          const dayNet = movements.reduce(
            (acc, t) => (t.kind === "ingreso" ? acc + t.amount : acc - t.amount),
            0,
          );
          return { date, dayNet, movements };
        });
    
      // Nombre e ícono de la categoría (puede no tener)
      const getCategoryDetails = (categoryId: number | null) => {
        const cat = categoryId == null ? undefined : categories.find((c) => c.id === categoryId);
        return {
          name: cat?.name ?? "General",
          icon: cat?.icon ?? null,
        };
      };
    
      const esMesActual = month >= currentMonth();

    return{transactions, categories, selectedFilter, setFilter, month, setMonth, ofTheMonth,  filteredTransactions, totales, groupedByDate, sortedDateGroups, getCategoryDetails, esMesActual}
}