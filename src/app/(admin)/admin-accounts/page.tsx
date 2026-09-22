'use client';

import { useState } from 'react';
import { Search, Plus, Pencil, Lock, Unlock, Shield, ShieldOff, X, AlertTriangle } from 'lucide-react';
import { AdminHeader } from '../../../components/layout/AdminHeader';

type AdminRole = 'ADMIN' | 'MANAGER';

interface AdminAccount {
  id: string;
  name: string;
  username: string;
  email: string;
  phone: string | null;
  role: AdminRole;
  twoFactorActive: boolean;
  lockStatus: boolean;
  createdAt: string;
}

const SELF_ID = '1';

const INITIAL_ACCOUNTS: AdminAccount[] = [
  { id: '1', name: 'Nguyễn Văn Admin', username: 'admin_techgo', email: 'admin@techgo.vn', phone: '0909123456', role: 'ADMIN', twoFactorActive: true, lockStatus: false, createdAt: '2026-01-01' },
  { id: '2', name: 'Trần Thị Manager', username: 'manager_01', email: 'manager1@techgo.vn', phone: '0912345678', role: 'MANAGER', twoFactorActive: false, lockStatus: false, createdAt: '2026-03-15' },
  { id: '4', name: 'Phạm Thị Manager', username: 'manager_02', email: 'manager2@techgo.vn', phone: '0987654321', role: 'MANAGER', twoFactorActive: true, lockStatus: false, createdAt: '2026-06-10' },
];

const ROLE_STYLES: Record<AdminRole, string> = {
  ADMIN:   'bg-blue-100 text-blue-700',
  MANAGER: 'bg-purple-100 text-purple-700',
};

const ROLE_AVATAR_BG: Record<AdminRole, string> = {
  ADMIN:   'bg-blue-600',
  MANAGER: 'bg-purple-600',
};

function getInitials(name: string): string {
  return name.split(' ').map((w) => w[0]).slice(-2).join('').toUpperCase();
}

interface ModalForm {
  name: string;
  username: string;
  email: string;
  phone: string;
  role: AdminRole;
}

const EMPTY_FORM: ModalForm = { name: '', username: '', email: '', phone: '', role: 'MANAGER' };

export default function AdminAccountsPage() {
  const [accounts, setAccounts] = useState<AdminAccount[]>(INITIAL_ACCOUNTS);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<AdminRole | 'all'>('all');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<ModalForm>(EMPTY_FORM);

  const filtered = accounts.filter((a) => {
    const matchSearch =
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.email.toLowerCase().includes(search.toLowerCase()) ||
      a.username.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === 'all' || a.role === roleFilter;
    return matchSearch && matchRole;
  });

  const openCreate = () => {
    setEditingId(null);
    setFormData(EMPTY_FORM);
    setShowModal(true);
  };

  const openEdit = (a: AdminAccount) => {
    setEditingId(a.id);
    setFormData({ name: a.name, username: a.username, email: a.email, phone: a.phone ?? '', role: a.role });
    setShowModal(true);
  };

  const toggleLock = (id: string) => {
    setAccounts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, lockStatus: !a.lockStatus } : a)),
    );
  };

  const handleSave = () => {
    if (!formData.name.trim() || !formData.email.trim()) return;
    if (editingId) {
      setAccounts((prev) =>
        prev.map((a) =>
          a.id === editingId
            ? { ...a, name: formData.name, username: formData.username, email: formData.email, phone: formData.phone || null, role: formData.role }
            : a,
        ),
      );
    } else {
      const newAcc: AdminAccount = {
        id: String(Date.now()),
        name: formData.name,
        username: formData.username,
        email: formData.email,
        phone: formData.phone || null,
        role: formData.role,
        twoFactorActive: false,
        lockStatus: false,
        createdAt: new Date().toISOString().slice(0, 10),
      };
      setAccounts((prev) => [...prev, newAcc]);
    }
    setShowModal(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <AdminHeader title="Tài khoản quản trị" subtitle="Quản lý tài khoản ADMIN và MANAGER" />
      <div className="flex-1 p-6 space-y-4">
        {/* Warning */}
        <div className="flex items-center gap-2 px-4 py-2.5 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-700">
          <AlertTriangle size={15} /> Trang này chỉ dành cho ADMIN.
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm tên, email, username..."
              className="pl-8 pr-3 py-1.5 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 w-56"
            />
          </div>
          <div className="flex gap-1">
            {(['all', 'ADMIN', 'MANAGER'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRoleFilter(r)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  roleFilter === r
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {r === 'all' ? 'Tất cả' : r}
              </button>
            ))}
          </div>
          <button
            onClick={openCreate}
            className="ml-auto flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            <Plus size={14} /> Thêm tài khoản
          </button>
        </div>

        {/* Table */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                {['Tài khoản', 'Username', 'Email', 'SĐT', 'Role', '2FA', 'Trạng thái', 'Ngày tạo', ''].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-10 text-center text-sm text-slate-400">
                    Không tìm thấy tài khoản
                  </td>
                </tr>
              ) : (
                filtered.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 ${ROLE_AVATAR_BG[a.role]}`}
                        >
                          {getInitials(a.name)}
                        </div>
                        <span className="font-medium text-slate-700">{a.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-slate-600">{a.username}</td>
                    <td className="px-4 py-3 text-slate-600">{a.email}</td>
                    <td className="px-4 py-3 text-slate-500">{a.phone ?? '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${ROLE_STYLES[a.role]}`}>
                        {a.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {a.twoFactorActive
                        ? <Shield size={15} className="text-emerald-500" />
                        : <ShieldOff size={15} className="text-slate-300" />
                      }
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                          a.lockStatus ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-700'
                        }`}
                      >
                        {a.lockStatus ? 'Bị khóa' : 'Hoạt động'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-400">
                      {new Date(a.createdAt).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button
                          onClick={() => openEdit(a)}
                          className="p-1 text-slate-400 hover:text-blue-600 transition-colors"
                          title="Sửa"
                        >
                          <Pencil size={14} />
                        </button>
                        {a.id !== SELF_ID && (
                          <button
                            onClick={() => toggleLock(a.id)}
                            className={`p-1 transition-colors ${a.lockStatus ? 'text-slate-400 hover:text-emerald-600' : 'text-slate-400 hover:text-red-600'}`}
                            title={a.lockStatus ? 'Mở khóa' : 'Khóa'}
                          >
                            {a.lockStatus ? <Unlock size={14} /> : <Lock size={14} />}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h2 className="text-base font-semibold text-slate-800">
                {editingId ? 'Sửa tài khoản' : 'Thêm tài khoản mới'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>
            <div className="px-6 py-4 space-y-3">
              {[
                { label: 'Họ và tên *', key: 'name', placeholder: 'Nguyễn Văn A' },
                { label: 'Tên đăng nhập', key: 'username', placeholder: 'user_name' },
                { label: 'Email *', key: 'email', placeholder: 'email@techgo.vn' },
                { label: 'Số điện thoại', key: 'phone', placeholder: '0909xxxxxx' },
              ].map(({ label, key, placeholder }) => (
                <div key={key}>
                  <label className="block text-xs font-medium text-slate-600 mb-1">{label}</label>
                  <input
                    value={formData[key as keyof ModalForm]}
                    onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                    placeholder={placeholder}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              ))}
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as AdminRole })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="ADMIN">ADMIN</option>
                  <option value="MANAGER">MANAGER</option>
                </select>
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
                disabled={!formData.name.trim() || !formData.email.trim()}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors"
              >
                {editingId ? 'Lưu thay đổi' : 'Thêm tài khoản'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
