'use client';

import { useState } from 'react';
import { Search, Plus, Package, Pencil, Trash2 } from 'lucide-react';
import { AdminHeader } from '../../../components/layout/AdminHeader';
import { StatusBadge } from '../../../components/ui/StatusBadge';

interface Product {
  id: string;
  name: string;
  category: string;
  brand: string;
  price: number;
  stock: number;
  status: 'active' | 'inactive';
}

const MOCK_PRODUCTS: Product[] = [
  { id: '1', name: 'iPhone 15 Pro Max 256GB', category: 'Điện thoại', brand: 'Apple', price: 33990000, stock: 45, status: 'active' },
  { id: '2', name: 'MacBook Pro M3 14"', category: 'Laptop', brand: 'Apple', price: 54990000, stock: 12, status: 'active' },
  { id: '3', name: 'Samsung Galaxy S24 Ultra', category: 'Điện thoại', brand: 'Samsung', price: 29990000, stock: 8, status: 'active' },
  { id: '4', name: 'Dell XPS 15 OLED', category: 'Laptop', brand: 'Dell', price: 42990000, stock: 3, status: 'active' },
  { id: '5', name: 'Sony WH-1000XM5', category: 'Âm thanh', brand: 'Sony', price: 8490000, stock: 0, status: 'inactive' },
  { id: '6', name: 'iPad Pro M4 11"', category: 'Máy tính bảng', brand: 'Apple', price: 28990000, stock: 20, status: 'active' },
  { id: '7', name: 'ASUS ROG Zephyrus G16', category: 'Laptop', brand: 'ASUS', price: 39990000, stock: 5, status: 'active' },
  { id: '8', name: 'AirPods Pro 2nd Gen', category: 'Âm thanh', brand: 'Apple', price: 6990000, stock: 67, status: 'active' },
  { id: '9', name: 'Samsung Galaxy Tab S9+', category: 'Máy tính bảng', brand: 'Samsung', price: 22990000, stock: 15, status: 'active' },
  { id: '10', name: 'LG 27" 4K Monitor', category: 'Màn hình', brand: 'LG', price: 14990000, stock: 9, status: 'active' },
  { id: '11', name: 'Logitech MX Master 3S', category: 'Phụ kiện', brand: 'Logitech', price: 2490000, stock: 34, status: 'active' },
  { id: '12', name: 'Apple Watch Ultra 2', category: 'Đồng hồ', brand: 'Apple', price: 21990000, stock: 0, status: 'inactive' },
];

const CATEGORIES = ['Tất cả', 'Điện thoại', 'Laptop', 'Máy tính bảng', 'Âm thanh', 'Màn hình', 'Phụ kiện', 'Đồng hồ'];
const PAGE_SIZE = 8;

export default function ProductsPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Tất cả');
  const [page, setPage] = useState(1);

  const filtered = MOCK_PRODUCTS.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'Tất cả' || p.category === category;
    return matchSearch && matchCat;
  });

  const total = filtered.length;
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="flex flex-col flex-1">
      <AdminHeader title="Products" subtitle={`${total} sản phẩm`} />

      <div className="flex-1 p-6 space-y-4">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Tìm sản phẩm, thương hiệu..."
              className="pl-8 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64 bg-white"
            />
          </div>

          {/* Category filter */}
          <div className="flex gap-1 flex-wrap">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => { setCategory(cat); setPage(1); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  category === cat
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <button className="ml-auto flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors">
            <Plus size={14} />
            Thêm sản phẩm
          </button>
        </div>

        {/* Table */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Sản phẩm</th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Danh mục</th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Thương hiệu</th>
                <th className="text-right px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Giá</th>
                <th className="text-right px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Tồn kho</th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Trạng thái</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paged.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-sm text-slate-400">
                    <Package size={32} className="mx-auto mb-2 text-slate-200" />
                    Không tìm thấy sản phẩm
                  </td>
                </tr>
              ) : (
                paged.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                          <Package size={16} className="text-slate-400" />
                        </div>
                        <span className="font-medium text-slate-900 text-sm">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-500 text-sm">{p.category}</td>
                    <td className="px-4 py-3 text-slate-500 text-sm">{p.brand}</td>
                    <td className="px-4 py-3 text-right font-semibold text-slate-900 text-sm">
                      ₫{p.price.toLocaleString('vi-VN')}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className={`font-semibold text-sm ${
                        p.stock === 0 ? 'text-red-600' : p.stock < 5 ? 'text-amber-600' : 'text-slate-700'
                      }`}>
                        {p.stock}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={p.status} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 justify-end">
                        <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <Pencil size={14} />
                        </button>
                        <button className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between text-sm text-slate-500">
            <span>Hiển thị {Math.min((page - 1) * PAGE_SIZE + 1, total)}–{Math.min(page * PAGE_SIZE, total)} / {total}</span>
            <div className="flex gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 border border-slate-200 rounded-lg bg-white disabled:opacity-40 hover:bg-slate-50 text-xs font-medium"
              >
                ← Trước
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
                <button
                  key={pg}
                  onClick={() => setPage(pg)}
                  className={`w-8 h-8 rounded-lg text-xs font-medium border transition-colors ${
                    pg === page
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  {pg}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1.5 border border-slate-200 rounded-lg bg-white disabled:opacity-40 hover:bg-slate-50 text-xs font-medium"
              >
                Tiếp →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
