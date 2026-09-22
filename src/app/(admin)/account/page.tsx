'use client';

import { useState } from 'react';
import { Eye, EyeOff, Shield, ShieldOff, Save, Lock, LogOut } from 'lucide-react';
import { AdminHeader } from '../../../components/layout/AdminHeader';
import { useAuthStore } from '../../../store/authStore';
import { useRouter } from 'next/navigation';

type Tab = 'profile' | 'password' | 'security' | 'logout';

const MOCK_ACCOUNT = {
  name: 'Nguyễn Văn Admin',
  nickName: 'Admin',
  bod: '1990-01-15',
  sex: 'Nam',
  email: 'admin@techgo.vn',
  phone: '0909123456',
  username: 'admin_techgo',
};

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .slice(-2)
    .join('')
    .toUpperCase();
}

function ProfileTab() {
  const [form, setForm] = useState(MOCK_ACCOUNT);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Avatar */}
      <div className="flex items-center gap-4">
        <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-2xl font-bold">
          {getInitials(form.name)}
        </div>
        <div>
          <h3 className="font-semibold text-slate-800">{form.name}</h3>
          <p className="text-xs text-slate-400 mt-0.5">@{form.username}</p>
        </div>
      </div>

      {saved && (
        <div className="bg-emerald-50 border-l-4 border-emerald-500 p-4 rounded text-sm text-emerald-800">
          Cập nhật thông tin cá nhân thành công.
        </div>
      )}

      {/* Form fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Họ và tên</label>
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Nickname</label>
          <input
            value={form.nickName}
            onChange={(e) => setForm({ ...form, nickName: e.target.value })}
            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Email</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Số điện thoại</label>
          <input
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Ngày sinh</label>
          <input
            type="date"
            value={form.bod}
            onChange={(e) => setForm({ ...form, bod: e.target.value })}
            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Giới tính</label>
          <select
            value={form.sex}
            onChange={(e) => setForm({ ...form, sex: e.target.value })}
            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Nam">Nam</option>
            <option value="Nữ">Nữ</option>
            <option value="Khác">Khác</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button
          onClick={handleSave}
          className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          <Save size={16} /> Lưu thay đổi
        </button>
      </div>
    </div>
  );
}

function PasswordTab() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpdate = () => {
    setError(null);
    if (!oldPassword || !newPassword || !confirmPassword) {
      setError('Vui lòng điền đầy đủ thông tin mật khẩu.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp.');
      return;
    }
    setSuccess(true);
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-lg">
      {success && (
        <div className="bg-emerald-50 border-l-4 border-emerald-500 p-4 rounded text-sm text-emerald-800">
          Đổi mật khẩu thành công.
        </div>
      )}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Mật khẩu hiện tại</label>
          <div className="relative">
            <input
              type={showOld ? 'text' : 'password'}
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={() => setShowOld(!showOld)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              {showOld ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Mật khẩu mới</label>
          <div className="relative">
            <input
              type={showNew ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Xác nhận mật khẩu mới</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button
          onClick={handleUpdate}
          className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          <Lock size={16} /> Cập nhật mật khẩu
        </button>
      </div>
    </div>
  );
}

function SecurityTab() {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [showDisableNotice, setShowDisableNotice] = useState(false);

  return (
    <div className="space-y-6 max-w-lg">
      <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl bg-slate-50">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-lg ${twoFactorEnabled ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}`}>
            <Shield size={20} />
          </div>
          <div>
            <h4 className="font-semibold text-slate-800 text-sm">Xác thực hai yếu tố (2FA)</h4>
            <p className="text-xs text-slate-500 mt-0.5">
              {twoFactorEnabled ? 'Đang bật qua ứng dụng Authenticator' : 'Đang tắt'}
            </p>
          </div>
        </div>
        {twoFactorEnabled ? (
          <button
            onClick={() => setShowDisableNotice(true)}
            className="px-3 py-1.5 border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-semibold rounded-lg transition-colors"
          >
            Tắt 2FA
          </button>
        ) : (
          <button
            onClick={() => setTwoFactorEnabled(true)}
            className="px-3 py-1.5 bg-blue-600 text-white hover:bg-blue-700 text-xs font-semibold rounded-lg transition-colors"
          >
            Bật 2FA
          </button>
        )}
      </div>

      {showDisableNotice && (
        <div className="p-4 border border-amber-200 rounded-xl bg-amber-50 space-y-2">
          <p className="text-xs text-amber-800 font-medium">
            Không thể tự tắt xác thực hai yếu tố. Vui lòng liên hệ quản trị viên hệ thống để được hỗ trợ.
          </p>
          <div className="flex justify-end">
            <button
              onClick={() => setShowDisableNotice(false)}
              className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-lg"
            >
              Đã hiểu
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const TABS: { id: Tab; label: string; isDanger?: boolean }[] = [
  { id: 'profile', label: 'Thông tin cá nhân' },
  { id: 'password', label: 'Đổi mật khẩu' },
  { id: 'security', label: 'Bảo mật 2FA' },
  { id: 'logout', label: 'Đăng xuất', isDanger: true },
];

export default function AccountPage() {
  const router = useRouter();
  const { logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleTabClick = (tabId: Tab) => {
    if (tabId === 'logout') {
      setShowLogoutModal(true);
    } else {
      setActiveTab(tabId);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <AdminHeader title="Tài khoản của tôi" subtitle="Quản lý thông tin cá nhân và bảo mật" />
      <div className="flex-1 p-6">
        <div className="flex gap-6 max-w-4xl">
          {/* Tab list */}
          <aside className="w-52 shrink-0">
            <nav className="bg-white border border-slate-200 rounded-xl overflow-hidden">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  className={`w-full text-left px-4 py-3 text-sm font-medium border-b border-slate-100 last:border-b-0 transition-colors ${
                    tab.isDanger
                      ? 'text-red-600 hover:bg-red-50 flex items-center gap-2'
                      : activeTab === tab.id
                      ? 'bg-blue-50 text-blue-700 border-l-2 border-l-blue-600'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {tab.isDanger && <LogOut size={16} />}
                  {tab.label}
                </button>
              ))}
            </nav>
          </aside>

          {/* Tab content */}
          <div className="flex-1 bg-white border border-slate-200 rounded-xl p-6">
            <h2 className="text-base font-semibold text-slate-800 mb-5">
              {TABS.find((t) => t.id === activeTab && !t.isDanger)?.label}
            </h2>
            {activeTab === 'profile' && <ProfileTab />}
            {activeTab === 'password' && <PasswordTab />}
            {activeTab === 'security' && <SecurityTab />}
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 space-y-4">
            <h3 className="text-lg font-semibold text-slate-800">Xác nhận đăng xuất</h3>
            <p className="text-sm text-slate-600">Bạn có chắc chắn muốn đăng xuất khỏi hệ thống quản trị không?</p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm rounded-lg transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={() => {
                  setShowLogoutModal(false);
                  logout();
                  router.replace('/login');
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
