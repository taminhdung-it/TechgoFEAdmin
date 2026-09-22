'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, LockKeyhole, Pencil, Search, UserRound } from 'lucide-react';
import { AdminHeader } from '../../../components/layout/AdminHeader';
import { MOCK_CUSTOMER_USERS } from '../../../data/customerUsers';

type AccountAccessFilter = 'all';
const PAGE_SIZE = 5;

export default function UserInformationPage() {
  const [search, setSearch] = useState('');
  const [accessFilter, setAccessFilter] = useState<AccountAccessFilter>('all');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredCustomers = MOCK_CUSTOMER_USERS.filter((customer) => {
    const normalizedSearch = search.trim().toLowerCase();
    const matchesSearch =
      normalizedSearch.length === 0 ||
      customer.name.toLowerCase().includes(normalizedSearch) ||
      customer.account.email.toLowerCase().includes(normalizedSearch) ||
      customer.account.username.toLowerCase().includes(normalizedSearch);

    return matchesSearch;
  });

  const totalPages = Math.max(1, Math.ceil(filteredCustomers.length / PAGE_SIZE));
  const page = Math.min(currentPage, totalPages);
  const startIndex = (page - 1) * PAGE_SIZE;
  const visibleCustomers = filteredCustomers.slice(startIndex, startIndex + PAGE_SIZE);
  const changeFilter = (filter: AccountAccessFilter) => {
    setAccessFilter(filter);
    setCurrentPage(1);
  };

  const changeSearch = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

 {/* Pagination Control */}
 <div className="flex justify-center space-x-2 mt-2">
   <button
     className="px-2 py-1 text-sm rounded bg-gray-200 hover:bg-blue-50"
     disabled={page === 1}
     onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
   >Trước</button>
   <span className="text-sm font-medium">Trang {page} / {totalPages}</span>
   <button
     className="px-2 py-1 text-sm rounded bg-gray-200 hover:bg-blue-50"
     disabled={page === totalPages}
     onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
   >Tiếp</button>
 </div> 
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <AdminHeader title="Quản lý thông tin người dùng" subtitle="Quản lý hồ sơ khách hàng" />

      <div className="flex-1 p-6 space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <p className="text-xs text-slate-400">Tổng hồ sơ người dùng</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{MOCK_CUSTOMER_USERS.length}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(event) => changeSearch(event.target.value)}
              placeholder="Tìm tên, email, username..."
              className="w-64 bg-white border border-slate-200 rounded-lg py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Removed duplicate search bar */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                {['Người dùng', 'Username', 'Email', 'Số điện thoại', 'Ngày sinh', 'Giới tính', 'Cập nhật', ''].map((heading) => (
                  <th key={heading} className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {visibleCustomers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center">
                    <UserRound size={28} className="mx-auto mb-2 text-slate-200" />
                    <p className="text-sm text-slate-400">Không tìm thấy hồ sơ người dùng phù hợp.</p>
                  </td>
                </tr>
              ) : (
                visibleCustomers.map((customer) => {
                  const initials = customer.name
                    .split(' ')
                    .map((part) => part[0])
                    .slice(-2)
                    .join('')
                    .toUpperCase();

                  return (
                    <tr key={customer.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 shrink-0 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">
                            {initials}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-slate-800 truncate">{customer.name}</p>
                            <p className="text-xs text-slate-400 truncate">{customer.nickName ?? 'Chưa đặt nickname'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-slate-600">{customer.account.username}</td>
                      <td className="px-4 py-3 text-slate-600">{customer.account.email}</td>
                      <td className="px-4 py-3 text-slate-500">{customer.account.phone ?? '—'}</td>
                      <td className="px-4 py-3 text-slate-500">{customer.bod ? new Date(customer.bod).toLocaleDateString('vi-VN') : '—'}</td>
                      <td className="px-4 py-3 text-slate-500">{customer.sex ?? '—'}</td>
                      <td className="px-4 py-3 text-xs text-slate-400 whitespace-nowrap">
                        {new Date(customer.updatedAt).toLocaleDateString('vi-VN')}
                      </td>
                      <td className="px-4 py-3">
                        <Link
                          href={`/user-information/${customer.id}`}
                          className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg px-2 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 transition-colors"
                        >
                          <Pencil size={13} /> Xem / Sửa
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>
            {filteredCustomers.length === 0
              ? 'Không có kết quả'
              : `${startIndex + 1}–${Math.min(startIndex + PAGE_SIZE, filteredCustomers.length)} của ${filteredCustomers.length} hồ sơ`}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((previous) => Math.max(1, previous - 1))}
              disabled={page === 1}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 disabled:opacity-40 hover:bg-slate-50"
            >
              <ChevronLeft size={14} /> Trước
            </button>
            <span className="px-2 text-slate-500">{page}/{totalPages}</span>
            <button
              onClick={() => setCurrentPage((previous) => Math.min(totalPages, previous + 1))}
              disabled={page === totalPages}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 disabled:opacity-40 hover:bg-slate-50"
            >
              Tiếp <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
