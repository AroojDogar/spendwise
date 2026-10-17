"use client";

import { useState, type FormEvent } from "react";
import { categoriesFor } from "@/lib/categories";
import { todayISO } from "@/lib/format";
import { actions } from "@/lib/store";
import type { TxType } from "@/lib/types";
import { Card } from "./Card";

const inputClass =
  "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100";

export function TransactionForm() {
  const [type, setType] = useState<TxType>("expense");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState(categoriesFor("expense")[0].id);
  const [note, setNote] = useState("");
  const [date, setDate] = useState(todayISO);
  const [error, setError] = useState("");

  function switchType(next: TxType) {
    setType(next);
    setCategory(categoriesFor(next)[0].id);
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const value = Number(amount);
    if (!Number.isFinite(value) || value <= 0) {
      setError("Enter an amount greater than 0");
      return;
    }
    if (!date) {
      setError("Pick a date");
      return;
    }
    actions.addTransaction({ type, amount: Math.round(value * 100) / 100, category, note: note.trim(), date });
    setAmount("");
    setNote("");
    setError("");
  }

  return (
    <Card title="Add transaction">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-2 gap-1 rounded-lg bg-zinc-100 p-1 dark:bg-zinc-800">
          {(["expense", "income"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => switchType(t)}
              className={`rounded-md py-1.5 text-sm font-medium capitalize transition ${
                type === t
                  ? t === "expense"
                    ? "bg-white text-rose-600 shadow-sm dark:bg-zinc-950 dark:text-rose-400"
                    : "bg-white text-emerald-600 shadow-sm dark:bg-zinc-950 dark:text-emerald-400"
                  : "text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <label className="block">
          <span className="mb-1 block text-xs font-medium text-zinc-600 dark:text-zinc-400">Amount</span>
          <input
            type="number"
            inputMode="decimal"
            min="0"
            step="any"
            placeholder="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className={inputClass}
          />
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-zinc-600 dark:text-zinc-400">Category</span>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className={inputClass}>
              {categoriesFor(type).map((c) => (
                <option key={c.id} value={c.id}>
                  {c.emoji} {c.label}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-zinc-600 dark:text-zinc-400">Date</span>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputClass} />
          </label>
        </div>

        <label className="block">
          <span className="mb-1 block text-xs font-medium text-zinc-600 dark:text-zinc-400">Note (optional)</span>
          <input
            type="text"
            maxLength={80}
            placeholder={type === "expense" ? "e.g. Groceries" : "e.g. Client payment"}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className={inputClass}
          />
        </label>

        {error && <p className="text-xs text-rose-600 dark:text-rose-400">{error}</p>}

        <button
          type="submit"
          className="w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500 active:scale-[0.99]"
        >
          Add {type}
        </button>
      </form>
    </Card>
  );
}
