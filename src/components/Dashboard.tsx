"use client";

import { useMemo, useState } from "react";
import { downloadCSV } from "@/lib/csv";
import { CURRENCIES, currentMonthKey, monthKey, monthLabel, shiftMonth } from "@/lib/format";
import { actions, useAppState } from "@/lib/store";
import { BudgetPanel } from "./BudgetPanel";
import { CategoryDonut } from "./CategoryDonut";
import { SummaryCards } from "./SummaryCards";
import { TransactionForm } from "./TransactionForm";
import { TransactionList } from "./TransactionList";
import { TrendChart, type MonthTotals } from "./TrendChart";

const buttonClass =
  "rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 disabled:opacity-40 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800";

export default function Dashboard() {
  const { transactions, budgets, currency } = useAppState();
  const [month, setMonth] = useState(currentMonthKey);
  const isCurrentMonth = month === currentMonthKey();

  const totals = useMemo(() => {
    const byMonth = new Map<string, MonthTotals>();
    for (const t of transactions) {
      const key = monthKey(t.date);
      const entry = byMonth.get(key) ?? { key, income: 0, expense: 0 };
      entry[t.type] += t.amount;
      byMonth.set(key, entry);
    }
    return byMonth;
  }, [transactions]);

  const monthTx = useMemo(() => transactions.filter((t) => monthKey(t.date) === month), [transactions, month]);

  const spentByCategory = useMemo(() => {
    const out: Record<string, number> = {};
    for (const t of monthTx) if (t.type === "expense") out[t.category] = (out[t.category] ?? 0) + t.amount;
    return out;
  }, [monthTx]);

  const trend = Array.from({ length: 6 }, (_, i) => {
    const key = shiftMonth(month, i - 5);
    return totals.get(key) ?? { key, income: 0, expense: 0 };
  });

  const current = totals.get(month) ?? { key: month, income: 0, expense: 0 };
  const previous = totals.get(shiftMonth(month, -1));

  function handleClear() {
    if (confirm("Delete all transactions and budgets? This cannot be undone.")) actions.clearAll();
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:py-10">
      <header className="mb-6 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-lg font-bold text-white">S</span>
          <div>
            <h1 className="text-lg font-bold leading-tight text-zinc-900 dark:text-zinc-50">Spendwise</h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Personal expense tracker</p>
          </div>
        </div>

        <div className="ml-auto flex flex-wrap items-center gap-2">
          <select
            value={currency}
            onChange={(e) => actions.setCurrency(e.target.value)}
            className={buttonClass}
            aria-label="Currency"
          >
            {CURRENCIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <button
            className={buttonClass}
            disabled={monthTx.length === 0}
            onClick={() => downloadCSV(monthTx, `spendwise-${month}.csv`)}
          >
            Export CSV
          </button>
        </div>
      </header>

      <div className="mb-6 flex items-center justify-between gap-3">
        <button className={buttonClass} onClick={() => setMonth(shiftMonth(month, -1))} aria-label="Previous month">
          ←
        </button>
        <div className="text-center">
          <p className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">{monthLabel(month)}</p>
          {!isCurrentMonth && (
            <button
              className="text-xs font-medium text-indigo-600 hover:underline dark:text-indigo-400"
              onClick={() => setMonth(currentMonthKey())}
            >
              Jump to this month
            </button>
          )}
        </div>
        <button
          className={buttonClass}
          onClick={() => setMonth(shiftMonth(month, 1))}
          disabled={isCurrentMonth}
          aria-label="Next month"
        >
          →
        </button>
      </div>

      <div className="space-y-6">
        <SummaryCards
          income={current.income}
          expense={current.expense}
          prevExpense={previous?.expense ?? 0}
          currency={currency}
        />

        <div className="grid gap-6 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <TrendChart months={trend} selected={month} currency={currency} onSelect={setMonth} />
          </div>
          <div className="lg:col-span-2">
            <CategoryDonut byCategory={spentByCategory} currency={currency} />
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6">
            <TransactionForm />
            <BudgetPanel budgets={budgets} spent={spentByCategory} currency={currency} />
          </div>
          <div className="lg:col-span-2">
            <TransactionList transactions={monthTx} currency={currency} />
          </div>
        </div>
      </div>

      <footer className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-zinc-200 pt-6 text-xs text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
        <p>Your data stays in this browser (localStorage). Nothing is sent to a server.</p>
        <div className="flex gap-2">
          <button className="hover:text-indigo-600 dark:hover:text-indigo-400" onClick={() => actions.loadDemo()}>
            Load demo data
          </button>
          <span>·</span>
          <button className="hover:text-rose-600 dark:hover:text-rose-400" onClick={handleClear}>
            Clear all data
          </button>
        </div>
      </footer>
    </div>
  );
}
