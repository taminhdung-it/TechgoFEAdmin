'use client';

import { useState } from 'react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { AdminHeader } from '../../../components/layout/AdminHeader';

type DiscountType = 'PERCENT' | 'FIXED';
type VoucherStatus = 'active' | 'expired' | 'upcoming' | 'exhausted';

interface Voucher {
  id: string;
  code: string;
  name: string;
  description: string | null;
  discountType: DiscountType;
  discountValue: number;
  minOrderPrice: number;
  maxDiscount: number | null;
  quantity: number;
  usedQuantity: number;
  startAt: string;
  endAt: string;
}

const INITIAL_VOUCHERS: Voucher[] = [
  { id: '1', code: 'SUMMER20', name: 'Giảm hè 20%', description: null, discountType: 'PERCENT', discountValue: 20, minOrderPrice: 500000, maxDiscount: 200000, quantity: 100, usedQuantity: 43, startAt: '2026-09-01', endAt: '2026-09-30' },
  { id: '2', code: 'NEWUSER50K', name: 'Tân thủ 50k', description: 'Dành cho người dùng mới', discountType: 'FIXED', discountValue: 50000, minOrderPrice: 300000, maxDiscount: null, quantity: 500, usedQuantity: 231, startAt: '2026-08-01', endAt: '2026-12-31' },
  { id: '3', code: 'FLASH10', name: 'Flash 10%', description: null, discountType: 'PERCENT', discountValue: 10, minOrderPrice: 0, maxDiscount: 100000, quantity: 200, usedQuantity: 200, startAt: '2026-09-10', endAt: '2026-09-15' },
  { id: '4', code: 'VIP100K', name: 'VIP 100k', description: null, discountType: 'FIXED', discountValue: 100000, minOrderPrice: 2000000, maxDiscount: null, quantity: 50, usedQuantity: 12, startAt: '2026-10-01', endAt: '2026-10-31' },
];

function getVoucherStatus(v: Voucher): VoucherStatus {
  if (v.usedQuantity >= v.quantity) return 'exhausted';
  const now = new Date();
  if (new Date(v.endAt) < now) return 'expired';
  if (new Date(v.startAt) > now) return 'upcoming';
  return 'active';
}

const STATUS_STYLES: Record<VoucherStatus, { label: string; cls: string }> = {
  active:    { label: 'Hiệu lực', cls: 'bg-emerald-100 text-emerald-700' },
  expired:   { label: 'Hết hạn',  cls: 'bg-red-100 text-red-600' },
  upcoming:  { label: 'Sắp tới',  cls: 'bg-blue-100 text-blue-700' },
  exhausted: { label: 'Đã dùng hết', cls: 'bg-slate-100 text-slate-500' },
};

const FILTER_TABS: { id: VoucherStatus | 'all'; label: string }[] = [
  { id: 'all', label: 'Tất cả' },
  { id: 'active', label: 'Đang hiệu lực' },
  { id: 'upcoming', label: 'Sắp tới' },
  { id: 'expired', label: 'Hết hạn' },
  { id: 'exhausted', label: 'Đã dùng hết' },
];

const EMPTY_FORM: Omit<Voucher, 'id' | 'usedQuantity'> = {
  code: '', name: '', description: null, discountType: 'PERCENT',
  discountValue: 10, minOrderPrice: 0, maxDiscount: null, quantity: 100,
  startAt: '', endAt: '',
};

