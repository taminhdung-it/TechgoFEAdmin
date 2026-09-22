'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, CalendarDays, LockKeyhole, Save, UserRound } from 'lucide-react';
import { MOCK_CUSTOMER_USERS, type CustomerGender } from '../../../../data/customerUsers';
import { AdminHeader } from '../../../../components/layout/AdminHeader';
import { useAuthStore } from '../../../../store/authStore';

export default function CustomerProfilePage() {
  const { role } = useAuthStore();
  const isStaffOrManager = role === 'MANAGER' || role === 'STAFF';

  const params = useParams<{ userId: string }>();
  const customer = MOCK_CUSTOMER_USERS.find((item) => item.id === params.userId);
  const [form, setForm] = useState({
    name: customer?.name ?? '',
    nickName: customer?.nickName ?? '',
    avatar: customer?.avatar ?? '',
    bod: customer?.bod ?? '',
    sex: customer?.sex ?? '',
  });
  const [saved, setSaved] = useState(false);

  if (!customer) {
    return (
      <div className="flex flex-col min-h-screen bg-slate-50">
        <AdminHeader title="Không tìm thấy người dùng" />
        <div className="flex flex-1 flex-col items-center justify-center gap-3">
          <UserRound size={36} className="text-slate-300" />
          <p className="text-sm text-slate-500">Hồ sơ khách hàng không tồn tại hoặc đã bị xóa.</p>
          <Link href="/user-information" className="text-sm font-medium text-blue-600 hover:text-blue-700">
            Quay lại danh sách
          </Link>
        </div>
      </div>
    );
  }

  const initials = customer.name
    .split(' ')
    .map((part) => part[0])
    .slice(-2)
    .join('')
    .toUpperCase();

  const submitProfile = () => {
    if (isStaffOrManager) return;
    const normalizedName = form.name.trim();
    if (normalizedName.length === 0 || normalizedName === customer?.name) {
      alert("Tên không thay đổi hoặc bỏ trống.");
      return;
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <AdminHeader title="Chi tiết hồ sơ khách hàng" subtitle={`ID: ${customer.id}`} />

      <div className="flex-1 p-6 space-y-6 max-w-5xl w-full">
        {/* Alert/Updated marks */}
        {saved && (
          <section role="status" className="bg-green-50 border-l-4 border-green-400 p-4 rounded">
            <p className="text-sm text-green-800">✅ Lưu hồ sơ thành công.</p>
          </section>
        )}
        <Link href="/user-information" className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors">
          <ArrowLeft size={15} /> Quay lại danh sách hồ sơ
        </Link>

        <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5">
          <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-lg font-bold shrink-0">
            {initials}
          </div>
          <div className="min-w-0">
            <h2 className="text-lg font-semibold text-slate-900">{customer.name}</h2>
            <p className="text-sm text-slate-400">@{customer.account.username}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
          <section className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-slate-800">Thông tin cá nhân</h3>
                <p className="mt-0.5 text-xs text-slate-400">Các trường thuộc hồ sơ User của khách hàng.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Họ và tên <span className="text-red-500">*</span>
                </label>
                <input
                  value={form.name}
                  disabled={isStaffOrManager}
                  onChange={(event) => setForm({ ...form, name: event.target.value })}
                  className={`w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${isStaffOrManager ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : 'bg-white'}`}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Nickname</label>
                <input
                  value={form.nickName}
                  disabled={isStaffOrManager}
                  onChange={(event) => setForm({ ...form, nickName: event.target.value })}
                  placeholder="Chưa đặt nickname"
                  className={`w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${isStaffOrManager ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : 'bg-white'}`}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Ảnh đại diện</label>
                <input
                  value={form.avatar}
                  disabled={isStaffOrManager}
                  onChange={(event) => setForm({ ...form, avatar: event.target.value })}
                  placeholder="URL ảnh đại diện (tùy chọn)"
                  className={`w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${isStaffOrManager ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : 'bg-white'}`}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Ngày sinh</label>
                <div className="relative">
                  <CalendarDays size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <input
                    type="date"
                    value={form.bod}
                    disabled={isStaffOrManager}
                    onChange={(event) => setForm({ ...form, bod: event.target.value })}
                    className={`w-full rounded-lg border border-slate-200 py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${isStaffOrManager ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : 'bg-white'}`}
                  />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Giới tính</label>
                <select
                  value={form.sex}
                  disabled={isStaffOrManager}
                  onChange={(event) => setForm({ ...form, sex: event.target.value as CustomerGender | '' })}
                  className={`w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${isStaffOrManager ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : 'bg-white'}`}
                >
                  <option value="">Chưa cập nhật</option>
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                  <option value="Khác">Khác</option>
                </select>
              </div>
            </div>

            {!isStaffOrManager && (
              <div className="mt-5 flex items-center gap-3 border-t border-slate-100 pt-4">
                <button
                  onClick={submitProfile}
                  disabled={form.name.trim().length === 0}
                  className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors disabled:opacity-50 ${
                    saved ? 'bg-emerald-600' : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  <Save size={15} /> {saved ? 'Đã cập nhật giao diện' : 'Lưu thay đổi'}
                </button>
                <p className="text-xs text-slate-400">API chưa kết nối; thao tác này chỉ xác nhận luồng giao diện.</p>
              </div>
            )}
            {isStaffOrManager && (
              <div className="mt-5 border-t border-slate-100 pt-4">
                <p className="text-xs text-amber-700 bg-amber-50 p-3 rounded-lg border border-amber-200 font-medium">
                  Chế độ chỉ xem: Tài khoản cấp độ Nhân viên / Quản lý chỉ có quyền xem thông tin người dùng, không được phép chỉnh sửa.
                </p>
              </div>
            )}
          </section>

          <aside className="rounded-xl border border-slate-200 bg-white p-5 h-fit">
            <h3 className="font-semibold text-slate-800">Thông tin tài khoản</h3>
            <p className="mt-0.5 text-xs text-slate-400">Chỉ đọc — thuộc entity Account.</p>
            <dl className="mt-5 space-y-4 text-sm">
              <div>
                <dt className="text-xs text-slate-400">Tên đăng nhập</dt>
                <dd className="mt-1 font-mono text-slate-700">{customer.account.username}</dd>
              </div>
              <div>
                <dt className="text-xs text-slate-400">Email</dt>
                <dd className="mt-1 text-slate-700 break-all">{customer.account.email}</dd>
              </div>
              <div>
                <dt className="text-xs text-slate-400">Số điện thoại</dt>
                <dd className="mt-1 text-slate-700">{customer.account.phone ?? 'Chưa cập nhật'}</dd>
              </div>
              <div>
                <dt className="text-xs text-slate-400">Ngày tham gia</dt>
                <dd className="mt-1 text-slate-700">{new Date(customer.account.createdAt).toLocaleDateString('vi-VN')}</dd>
              </div>
              <div>
                <dt className="text-xs text-slate-400">Cập nhật hồ sơ gần nhất</dt>
                <dd className="mt-1 text-slate-700">{new Date(customer.updatedAt).toLocaleDateString('vi-VN')}</dd>
              </div>
            </dl>
          </aside>
        </div>
      </div>
    </div>
  );
}
