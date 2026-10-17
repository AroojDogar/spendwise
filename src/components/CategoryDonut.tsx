import { getCategory } from "@/lib/categories";
import { formatMoney } from "@/lib/format";
import { Card, EmptyState } from "./Card";

interface CategoryDonutProps {
  byCategory: Record<string, number>;
  currency: string;
}

const SIZE = 160;
const STROKE = 22;
const R = (SIZE - STROKE) / 2;
const CIRC = 2 * Math.PI * R;

export function CategoryDonut({ byCategory, currency }: CategoryDonutProps) {
  const entries = Object.entries(byCategory)
    .filter(([, v]) => v > 0)
    .sort((a, b) => b[1] - a[1]);
  const total = entries.reduce((sum, [, v]) => sum + v, 0);

  const segments = entries.map(([id, value], i) => {
    const before = entries.slice(0, i).reduce((sum, [, v]) => sum + v, 0);
    return {
      id,
      value,
      length: (value / total) * CIRC,
      offset: (before / total) * CIRC,
      color: getCategory(id).color,
    };
  });

  return (
    <Card title="Spending by category">
      {total === 0 ? (
        <EmptyState>No expenses this month yet.</EmptyState>
      ) : (
        <div className="flex flex-col items-center gap-5 sm:flex-row lg:flex-col xl:flex-row">
          <div className="relative shrink-0">
            <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} className="-rotate-90">
              <circle
                cx={SIZE / 2}
                cy={SIZE / 2}
                r={R}
                fill="none"
                strokeWidth={STROKE}
                className="stroke-zinc-100 dark:stroke-zinc-800"
              />
              {segments.map((s) => (
                <circle
                  key={s.id}
                  cx={SIZE / 2}
                  cy={SIZE / 2}
                  r={R}
                  fill="none"
                  stroke={s.color}
                  strokeWidth={STROKE}
                  strokeDasharray={`${Math.max(s.length - 2, 0.5)} ${CIRC}`}
                  strokeDashoffset={-s.offset}
                >
                  <title>{`${getCategory(s.id).label}: ${formatMoney(s.value, currency)}`}</title>
                </circle>
              ))}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xs text-zinc-500 dark:text-zinc-400">Total</span>
              <span className="text-sm font-bold tabular-nums text-zinc-900 dark:text-zinc-100">
                {formatMoney(total, currency, true)}
              </span>
            </div>
          </div>

          <ul className="w-full space-y-2">
            {segments.map((s) => {
              const cat = getCategory(s.id);
              return (
                <li key={s.id} className="flex items-center gap-2 text-sm">
                  <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: s.color }} />
                  <span className="truncate text-zinc-700 dark:text-zinc-300">{cat.label}</span>
                  <span className="ml-auto tabular-nums text-zinc-500 dark:text-zinc-400">
                    {Math.round((s.value / total) * 100)}%
                  </span>
                  <span className="w-16 shrink-0 text-right font-medium tabular-nums text-zinc-900 dark:text-zinc-100">
                    {formatMoney(s.value, currency, true)}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </Card>
  );
}