export default function VouchersPage() {
  const [vouchers, setVouchers] = useState<Voucher[]>(INITIAL_VOUCHERS);
  const [filterTab, setFilterTab] = useState<VoucherStatus | 'all'>('all');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState(EMPTY_FORM);

  const filtered = vouchers.filter((v) =>
    filterTab === 'all' ? true : getVoucherStatus(v) === filterTab,
  );

  const openCreate = () => {
    setEditingId(null);
    setFormData(EMPTY_FORM);
    setShowModal(true);
  };

  const openEdit = (v: Voucher) => {
    setEditingId(v.id);
    setFormData({
      code: v.code, name: v.name, description: v.description,
      discountType: v.discountType, discountValue: v.discountValue,
      minOrderPrice: v.minOrderPrice, maxDiscount: v.maxDiscount,
      quantity: v.quantity, startAt: v.startAt, endAt: v.endAt,
    });
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    const v = vouchers.find((x) => x.id === id);
    if (v && v.usedQuantity > 0) { alert('Không thể xóa voucher đã được sử dụng.'); return; }
    setVouchers((prev) => prev.filter((x) => x.id !== id));
  };

  const handleSave = () => {
    if (!formData.code.trim() || !formData.name.trim()) return;
    if (editingId) {
      setVouchers((prev) => prev.map((v) => v.id === editingId ? { ...v, ...formData } : v));
    } else {
      setVouchers((prev) => [...prev, { ...formData, id: String(Date.now()), usedQuantity: 0 }]);
    }
    setShowModal(false);
  };

  const fmtMoney = (n: number) => n >= 1000 ? `${(n / 1000).toLocaleString('vi-VN')}k` : String(n);
  const fmtDate = (s: string) => s ? new Date(s).toLocaleDateString('vi-VN') : '—';

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <AdminHeader title="Voucher & Khuyến mãi" subtitle="Quản lý mã giảm giá" />
      <div className="flex-1 p-6 space-y-4">
        {/* Toolbar */}
        <div className="flex items-center justify-between">
          <div className="flex gap-1">
            {FILTER_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterTab(tab.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  filterTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <button
            onClick={openCreate}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            <Plus size={14} /> Tạo voucher
          </button>
        </div>

        {/* Table */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                {['Mã', 'Tên', 'Loại & Giá trị', 'Đơn tối thiểu', 'Sử dụng', 'Thời hạn', 'Trạng thái', ''].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-sm text-slate-400">
                    Không có voucher nào
                  </td>
                </tr>
              ) : (
                filtered.map((v) => {
                  const status = getVoucherStatus(v);
                  const pct = Math.min(100, Math.round((v.usedQuantity / v.quantity) * 100));
                  return (
                    <tr key={v.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3">
                        <span className="font-mono text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                          {v.code}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-700">{v.name}</td>
                      <td className="px-4 py-3">
                        {v.discountType === 'PERCENT' ? (
                          <span className="text-xs font-semibold bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                            {v.discountValue}%
                          </span>
                        ) : (
                          <span className="text-xs font-semibold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                            ₫{fmtMoney(v.discountValue)}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {v.minOrderPrice > 0 ? `₫${fmtMoney(v.minOrderPrice)}` : '—'}
                      </td>
                      <td className="px-4 py-3">
                        <div className="space-y-1">
                          <span className="text-xs text-slate-600">{v.usedQuantity}/{v.quantity}</span>
                          <div className="w-20 h-1 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-500">
                        {fmtDate(v.startAt)} → {fmtDate(v.endAt)}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_STYLES[status].cls}`}>
                          {STATUS_STYLES[status].label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button onClick={() => openEdit(v)} className="p-1 text-slate-400 hover:text-blue-600">
                            <Pencil size={14} />
                          </button>
                          <button onClick={() => handleDelete(v.id)} className="p-1 text-slate-400 hover:text-red-600">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h2 className="text-base font-semibold text-slate-800">
                {editingId ? 'Sửa voucher' : 'Tạo voucher mới'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>
            <div className="px-6 py-4 space-y-3 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Mã voucher *</label>
                  <input
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="VD: SUMMER20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Tên *</label>
                  <input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Loại giảm</label>
                  <select
                    value={formData.discountType}
                    onChange={(e) => setFormData({ ...formData, discountType: e.target.value as DiscountType })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="PERCENT">Phần trăm (%)</option>
                    <option value="FIXED">Cố định (₫)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Giá trị {formData.discountType === 'PERCENT' ? '(%)' : '(₫)'}
                  </label>
                  <input
                    type="number"
                    value={formData.discountValue}
                    onChange={(e) => setFormData({ ...formData, discountValue: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Đơn tối thiểu (₫)</label>
                  <input
                    type="number"
                    value={formData.minOrderPrice}
                    onChange={(e) => setFormData({ ...formData, minOrderPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                {formData.discountType === 'PERCENT' && (
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Giảm tối đa (₫)</label>
                    <input
                      type="number"
                      value={formData.maxDiscount ?? ''}
                      onChange={(e) => setFormData({ ...formData, maxDiscount: e.target.value ? Number(e.target.value) : null })}
                      placeholder="Không giới hạn"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Số lượng</label>
                <input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Từ ngày</label>
                  <input
                    type="date"
                    value={formData.startAt}
                    onChange={(e) => setFormData({ ...formData, startAt: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Đến ngày</label>
                  <input
                    type="date"
                    value={formData.endAt}
                    onChange={(e) => setFormData({ ...formData, endAt: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 px-6 py-4 border-t border-slate-100">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm rounded-lg transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleSave}
                disabled={!formData.code.trim() || !formData.name.trim()}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors"
              >
                {editingId ? 'Lưu thay đổi' : 'Tạo voucher'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
