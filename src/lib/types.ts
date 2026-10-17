export type TxType = "income" | "expense";

export interface Transaction {
  id: string;
  type: TxType;
  amount: number;
  category: string;
  note: string;
  /** Local date in YYYY-MM-DD format */
  date: string;
}

export type Budgets = Record<string, number>;

export interface AppState {
  transactions: Transaction[];
  budgets: Budgets;
  currency: string;
}
