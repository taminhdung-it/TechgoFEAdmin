'use client';

import { useState } from 'react';
import { Search, Warehouse } from 'lucide-react';
import { AdminHeader } from '../../../components/layout/AdminHeader';
import { StatusBadge } from '../../../components/ui/StatusBadge';

interface InventoryItem {
  id: string;
  product: string;
  sku: string;
  warehouseHCM: number;
  warehouseHN: number;
  total: number;
  stockStatus: 'normal' | 'low' | 'critical' | 'out';
  lastUpdated: string;
}

const MOCK_INVENTORY: InventoryItem[] = [
  { id: '1', product: 'iPhone 15 Pro Max 256GB', sku: 'APL-IP15PM-256', warehouseHCM: 30, warehouseHN: 15, total: 45, stockStatus: 'normal', lastUpdated: '2026-09-17' },
  { id: '2', product: 'MacBook Pro M3 14"', sku: 'APL-MBP-M3-14', warehouseHCM: 8, warehouseHN: 4, total: 12, stockStatus: 'normal', lastUpdated: '2026-09-16' },
  { id: '3', product: 'Samsung Galaxy S24 Ultra', sku: 'SAM-S24U-256', warehouseHCM: 5, warehouseHN: 3, total: 8, stockStatus: 'low', lastUpdated: '2026-09-15' },
  { id: '4', product: 'Dell XPS 15 OLED', sku: 'DEL-XPS15-I7', warehouseHCM: 3, warehouseHN: 0, total: 3, stockStatus: 'critical', lastUpdated: '2026-09-14' },
  { id: '5', product: 'Sony WH-1000XM5', sku: 'SON-WH1000XM5', warehouseHCM: 0, warehouseHN: 0, total: 0, stockStatus: 'out', lastUpdated: '2026-09-13' },
  { id: '6', product: 'iPad Pro M4 11"', sku: 'APL-IPAD-M4-11', warehouseHCM: 12, warehouseHN: 8, total: 20, stockStatus: 'normal', lastUpdated: '2026-09-17' },
  { id: '7', product: 'ASUS ROG Zephyrus G16', sku: 'ASU-ROG-G16-R9', warehouseHCM: 5, warehouseHN: 0, total: 5, stockStatus: 'low', lastUpdated: '2026-09-12' },
  { id: '8', product: 'AirPods Pro 2nd Gen', sku: 'APL-APP-2ND', warehouseHCM: 40, warehouseHN: 27, total: 67, stockStatus: 'normal', lastUpdated: '2026-09-17' },
];

export default function InventoryPage() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'low' | 'critical' | 'out'>('all');

  const filtered = MOCK_INVENTORY.filter((item) => {
    const matchSearch = item.product.toLowerCase().includes(search.toLowerCase()) ||
      item.sku.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || item.stockStatus === filter ||
      (filter === 'low' && (item.stockStatus === 'low' || item.stockStatus === 'critical' || item.stockStatus === 'out'));
    return matchSearch && matchFilter;
  });

  const summary = {
    normal: MOCK_INVENTORY.filter((i) => i.stockStatus === 'normal').length,
    low: MOCK_INVENTORY.filter((i) => i.stockStatus === 'low').length,
    critical: MOCK_INVENTORY.filter((i) => i.stockStatus === 'critical').length,
    out: MOCK_INVENTORY.filter((i) => i.stockStatus === 'out').length,
  };

  return (
    <div className="flex flex-col flex-1">
      <AdminHeader title="Inventory" subtitle="Quản lý tồn kho theo kho hàng" />

      <div className="flex-1 p-6 space-y-4">
        {/* Summary cards */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: 'Bình thường', count: summary.normal, color: 'border-emerald-200 bg-emerald-50', text: 'text-emerald-700' },
            { label: 'Sắp hết', count: summary.low, color: 'border-amber-200 bg-amber-50', text: 'text-amber-700' },
            { label: 'Nguy hiểm', count: summary.critical, color: 'border-red-200 bg-red-50', text: 'text-red-700' },
            { label: 'Hết hàng', count: summary.out, color: 'border-slate-200 bg-slate-50', text: 'text-slate-500' },
          ].map((s) => (
            <div key={s.label} className={`border rounded-xl p-4 ${s.color}`}>
              <p className={`text-2xl font-bold ${s.text}`}>{s.count}</p>
              <p className={`text-xs font-medium mt-0.5 ${s.text}`}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm sản phẩm, SKU..."
              className="pl-8 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-60 bg-white"
            />
          </div>
          <div className="flex gap-1">
            {([['all', 'Tất cả'], ['low', 'Cần nhập'], ['out', 'Hết hàng']] as const).map(([val, lbl]) => (
              <button
                key={val}
                onClick={() => setFilter(val)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  filter === val ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {lbl}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Sản phẩm / SKU</th>
                <th className="text-center px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Kho HCM</th>
                <th className="text-center px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Kho HN</th>
                <th className="text-center px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Tổng tồn</th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Tình trạng</th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Cập nhật</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium text-slate-900 text-sm">{item.product}</p>
                    <p className="text-[11px] text-slate-400 font-mono">{item.sku}</p>
                  </td>
                  <td className="px-4 py-3 text-center font-semibold text-slate-700">{item.warehouseHCM}</td>
                  <td className="px-4 py-3 text-center font-semibold text-slate-700">{item.warehouseHN}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`font-bold text-base ${
                      item.total === 0 ? 'text-slate-400' : item.total < 5 ? 'text-red-600' : item.total < 10 ? 'text-amber-600' : 'text-emerald-600'
                    }`}>
                      {item.total}
                    </span>
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={item.stockStatus} /></td>
                  <td className="px-4 py-3 text-slate-400 text-xs">
                    {new Date(item.lastUpdated).toLocaleDateString('vi-VN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
