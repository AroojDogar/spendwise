"use client";

import { useSyncExternalStore } from "react";
import type { AppState, Transaction } from "./types";
import { createDemoState } from "./demo";

const STORAGE_KEY = "spendwise:v1";
const EMPTY: AppState = { transactions: [], budgets: {}, currency: "PKR" };

let state: AppState | null = null;
const listeners = new Set<() => void>();

function load(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...EMPTY, ...JSON.parse(raw) };
  } catch {
    // Storage unavailable or corrupted: fall back to demo data.
  }
  return createDemoState();
}

function getSnapshot(): AppState {
  if (!state) state = load();
  return state;
}

function setState(update: (prev: AppState) => AppState) {
  state = update(getSnapshot());
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore quota / private-mode errors; state still lives in memory.
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useAppState(): AppState {
  return useSyncExternalStore(subscribe, getSnapshot, () => EMPTY);
}

export const actions = {
  addTransaction(tx: Omit<Transaction, "id">) {
    setState((s) => ({
      ...s,
      transactions: [{ ...tx, id: crypto.randomUUID() }, ...s.transactions],
    }));
  },
  removeTransaction(id: string) {
    setState((s) => ({ ...s, transactions: s.transactions.filter((t) => t.id !== id) }));
  },
  setBudget(category: string, amount: number) {
    setState((s) => {
      const budgets = { ...s.budgets };
      if (amount > 0) budgets[category] = amount;
      else delete budgets[category];
      return { ...s, budgets };
    });
  },
  setCurrency(currency: string) {
    setState((s) => ({ ...s, currency }));
  },
  loadDemo() {
    setState(() => createDemoState());
  },
  clearAll() {
    setState((s) => ({ ...EMPTY, currency: s.currency }));
  },
};
