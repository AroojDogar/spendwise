import { formatMoney } from "@/lib/format";

interface SummaryCardsProps {
  income: number;
  expense: number;
  prevExpense: number;
  currency: string;
}

export function SummaryCards({ income, expense, prevExpense, currency }: SummaryCardsProps) {
  const balance = income - expense;
  const savingsRate = income > 0 ? Math.round((balance / income) * 100) : 0;
  const expenseChange = prevExpense > 0 ? Math.round(((expense - prevExpense) / prevExpense) * 100) : null;

  const cards = [
    {
      label: "Income",
      value: formatMoney(income, currency),
      hint: "Money in this month",
      accent: "text-emerald-600 dark:text-emerald-400",
    },
    {
      label: "Expenses",
      value: formatMoney(expense, currency),
      hint:
        expenseChange === null
          ? "No data for last month"
          : `${expenseChange > 0 ? "▲" : "▼"} ${Math.abs(expenseChange)}% vs last month`,
      accent: "text-rose-600 dark:text-rose-400",
    },
    {
      label: "Balance",
      value: formatMoney(balance, currency),
      hint: balance >= 0 ? "You're in the green" : "Spending exceeds income",
      accent: balance >= 0 ? "text-zinc-900 dark:text-zinc-50" : "text-rose-600 dark:text-rose-400",
    },
    {
      label: "Savings rate",
      value: `${savingsRate}%`,
      hint: savingsRate >= 20 ? "Great, keep it up" : "Aim for 20% or more",
      accent: "text-indigo-600 dark:text-indigo-400",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {cards.map((c) => (
        <div
          key={c.label}
          className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
        >
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            {c.label}
          </p>
          <p className={`mt-1 truncate text-xl font-bold tabular-nums sm:text-2xl ${c.accent}`}>{c.value}</p>
          <p className="mt-1 truncate text-xs text-zinc-500 dark:text-zinc-400">{c.hint}</p>
        </div>
      ))}
    </div>
  );
}
