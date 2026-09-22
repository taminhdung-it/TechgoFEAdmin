'use client';

import { useState } from 'react';
import { Search, Trash2 } from 'lucide-react';
import { AdminHeader } from '../../../components/layout/AdminHeader';

interface Review {
  id: string;
  productName: string;
  userName: string;
  star: number;
  comment: string | null;
  createdAt: string;
}

const INITIAL_REVIEWS: Review[] = [
  { id: '1', productName: 'iPhone 15 Pro Max', userName: 'Nguyễn Văn A', star: 5, comment: 'Máy rất tốt, pin trâu, camera đỉnh!', createdAt: '2026-09-15T10:30:00' },
  { id: '2', productName: 'MacBook Air M3', userName: 'Trần Thị B', star: 4, comment: 'Nhẹ, mỏng, pin cực tốt. Thiếu cổng kết nối.', createdAt: '2026-09-14T14:22:00' },
  { id: '3', productName: 'Samsung Galaxy S24', userName: 'Lê Văn C', star: 3, comment: null, createdAt: '2026-09-13T09:15:00' },
  { id: '4', productName: 'Tai nghe Sony WH-1000XM5', userName: 'Phạm Thị D', star: 5, comment: 'Chống ồn tuyệt vời, âm thanh chuẩn studio.', createdAt: '2026-09-12T16:45:00' },
  { id: '5', productName: 'iPad Pro M4', userName: 'Hoàng Văn E', star: 2, comment: 'Giá cao quá so với tính năng thực tế.', createdAt: '2026-09-11T11:00:00' },
  { id: '6', productName: 'iPhone 15 Pro Max', userName: 'Võ Thị F', star: 4, comment: 'Đẹp, sang, nhưng nóng khi chơi game nặng.', createdAt: '2026-09-10T08:30:00' },
];

function StarDisplay({ star }: { star: number }) {
  return (
    <span className="text-sm leading-none">
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={i <= star ? 'text-amber-400' : 'text-slate-200'}>★</span>
      ))}
    </span>
  );
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [starFilter, setStarFilter] = useState<number | 'all'>('all');
  const [search, setSearch] = useState('');

  const filtered = reviews.filter((r) => {
    const matchStar = starFilter === 'all' || r.star === starFilter;
    const matchSearch = r.productName.toLowerCase().includes(search.toLowerCase());
    return matchStar && matchSearch;
  });

  const handleDelete = (id: string) => {
    if (window.confirm('Xóa đánh giá này?')) {
      setReviews((prev) => prev.filter((r) => r.id !== id));
    }
  };

  const totalCount = reviews.length;
  const avgStar = totalCount > 0
    ? (reviews.reduce((sum, r) => sum + r.star, 0) / totalCount).toFixed(1)
    : '0.0';
  const fivePct = totalCount > 0
    ? Math.round((reviews.filter((r) => r.star === 5).length / totalCount) * 100)
    : 0;
  const lowPct = totalCount > 0
    ? Math.round((reviews.filter((r) => r.star <= 2).length / totalCount) * 100)
    : 0;

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <AdminHeader title="Đánh giá sản phẩm" subtitle="Kiểm duyệt nhận xét từ khách hàng" />
      <div className="flex-1 p-6 space-y-4">
        {/* KPI row */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'Tổng đánh giá', value: String(totalCount) },
            { label: 'Trung bình sao', value: `${avgStar} ★` },
            { label: '5 sao', value: `${fivePct}%` },
            { label: '1–2 sao', value: `${lowPct}%` },
          ].map((kpi) => (
            <div key={kpi.label} className="bg-white border border-slate-200 rounded-xl px-4 py-3">
              <p className="text-xs text-slate-400">{kpi.label}</p>
              <p className="text-xl font-bold text-slate-800 mt-0.5">{kpi.value}</p>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Star filter pills */}
          <div className="flex gap-1">
            {(['all', 5, 4, 3, 2, 1] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStarFilter(s)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  starFilter === s
                    ? 'bg-amber-500 text-white'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {s === 'all' ? 'Tất cả' : `${s} ★`}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative ml-auto">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm sản phẩm..."
              className="pl-8 pr-3 py-1.5 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 w-52"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                {['Sản phẩm', 'Khách hàng', 'Đánh giá', 'Nhận xét', 'Ngày', ''].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-sm text-slate-400">
                    Không có đánh giá nào
                  </td>
                </tr>
              ) : (
                filtered.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-slate-100 rounded-md shrink-0" />
                        <span className="font-medium text-slate-700 line-clamp-1">{r.productName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{r.userName}</td>
                    <td className="px-4 py-3">
                      <StarDisplay star={r.star} />
                    </td>
                    <td className="px-4 py-3 text-slate-500 max-w-xs">
                      {r.comment ? (
                        <span title={r.comment} className="line-clamp-1">
                          {r.comment.length > 60 ? r.comment.slice(0, 60) + '…' : r.comment}
                        </span>
                      ) : (
                        <span className="italic text-slate-300">Không có nhận xét</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-400">
                      {new Date(r.createdAt).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleDelete(r.id)}
                        className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
