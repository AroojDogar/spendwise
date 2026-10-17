"use client";

import { useMemo, useState } from "react";
import { categoriesFor, getCategory } from "@/lib/categories";
import { dayLabel, formatMoney } from "@/lib/format";
import { actions } from "@/lib/store";
import type { Transaction, TxType } from "@/lib/types";
import { Card, EmptyState } from "./Card";

interface TransactionListProps {
  transactions: Transaction[];
  currency: string;
}

const filterClass =
  "rounded-lg border border-zinc-300 bg-white px-2.5 py-1.5 text-sm text-zinc-900 outline-none focus:border-indigo-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100";

export function TransactionList({ transactions, currency }: TransactionListProps) {
  const [query, setQuery] = useState("");
  const [type, setType] = useState<"all" | TxType>("all");
  const [category, setCategory] = useState("all");

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = transactions
      .filter((t) => type === "all" || t.type === type)
      .filter((t) => category === "all" || t.category === category)
      .filter((t) => !q || t.note.toLowerCase().includes(q) || getCategory(t.category).label.toLowerCase().includes(q))
      .sort((a, b) => b.date.localeCompare(a.date));

    const byDay = new Map<string, Transaction[]>();
    for (const t of filtered) byDay.set(t.date, [...(byDay.get(t.date) ?? []), t]);
    return [...byDay.entries()];
  }, [transactions, query, type, category]);

  const categoryOptions = type === "all" ? [...categoriesFor("expense"), ...categoriesFor("income")] : categoriesFor(type);

  return (
    <Card title={`Transactions (${transactions.length})`}>
      <div className="mb-4 flex flex-wrap gap-2">
        <input
          type="search"
          placeholder="Search notes or categories…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={`${filterClass} min-w-0 flex-1 basis-48`}
        />
        <select
          value={type}
          onChange={(e) => {
            setType(e.target.value as "all" | TxType);
            setCategory("all");
          }}
          className={filterClass}
          aria-label="Filter by type"
        >
          <option value="all">All types</option>
          <option value="expense">Expenses</option>
          <option value="income">Income</option>
        </select>
        <select value={category} onChange={(e) => setCategory(e.target.value)} className={filterClass} aria-label="Filter by category">
          <option value="all">All categories</option>
          {categoryOptions.map((c) => (
            <option key={c.id} value={c.id}>
              {c.emoji} {c.label}
            </option>
          ))}
        </select>
      </div>

      {groups.length === 0 ? (
        <EmptyState>
          {transactions.length === 0 ? "No transactions this month. Add your first one!" : "Nothing matches your filters."}
        </EmptyState>
      ) : (
        <div className="max-h-[560px] space-y-4 overflow-y-auto pr-1">
          {groups.map(([date, items]) => (
            <div key={date}>
              <h3 className="sticky top-0 z-10 bg-white py-1 text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400">
                {dayLabel(date)}
              </h3>
              <ul className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {items.map((t) => {
                  const cat = getCategory(t.category);
                  return (
                    <li key={t.id} className="group flex items-center gap-3 py-2.5">
                      <span
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-base"
                        style={{ background: `${cat.color}22` }}
                        aria-hidden
                      >
                        {cat.emoji}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">{t.note || cat.label}</p>
                        <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">{cat.label}</p>
                      </div>
                      <span
                        className={`text-sm font-semibold tabular-nums ${
                          t.type === "income" ? "text-emerald-600 dark:text-emerald-400" : "text-zinc-900 dark:text-zinc-100"
                        }`}
                      >
                        {t.type === "income" ? "+" : "−"}
                        {formatMoney(t.amount, currency)}
                      </span>
                      <button
                        onClick={() => actions.removeTransaction(t.id)}
                        className="rounded-md p-1 text-zinc-400 opacity-100 transition hover:bg-rose-50 hover:text-rose-600 sm:opacity-0 sm:group-hover:opacity-100 sm:focus:opacity-100 dark:hover:bg-rose-500/10"
                        aria-label={`Delete ${t.note || cat.label}`}
                        title="Delete"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
