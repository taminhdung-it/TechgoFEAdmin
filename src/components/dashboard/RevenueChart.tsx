'use client';

import { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

type Period = 'day' | 'week' | 'month' | 'year';

const MOCK: Record<Period, { label: string; value: number }[]> = {
  day: [
    { label: 'T2', value: 142 },
    { label: 'T3', value: 168 },
    { label: 'T4', value: 135 },
    { label: 'T5', value: 195 },
    { label: 'T6', value: 212 },
    { label: 'T7', value: 248 },
    { label: 'CN', value: 184 },
  ],
  week: [
    { label: 'Tuần 1', value: 520 },
    { label: 'Tuần 2', value: 680 },
    { label: 'Tuần 3', value: 740 },
    { label: 'Tuần 4', value: 920 },
  ],
  month: [
    { label: 'Th1', value: 820 },
    { label: 'Th2', value: 940 },
    { label: 'Th3', value: 750 },
    { label: 'Th4', value: 890 },
    { label: 'Th5', value: 1020 },
    { label: 'Th6', value: 950 },
    { label: 'Th7', value: 1100 },
    { label: 'Th8', value: 1284 },
  ],
  year: [
    { label: '2023', value: 8200 },
    { label: '2024', value: 10400 },
    { label: '2025', value: 11800 },
    { label: '2026', value: 9680 },
  ],
};

const PERIOD_LABELS: Record<Period, string> = {
  day: 'Day',
  week: 'Week',
  month: 'Month',
  year: 'Year',
};

interface CustomTooltipProps {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-lg px-3 py-2">
      <p className="text-xs text-slate-500 mb-0.5">{label}</p>
      <p className="text-sm font-bold text-slate-900">
        ₫{payload[0].value.toLocaleString()}M
      </p>
    </div>
  );
}

export function RevenueChart() {
  const [period, setPeriod] = useState<Period>('month');
  const data = MOCK[period];

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="font-semibold text-slate-900 text-sm">Revenue Overview</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Tháng 8, 2026 · ₫1,284.5M tổng doanh thu
          </p>
        </div>
        <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
          {(Object.keys(PERIOD_LABELS) as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                period === p
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {PERIOD_LABELS[p]}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={data} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
          <defs>
            <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2563eb" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11, fill: '#94a3b8' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: '#94a3b8' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `${v}M`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#2563eb"
            strokeWidth={2}
            fill="url(#revenueGrad)"
            dot={false}
            activeDot={{ r: 4, fill: '#2563eb', strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
