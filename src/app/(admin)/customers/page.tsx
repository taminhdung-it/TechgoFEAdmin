'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ExternalLink, Mail, Search, ShoppingBag, Users } from 'lucide-react';
import { AdminHeader } from '../../../components/layout/AdminHeader';
import { MOCK_CUSTOMER_USERS } from '../../../data/customerUsers';

interface CustomerCommerceSummary {
  userId: string;
  orders: number;
  totalSpent: number;
}

const CUSTOMER_COMMERCE: CustomerCommerceSummary[] = [
  { userId: '1', orders: 5, totalSpent: 245900000 },
  { userId: '2', orders: 3, totalSpent: 67480000 },
  { userId: '3', orders: 8, totalSpent: 334920000 },
  { userId: '4', orders: 2, totalSpent: 89980000 },
  { userId: '5', orders: 1, totalSpent: 54990000 },
  { userId: '6', orders: 12, totalSpent: 512860000 },
  { userId: '7', orders: 4, totalSpent: 98460000 },
  { userId: '8', orders: 7, totalSpent: 284430000 },
];

type AccountAccessFilter = 'all' | 'unlocked' | 'locked';

export default function CustomersPage() {
  const [search, setSearch] = useState('');
  const [accessFilter, setAccessFilter] = useState<AccountAccessFilter>('all');

  const customerRows = CUSTOMER_COMMERCE.flatMap((commerce) => {
    const user = MOCK_CUSTOMER_USERS.find((candidate) => candidate.id === commerce.userId);
    return user ? [{ user, commerce }] : [];
  });

  const filteredCustomers = customerRows.filter(({ user }: { user: { name: string; account: { email: string; lockStatus: boolean } } }) => {
    const normalizedSearch = search.trim().toLowerCase();
    const matchesSearch =
      normalizedSearch.length === 0 ||
      user.name.toLowerCase().includes(normalizedSearch) ||
      user.account.email.toLowerCase().includes(normalizedSearch);
    const matchesAccess =
      accessFilter === 'all' ||
      (accessFilter === 'locked' ? user.account.lockStatus : !user.account.lockStatus);

    return matchesSearch && matchesAccess;
  });

  const totalSpent = CUSTOMER_COMMERCE.reduce((sum, customer) => sum + customer.totalSpent, 0);
  const totalOrders = CUSTOMER_COMMERCE.reduce((sum, customer) => sum + customer.orders, 0);

  return (
    <div className="flex flex-col flex-1 bg-slate-50">
      <AdminHeader title="Khách hàng" subtitle={`${CUSTOMER_COMMERCE.length} khách hàng đã đăng ký`} />

      <div className="flex-1 p-6 space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4">
            <div className="rounded-xl bg-blue-50 p-2.5"><Users size={18} className="text-blue-600" /></div>
            <div>
              <p className="text-xl font-bold text-slate-900">{CUSTOMER_COMMERCE.length}</p>
              <p className="text-xs text-slate-400">Tổng khách hàng</p>
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4">
            <div className="rounded-xl bg-purple-50 p-2.5"><ShoppingBag size={18} className="text-purple-600" /></div>
            <div>
              <p className="text-xl font-bold text-slate-900">{totalOrders}</p>
              <p className="text-xs text-slate-400">Tổng đơn hàng</p>
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4">
            <div className="rounded-xl bg-emerald-50 p-2.5"><Mail size={18} className="text-emerald-600" /></div>
            <div>
              <p className="text-xl font-bold text-slate-900">₫{(totalSpent / 1000000).toFixed(0)}M</p>
              <p className="text-xs text-slate-400">Tổng chi tiêu</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Tìm tên, email..."
              className="w-60 rounded-lg border border-slate-200 bg-white py-2 pl-8 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-1">
            {([
              { id: 'all', label: 'Tất cả' },
              { id: 'unlocked', label: 'Bình thường' },
              { id: 'locked', label: 'Bị khóa' },
            ] as const).map((filter) => (
              <button
                key={filter.id}
                onClick={() => setAccessFilter(filter.id)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  accessFilter === filter.id
                    ? 'bg-blue-600 text-white'
                    : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                {['Khách hàng', 'SĐT', 'Đơn hàng', 'Tổng chi tiêu', 'Trạng thái tài khoản', 'Tham gia', ''].map((heading) => (
                  <th key={heading} className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-sm text-slate-400">Không có khách hàng phù hợp.</td>
                </tr>
              ) : (
                filteredCustomers.map(({ user, commerce }) => {
                  const initials = user.name
                    .split(' ')
                    .map((part) => part[0])
                    .slice(-2)
                    .join('')
                    .toUpperCase();

                  return (
                    <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600">
                            {initials}
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">{user.name}</p>
                            <p className="text-[11px] text-slate-400">{user.account.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-500">{user.account.phone ?? '—'}</td>
                      <td className="px-4 py-3 text-center font-semibold text-slate-700">{commerce.orders}</td>
                      <td className="px-4 py-3 text-right font-semibold text-slate-900">₫{(commerce.totalSpent / 1000000).toFixed(1)}M</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${
                          user.account.lockStatus
                            ? 'bg-red-100 text-red-700'
                            : 'bg-emerald-100 text-emerald-700'
                        }`}>
                          {user.account.lockStatus ? 'Bị khóa' : 'Bình thường'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-400">{new Date(user.createdAt).toLocaleDateString('vi-VN')}</td>
                      <td className="px-4 py-3">
                        <Link
                          href={`/user-information/${user.id}`}
                          className="inline-flex items-center gap-1 whitespace-nowrap rounded-lg px-2 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50"
                        >
                          Thông tin <ExternalLink size={13} />
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
