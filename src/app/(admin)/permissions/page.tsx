'use client';

import { useState } from 'react';
import { Plus, AlertTriangle } from 'lucide-react';
import { AdminHeader } from '../../../components/layout/AdminHeader';

interface Role {
  id: string;
  name: string;
  description: string | null;
}

interface Permission {
  id: string;
  name: string;
  description: string | null;
}

const MOCK_ROLES: Role[] = [
  { id: '1', name: 'ADMIN', description: 'Quản trị toàn hệ thống' },
  { id: '2', name: 'MANAGER', description: 'Quản lý hàng hóa và đơn hàng' },
  { id: '3', name: 'STAFF', description: 'Nhân viên hỗ trợ' },
];

const MOCK_PERMISSIONS: Permission[] = [
  { id: '1', name: 'VIEW_DASHBOARD', description: 'Xem tổng quan' },
  { id: '2', name: 'MANAGE_PRODUCTS', description: 'Quản lý sản phẩm' },
  { id: '3', name: 'MANAGE_ORDERS', description: 'Quản lý đơn hàng' },
  { id: '4', name: 'MANAGE_USERS', description: 'Quản lý người dùng' },
  { id: '5', name: 'MANAGE_VOUCHERS', description: 'Quản lý voucher' },
  { id: '6', name: 'VIEW_REPORTS', description: 'Xem báo cáo' },
  { id: '7', name: 'MANAGE_PERMISSIONS', description: 'Phân quyền (ADMIN only)' },
  { id: '8', name: 'VIEW_LOGS', description: 'Xem nhật ký (ADMIN only)' },
];

const INITIAL_ROLE_PERMISSIONS: Record<string, string[]> = {
  '1': ['1', '2', '3', '4', '5', '6', '7', '8'],
  '2': ['1', '2', '3', '5', '6'],
  '3': ['1', '3'],
};

export default function PermissionsPage() {
  const [roles, setRoles] = useState<Role[]>(MOCK_ROLES);
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);
  const [rolePermissions, setRolePermissions] = useState<Record<string, string[]>>(INITIAL_ROLE_PERMISSIONS);
  const [saved, setSaved] = useState(false);
  const [showAddRole, setShowAddRole] = useState(false);
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleDesc, setNewRoleDesc] = useState('');

  const selectedRole = roles.find((r) => r.id === selectedRoleId) ?? null;
  const currentPerms = selectedRoleId ? (rolePermissions[selectedRoleId] ?? []) : [];

  const togglePermission = (permId: string) => {
    if (!selectedRoleId) return;
    setRolePermissions((prev) => {
      const existing = prev[selectedRoleId] ?? [];
      const next = existing.includes(permId)
        ? existing.filter((p) => p !== permId)
        : [...existing, permId];
      return { ...prev, [selectedRoleId]: next };
    });
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleAddRole = () => {
    if (!newRoleName.trim()) return;
    const newRole: Role = {
      id: String(Date.now()),
      name: newRoleName.trim().toUpperCase(),
      description: newRoleDesc.trim() || null,
    };
    setRoles((prev) => [...prev, newRole]);
    setRolePermissions((prev) => ({ ...prev, [newRole.id]: [] }));
    setNewRoleName('');
    setNewRoleDesc('');
    setShowAddRole(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <AdminHeader title="Phân quyền" subtitle="Quản lý Role và Permission" />
      <div className="flex-1 p-6">
        <div className="flex gap-6">
          {/* Cột trái: Role list */}
          <div className="w-72 shrink-0">
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-slate-700">Danh sách Role</h2>
                <button
                  onClick={() => setShowAddRole(!showAddRole)}
                  className="p-1 text-slate-400 hover:text-blue-600 transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>

              <div className="p-2 bg-amber-50 border-b border-amber-100">
                <div className="flex items-center gap-1.5 text-xs text-amber-700">
                  <AlertTriangle size={12} /> Trang này chỉ dành cho ADMIN
                </div>
              </div>

              {showAddRole && (
                <div className="px-4 py-3 border-b border-slate-100 space-y-2 bg-blue-50">
                  <input
                    value={newRoleName}
                    onChange={(e) => setNewRoleName(e.target.value)}
                    placeholder="Tên role (VD: MODERATOR)"
                    className="w-full px-2 py-1.5 border border-slate-200 rounded text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                  <input
                    value={newRoleDesc}
                    onChange={(e) => setNewRoleDesc(e.target.value)}
                    placeholder="Mô tả (tùy chọn)"
                    className="w-full px-2 py-1.5 border border-slate-200 rounded text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                  <div className="flex gap-1">
                    <button
                      onClick={handleAddRole}
                      disabled={!newRoleName.trim()}
                      className="flex-1 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-medium rounded transition-colors"
                    >
                      Thêm
                    </button>
                    <button
                      onClick={() => setShowAddRole(false)}
                      className="px-2 py-1.5 border border-slate-200 text-slate-500 text-xs rounded hover:bg-slate-50 transition-colors"
                    >
                      Hủy
                    </button>
                  </div>
                </div>
              )}

              <div className="divide-y divide-slate-100">
                {roles.map((role) => (
                  <button
                    key={role.id}
                    onClick={() => setSelectedRoleId(role.id)}
                    className={`w-full text-left px-4 py-3 transition-colors ${
                      selectedRoleId === role.id
                        ? 'bg-blue-50 border-l-2 border-l-blue-600'
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    <p className="text-sm font-semibold text-slate-700">{role.name}</p>
                    {role.description && (
                      <p className="text-xs text-slate-400 mt-0.5">{role.description}</p>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Cột phải: Permission matrix */}
          <div className="flex-1">
            <div className="bg-white border border-slate-200 rounded-xl">
              {!selectedRole ? (
                <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                  <div className="text-4xl mb-3">🔐</div>
                  <p className="text-sm">Chọn một Role để quản lý quyền</p>
                </div>
              ) : (
                <>
                  <div className="px-6 py-4 border-b border-slate-100">
                    <h2 className="text-base font-semibold text-slate-800">
                      Quyền của <span className="text-blue-600">{selectedRole.name}</span>
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">{selectedRole.description}</p>
                  </div>
                  <div className="px-6 py-4">
                    <div className="grid grid-cols-2 gap-3">
                      {MOCK_PERMISSIONS.map((perm) => {
                        const checked = currentPerms.includes(perm.id);
                        return (
                          <label
                            key={perm.id}
                            className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                              checked
                                ? 'border-blue-200 bg-blue-50'
                                : 'border-slate-100 hover:bg-slate-50'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => togglePermission(perm.id)}
                              className="mt-0.5 accent-blue-600 shrink-0"
                            />
                            <div>
                              <p className="text-sm font-medium text-slate-700 font-mono text-xs">
                                {perm.name}
                              </p>
                              <p className="text-xs text-slate-400 mt-0.5">{perm.description}</p>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                  <div className="px-6 py-4 border-t border-slate-100">
                    <button
                      onClick={handleSave}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        saved ? 'bg-emerald-600 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                    >
                      {saved ? '✓ Đã lưu!' : 'Lưu thay đổi'}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
