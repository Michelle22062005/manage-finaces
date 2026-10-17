export type MovementType = 'income' | 'expense';

export type Movement = {
  id: string;
  type: MovementType;
  amount: number;
  categoryId: string;
  date: string;
  note: string;
};
