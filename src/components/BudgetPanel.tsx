"use client";

import { useState } from "react";
import { EXPENSE_CATEGORIES } from "@/lib/categories";
import { formatMoney } from "@/lib/format";
import { actions } from "@/lib/store";
import type { Budgets } from "@/lib/types";
import { Card } from "./Card";

interface BudgetPanelProps {
  budgets: Budgets;
  spent: Record<string, number>;
  currency: string;
}

export function BudgetPanel({ budgets, spent, currency }: BudgetPanelProps) {
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState("");

  function startEdit(id: string) {
    setEditing(id);
    setDraft(budgets[id] ? String(budgets[id]) : "");
  }

  function save(id: string) {
    actions.setBudget(id, Math.max(0, Number(draft) || 0));
    setEditing(null);
  }

  return (
    <Card title="Monthly budgets">
      <ul className="space-y-3">
        {EXPENSE_CATEGORIES.map((cat) => {
          const limit = budgets[cat.id] ?? 0;
          const used = spent[cat.id] ?? 0;
          const pct = limit > 0 ? Math.min(100, (used / limit) * 100) : 0;
          const over = limit > 0 && used > limit;
          const warn = limit > 0 && !over && used / limit >= 0.8;

          return (
            <li key={cat.id}>
              <div className="flex items-center gap-2 text-sm">
                <span aria-hidden>{cat.emoji}</span>
                <span className="truncate text-zinc-700 dark:text-zinc-300">{cat.label}</span>
                {editing === cat.id ? (
                  <form
                    className="ml-auto flex items-center gap-1"
                    onSubmit={(e) => {
                      e.preventDefault();
                      save(cat.id);
                    }}
                  >
                    <input
                      autoFocus
                      type="number"
                      min="0"
                      placeholder="No limit"
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      onKeyDown={(e) => e.key === "Escape" && setEditing(null)}
                      className="w-24 rounded-md border border-zinc-300 bg-white px-2 py-1 text-right text-xs tabular-nums outline-none focus:border-indigo-500 dark:border-zinc-700 dark:bg-zinc-950"
                    />
                    <button type="submit" className="rounded-md bg-indigo-600 px-2 py-1 text-xs font-medium text-white">
                      Save
                    </button>
                  </form>
                ) : (
                  <button
                    onClick={() => startEdit(cat.id)}
                    className="ml-auto rounded-md px-1.5 py-0.5 text-xs tabular-nums text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                    title="Edit budget"
                  >
                    {formatMoney(used, currency, true)}
                    {limit > 0 ? ` / ${formatMoney(limit, currency, true)}` : " · set limit"}
                  </button>
                )}
              </div>
              {limit > 0 && (
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                  <div
                    className={`h-full rounded-full transition-all ${
                      over ? "bg-rose-500" : warn ? "bg-amber-500" : "bg-emerald-500"
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              )}
              {over && (
                <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">
                  Over budget by {formatMoney(used - limit, currency)}
                </p>
              )}
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
