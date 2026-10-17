import type { TxType } from "./types";

export interface Category {
  id: string;
  label: string;
  emoji: string;
  color: string;
}

export const EXPENSE_CATEGORIES: Category[] = [
  { id: "food", label: "Food & Dining", emoji: "🍔", color: "#f97316" },
  { id: "transport", label: "Transport", emoji: "🚗", color: "#0ea5e9" },
  { id: "shopping", label: "Shopping", emoji: "🛍️", color: "#ec4899" },
  { id: "bills", label: "Bills & Utilities", emoji: "💡", color: "#eab308" },
  { id: "health", label: "Health", emoji: "💊", color: "#22c55e" },
  { id: "entertainment", label: "Entertainment", emoji: "🎬", color: "#a855f7" },
  { id: "education", label: "Education", emoji: "📚", color: "#14b8a6" },
  { id: "other", label: "Other", emoji: "📦", color: "#64748b" },
];

export const INCOME_CATEGORIES: Category[] = [
  { id: "salary", label: "Salary", emoji: "💼", color: "#10b981" },
  { id: "freelance", label: "Freelance", emoji: "💻", color: "#6366f1" },
  { id: "business", label: "Business", emoji: "🏪", color: "#f59e0b" },
  { id: "gifts", label: "Gifts", emoji: "🎁", color: "#f43f5e" },
  { id: "other-income", label: "Other", emoji: "➕", color: "#64748b" },
];

const ALL = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES];

export function categoriesFor(type: TxType): Category[] {
  return type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
}

export function getCategory(id: string): Category {
  return ALL.find((c) => c.id === id) ?? EXPENSE_CATEGORIES[EXPENSE_CATEGORIES.length - 1];
}
