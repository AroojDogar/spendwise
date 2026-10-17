import type { Transaction } from "./types";
import { getCategory } from "./categories";

function escape(value: string | number): string {
  const s = String(value);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function downloadCSV(transactions: Transaction[], filename: string) {
  const header = ["Date", "Type", "Category", "Note", "Amount"];
  const rows = [...transactions]
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((t) => [t.date, t.type, getCategory(t.category).label, t.note, t.amount]);
  const csv = [header, ...rows].map((r) => r.map(escape).join(",")).join("\n");

  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
