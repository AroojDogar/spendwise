import { formatMoney, monthLabel } from "@/lib/format";
import { Card } from "./Card";

export interface MonthTotals {
  key: string;
  income: number;
  expense: number;
}

interface TrendChartProps {
  months: MonthTotals[];
  selected: string;
  currency: string;
  onSelect: (key: string) => void;
}

const W = 520;
const H = 200;
const PAD_BOTTOM = 24;
const PAD_LEFT = 72;

export function TrendChart({ months, selected, currency, onSelect }: TrendChartProps) {
  const max = Math.max(1, ...months.flatMap((m) => [m.income, m.expense]));
  const plotH = H - PAD_BOTTOM - 8;
  const groupW = (W - PAD_LEFT) / months.length;
  const barW = Math.min(18, groupW / 3.2);
  const ticks = [0, 0.5, 1];

  return (
    <Card
      title="Last 6 months"
      action={
        <div className="flex gap-3 text-xs text-zinc-500 dark:text-zinc-400">
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-sm bg-emerald-500" /> Income
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-sm bg-rose-500" /> Expenses
          </span>
        </div>
      }
    >
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="Income and expenses per month">
        {ticks.map((t) => {
          const y = 8 + plotH * (1 - t);
          return (
            <g key={t}>
              <line x1={PAD_LEFT} x2={W} y1={y} y2={y} className="stroke-zinc-200 dark:stroke-zinc-800" strokeDasharray="3 4" />
              <text x={PAD_LEFT - 6} y={y + 3} textAnchor="end" className="fill-zinc-400 text-[10px]">
                {formatMoney(max * t, currency, true)}
              </text>
            </g>
          );
        })}

        {months.map((m, i) => {
          const cx = PAD_LEFT + groupW * i + groupW / 2;
          const incomeH = (m.income / max) * plotH;
          const expenseH = (m.expense / max) * plotH;
          const isSelected = m.key === selected;
          return (
            <g key={m.key} onClick={() => onSelect(m.key)} className="cursor-pointer">
              <rect
                x={cx - groupW / 2 + 4}
                y={4}
                width={groupW - 8}
                height={plotH + PAD_BOTTOM - 2}
                rx={8}
                className={isSelected ? "fill-indigo-500/10" : "fill-transparent hover:fill-zinc-500/5"}
              />
              <rect x={cx - barW - 1} y={8 + plotH - incomeH} width={barW} height={incomeH} rx={3} className="fill-emerald-500">
                <title>{`Income: ${formatMoney(m.income, currency)}`}</title>
              </rect>
              <rect x={cx + 1} y={8 + plotH - expenseH} width={barW} height={expenseH} rx={3} className="fill-rose-500">
                <title>{`Expenses: ${formatMoney(m.expense, currency)}`}</title>
              </rect>
              <text
                x={cx}
                y={H - 6}
                textAnchor="middle"
                className={`text-[11px] ${isSelected ? "fill-indigo-600 font-semibold dark:fill-indigo-400" : "fill-zinc-500"}`}
              >
                {monthLabel(m.key, true)}
              </text>
            </g>
          );
        })}
      </svg>
    </Card>
  );
}
