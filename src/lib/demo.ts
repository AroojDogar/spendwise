import type { AppState, Transaction } from "./types";
import { toISODate } from "./format";

// Small deterministic PRNG so the demo data looks the same on every load.
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const EXPENSE_TEMPLATES: [category: string, note: string, min: number, max: number][] = [
  ["food", "Groceries", 4000, 9000],
  ["food", "Dinner out", 1500, 4500],
  ["transport", "Fuel", 3000, 7000],
  ["transport", "Ride share", 400, 1200],
  ["shopping", "Clothes", 2500, 8000],
  ["health", "Pharmacy", 800, 3000],
  ["entertainment", "Movie night", 1000, 2500],
  ["education", "Online course", 2000, 6000],
  ["other", "Misc", 300, 1500],
];

export function createDemoState(): AppState {
  const rand = mulberry32(42);
  const now = new Date();
  const transactions: Transaction[] = [];
  let n = 0;
  const add = (t: Omit<Transaction, "id">) => transactions.push({ ...t, id: `demo-${n++}` });

  for (let back = 5; back >= 0; back--) {
    const first = new Date(now.getFullYear(), now.getMonth() - back, 1);
    const lastDay =
      back === 0 ? now.getDate() : new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate();
    const day = (d: number) =>
      toISODate(new Date(first.getFullYear(), first.getMonth(), Math.min(d, lastDay)));

    add({ type: "income", amount: 120000, category: "salary", note: "Monthly salary", date: day(1) });
    if (rand() > 0.35) {
      add({
        type: "income",
        amount: Math.round((15000 + rand() * 30000) / 500) * 500,
        category: "freelance",
        note: "Client project",
        date: day(5 + Math.floor(rand() * 20)),
      });
    }
    add({ type: "expense", amount: 35000, category: "bills", note: "Rent", date: day(2) });
    add({
      type: "expense",
      amount: Math.round(6000 + rand() * 4000),
      category: "bills",
      note: "Electricity & internet",
      date: day(10),
    });

    const count = back === 0 ? Math.max(3, Math.round(lastDay / 2.5)) : 12;
    for (let i = 0; i < count; i++) {
      const [category, note, min, max] =
        EXPENSE_TEMPLATES[Math.floor(rand() * EXPENSE_TEMPLATES.length)];
      add({
        type: "expense",
        amount: Math.round((min + rand() * (max - min)) / 50) * 50,
        category,
        note,
        date: day(1 + Math.floor(rand() * lastDay)),
      });
    }
  }

  return {
    transactions,
    currency: "PKR",
    budgets: { food: 30000, transport: 15000, shopping: 12000, entertainment: 6000 },
  };
}
