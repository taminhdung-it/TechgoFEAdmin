'use client';

import { useState } from 'react';
import { BarChart3, TrendingUp, ShoppingBag, Users } from 'lucide-react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, PieChart, Pie, Cell, Legend,
} from 'recharts';
import { AdminHeader } from '../../../components/layout/AdminHeader';

const MONTHLY_REVENUE = [
  { month: 'Th1', revenue: 820, orders: 1240 },
  { month: 'Th2', revenue: 940, orders: 1380 },
  { month: 'Th3', revenue: 750, orders: 1100 },
  { month: 'Th4', revenue: 890, orders: 1290 },
  { month: 'Th5', revenue: 1020, orders: 1450 },
  { month: 'Th6', revenue: 950, orders: 1380 },
  { month: 'Th7', revenue: 1100, orders: 1560 },
  { month: 'Th8', revenue: 1284, orders: 1748 },
];

const CATEGORY_DIST = [
  { name: 'Điện thoại', value: 38, color: '#2563eb' },
  { name: 'Laptop', value: 28, color: '#7c3aed' },
  { name: 'Máy tính bảng', value: 14, color: '#059669' },
  { name: 'Âm thanh', value: 11, color: '#d97706' },
  { name: 'Khác', value: 9, color: '#64748b' },
];

type Period = '3m' | '6m' | '12m';

export default function ReportsPage() {
  const [period, setPeriod] = useState<Period>('6m');

  const months = period === '3m' ? 3 : period === '6m' ? 6 : 8;
  const data = MONTHLY_REVENUE.slice(-months);

  return (
    <div className="flex flex-col flex-1">
      <AdminHeader title="Reports" subtitle="Báo cáo & thống kê doanh thu" />

      <div className="flex-1 p-6 space-y-5">
        {/* KPI row */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'Doanh thu tháng 8', value: '₫1,284.5M', trend: '+12.4%', icon: TrendingUp, up: true, bg: 'bg-blue-50', color: 'text-blue-600' },
            { label: 'Đơn hoàn thành', value: '1,748', trend: '+8.1%', icon: ShoppingBag, up: true, bg: 'bg-emerald-50', color: 'text-emerald-600' },
            { label: 'Khách mới tháng 8', value: '342', trend: '+15.3%', icon: Users, up: true, bg: 'bg-purple-50', color: 'text-purple-600' },
            { label: 'Tỷ lệ hoàn trả', value: '1.2%', trend: '-0.3%', icon: BarChart3, up: false, bg: 'bg-red-50', color: 'text-red-500' },
          ].map((k) => (
            <div key={k.label} className="bg-white border border-slate-200 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">{k.label}</p>
                <div className={`p-2 rounded-lg ${k.bg}`}><k.icon size={16} className={k.color} /></div>
              </div>
              <p className="text-2xl font-bold text-slate-900">{k.value}</p>
              <p className={`text-xs mt-1 font-medium ${k.up ? 'text-emerald-600' : 'text-red-500'}`}>
                {k.trend} vs tháng trước
              </p>
            </div>
          ))}
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-3 gap-5">
          {/* Bar chart — 2/3 width */}
          <div className="col-span-2 bg-white border border-slate-200 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-slate-900 text-sm">Doanh thu theo tháng</h3>
                <p className="text-xs text-slate-400 mt-0.5">Đơn vị: triệu VNĐ</p>
              </div>
              <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
                {(['3m', '6m', '12m'] as Period[]).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPeriod(p)}
                    className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                      period === p ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}M`} />
                <Tooltip
                  contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e2e8f0' }}
                  formatter={(v) => [`₫${Number(v)}M`, 'Doanh thu']}
                />
                <Bar dataKey="revenue" fill="#2563eb" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie chart — 1/3 width */}
          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <h3 className="font-semibold text-slate-900 text-sm mb-1">Danh mục bán chạy</h3>
            <p className="text-xs text-slate-400 mb-4">Theo doanh thu tháng 8</p>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={CATEGORY_DIST}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {CATEGORY_DIST.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Legend
                  iconType="circle"
                  iconSize={8}
                  formatter={(value) => <span style={{ fontSize: 11, color: '#64748b' }}>{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
