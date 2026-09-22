import type { LucideIcon } from 'lucide-react';

interface KpiCardProps {
  label: string;
  value: string;
  sub?: string;
  trend?: { value: string; positive: boolean };
  icon: LucideIcon;
  iconBg?: string;
  iconColor?: string;
}

export function KpiCard({
  label,
  value,
  sub,
  trend,
  icon: Icon,
  iconBg = 'bg-blue-50',
  iconColor = 'text-blue-600',
}: KpiCardProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-start justify-between">
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-1.5">
          {label}
        </p>
        <p className="text-2xl font-bold text-slate-900 leading-none">{value}</p>
        {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
        {trend && (
          <p
            className={`text-xs mt-1.5 font-medium flex items-center gap-0.5 ${
              trend.positive ? 'text-emerald-600' : 'text-red-500'
            }`}
          >
            {trend.positive ? '↑' : '↓'} {trend.value} vs tháng trước
          </p>
        )}
      </div>
      <div className={`p-2.5 rounded-xl ${iconBg} ${iconColor} shrink-0 ml-3`}>
        <Icon size={20} />
      </div>
    </div>
  );
}
