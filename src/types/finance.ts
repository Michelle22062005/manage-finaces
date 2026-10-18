export type Kind = 'ingreso' | 'gasto';
export type Scope = 'casa' | 'propio' | 'taxi';

export interface Category {
  id: number;
  userId: string;
  name: string;
  scope: Scope;
  monthlyBudget: number;
  icon?: string;
}

export interface Transaction {
  id: number;
  userId: string;
  kind: Kind;
  amount: number;
  date: string; // Formato YYYY-MM-DD
  categoryId: number;
  note?: string | null;
  createdAt?: string;
}