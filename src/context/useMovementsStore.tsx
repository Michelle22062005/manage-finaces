import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

import type { Movement, MovementType } from '@/types/movement';

type NewMovement = Omit<Movement, 'id' | 'date'>;
type MovementsStore = {
  movements: Movement[];
  addMovement: (movement: NewMovement) => void;
};

const initialMovements: Movement[] = [
  {
    id: 'sample-income',
    type: 'income',
    amount: 2800000,
    categoryId: 'other',
    date: new Date().toISOString(),
    note: 'Salario',
  },
  {
    id: 'sample-food',
    type: 'expense',
    amount: 28000,
    categoryId: 'food',
    date: new Date().toISOString(),
    note: 'Almuerzo',
  },
  {
    id: 'sample-transport',
    type: 'expense',
    amount: 12000,
    categoryId: 'transport',
    date: new Date().toISOString(),
    note: 'Transporte',
  },
];

const MovementsContext = createContext<MovementsStore | null>(null);

export function MovementsStoreProvider({ children }: { children: ReactNode }) {
  const [movements, setMovements] = useState(initialMovements);
  const value = useMemo<MovementsStore>(
    () => ({
      movements,
      addMovement: (movement) =>
        setMovements((current) => [
          {
            ...movement,
            id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            date: new Date().toISOString(),
          },
          ...current,
        ]),
    }),
    [movements],
  );

  return <MovementsContext.Provider value={value}>{children}</MovementsContext.Provider>;
}

export function useMovementsStore<T>(selector: (state: MovementsStore) => T): T {
  const state = useContext(MovementsContext);
  if (!state) {
    throw new Error('useMovementsStore debe usarse dentro de MovementsStoreProvider.');
  }
  return selector(state);
}

export type { MovementType };
