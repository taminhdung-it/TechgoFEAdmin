'use client';

import { useState, Fragment } from 'react';
import { Search, ShoppingBag, ChevronDown } from 'lucide-react';
import { AdminHeader } from '../../../components/layout/AdminHeader';
import { StatusBadge } from '../../../components/ui/StatusBadge';

type OrderStatus = 'pending' | 'confirmed' | 'shipping' | 'delivered' | 'cancelled';

interface Order {
  id: string;
  code: string;
  customerName: string;
  customerEmail: string;
  itemCount: number;
  total: number;
  status: OrderStatus;
  paymentMethod: string;
  createdAt: string;
}

const MOCK_ORDERS: Order[] = [
  { id: '1', code: 'TG-2026091', customerName: 'Nguyễn Văn An', customerEmail: 'nguyenvanan@gmail.com', itemCount: 3, total: 89970000, status: 'pending', paymentMethod: 'MoMo', createdAt: '2026-09-17' },
  { id: '2', code: 'TG-2026090', customerName: 'Trần Thị Bình', customerEmail: 'tranthib@gmail.com', itemCount: 1, total: 33990000, status: 'confirmed', paymentMethod: 'ATM', createdAt: '2026-09-16' },
  { id: '3', code: 'TG-2026089', customerName: 'Lê Minh Cường', customerEmail: 'leminc@gmail.com', itemCount: 2, total: 13480000, status: 'shipping', paymentMethod: 'MoMo', createdAt: '2026-09-15' },
  { id: '4', code: 'TG-2026088', customerName: 'Phạm Thị Dung', customerEmail: 'phamtd@gmail.com', itemCount: 4, total: 55960000, status: 'delivered', paymentMethod: 'COD', createdAt: '2026-09-14' },
  { id: '5', code: 'TG-2026087', customerName: 'Hoàng Văn Em', customerEmail: 'hoangve@gmail.com', itemCount: 1, total: 54990000, status: 'cancelled', paymentMethod: 'ATM', createdAt: '2026-09-13' },
  { id: '6', code: 'TG-2026086', customerName: 'Vũ Thị Phương', customerEmail: 'vuthiphuong@gmail.com', itemCount: 2, total: 42980000, status: 'delivered', paymentMethod: 'MoMo', createdAt: '2026-09-12' },
  { id: '7', code: 'TG-2026085', customerName: 'Đặng Minh Quân', customerEmail: 'dangmq@gmail.com', itemCount: 1, total: 8490000, status: 'delivered', paymentMethod: 'ATM', createdAt: '2026-09-11' },
  { id: '8', code: 'TG-2026084', customerName: 'Bùi Thị Hoa', customerEmail: 'buithh@gmail.com', itemCount: 3, total: 71970000, status: 'shipping', paymentMethod: 'MoMo', createdAt: '2026-09-10' },
];

const TABS: { label: string; value: string }[] = [
  { label: 'Tất cả', value: '' },
  { label: 'Chờ xử lý', value: 'pending' },
  { label: 'Đã xác nhận', value: 'confirmed' },
  { label: 'Đang giao', value: 'shipping' },
  { label: 'Đã giao', value: 'delivered' },
  { label: 'Đã huỷ', value: 'cancelled' },
];

const NEXT_STATUS: Partial<Record<OrderStatus, { label: string; next: OrderStatus }>> = {
  pending:   { label: 'Xác nhận', next: 'confirmed' },
  confirmed: { label: 'Giao hàng', next: 'shipping' },
  shipping:  { label: 'Đã giao',  next: 'delivered' },
};

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState('');
  const [search, setSearch] = useState('');
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = orders.filter((o) => {
    const matchTab = !activeTab || o.status === activeTab;
    const matchSearch =
      o.code.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  const counts = TABS.reduce<Record<string, number>>((acc, tab) => {
    acc[tab.value] = tab.value
      ? orders.filter((o) => o.status === tab.value).length
      : orders.length;
    return acc;
  }, {});

  const handleAdvance = (orderId: string, nextStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: nextStatus } : o)),
    );
  };

  return (
    <div className="flex flex-col flex-1">
      <AdminHeader title="Orders" subtitle={`${orders.length} đơn hàng`} />

      <div className="flex-1 p-6 space-y-4">
        {/* Status tabs */}
        <div className="flex gap-1 bg-white border border-slate-200 p-1 rounded-xl w-fit">
          {TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => { setActiveTab(tab.value); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                activeTab === tab.value
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
              }`}
            >
              {tab.label}
              <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold ${
                activeTab === tab.value ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-500'
              }`}>
                {counts[tab.value]}
              </span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm mã đơn, khách hàng..."
            className="pl-8 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full bg-white"
          />
        </div>

        {/* Table */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Mã đơn</th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Khách hàng</th>
                <th className="text-center px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wide">SP</th>
                <th className="text-right px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Tổng tiền</th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wide">TT Thanh toán</th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Trạng thái</th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Ngày đặt</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-sm text-slate-400">
                    <ShoppingBag size={32} className="mx-auto mb-2 text-slate-200" />
                    Không có đơn hàng nào
                  </td>
                </tr>
              ) : (
                filtered.map((o) => {
                  const advance = NEXT_STATUS[o.status];
                  return (
                    <Fragment key={o.id}>
                      <tr
                        className="hover:bg-slate-50 transition-colors cursor-pointer"
                        onClick={() => setExpandedId(expandedId === o.id ? null : o.id)}
                      >
                        <td className="px-4 py-3 font-mono text-xs text-slate-600 font-semibold">
                          #{o.code}
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-medium text-slate-900 text-sm">{o.customerName}</p>
                          <p className="text-[11px] text-slate-400">{o.customerEmail}</p>
                        </td>
                        <td className="px-4 py-3 text-center text-slate-500 text-sm">{o.itemCount}</td>
                        <td className="px-4 py-3 text-right font-semibold text-slate-900 text-sm">
                          ₫{o.total.toLocaleString('vi-VN')}
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium">
                            {o.paymentMethod}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge status={o.status} />
                        </td>
                        <td className="px-4 py-3 text-slate-400 text-xs">
                          {new Date(o.createdAt).toLocaleDateString('vi-VN')}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            {advance && (
                              <button
                                onClick={(e) => { e.stopPropagation(); handleAdvance(o.id, advance.next); }}
                                className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors font-medium whitespace-nowrap"
                              >
                                → {advance.label}
                              </button>
                            )}
                            <ChevronDown
                              size={14}
                              className={`text-slate-300 transition-transform ${expandedId === o.id ? 'rotate-180' : ''}`}
                            />
                          </div>
                        </td>
                      </tr>
                      {expandedId === o.id && (
                        <tr className="bg-blue-50/50">
                          <td colSpan={8} className="px-6 py-3">
                            <div className="flex gap-6 text-xs text-slate-600">
                              <div>
                                <span className="font-semibold text-slate-500">Mã đơn:</span>{' '}
                                <span className="font-mono">{o.code}</span>
                              </div>
                              <div>
                                <span className="font-semibold text-slate-500">Khách hàng:</span>{' '}
                                {o.customerName} · {o.customerEmail}
                              </div>
                              <div>
                                <span className="font-semibold text-slate-500">Thanh toán:</span>{' '}
                                {o.paymentMethod}
                              </div>
                              <div>
                                <span className="font-semibold text-slate-500">Tổng:</span>{' '}
                                ₫{o.total.toLocaleString('vi-VN')}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <p className="text-xs text-slate-400">
          Hiển thị {filtered.length} / {orders.length} đơn hàng
        </p>
      </div>
    </div>
  );
}
