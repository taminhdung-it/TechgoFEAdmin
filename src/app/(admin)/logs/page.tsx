'use client';

import { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { AdminHeader } from '../../../components/layout/AdminHeader';

type LogStatus = 'SUCCESS' | 'FAILED';

interface ActivityLogEntry {
  id: string;
  userName: string | null;
  action: string;
  status: LogStatus;
  ipAddress: string | null;
  deviceId: string | null;
  createdAt: string;
}

const MOCK_LOGS: ActivityLogEntry[] = [
  { id: '1', userName: 'Nguyễn Văn Admin', action: 'LOGIN', status: 'SUCCESS', ipAddress: '192.168.1.1', deviceId: 'dev-abc123', createdAt: '2026-09-18T10:30:00' },
  { id: '2', userName: 'Trần Thị Manager', action: 'UPDATE_PRODUCT', status: 'SUCCESS', ipAddress: '10.0.0.5', deviceId: 'dev-def456', createdAt: '2026-09-18T09:45:00' },
  { id: '3', userName: null, action: 'LOGIN', status: 'FAILED', ipAddress: '45.33.32.156', deviceId: null, createdAt: '2026-09-18T09:12:00' },
  { id: '4', userName: 'Nguyễn Văn Admin', action: 'DELETE_REVIEW', status: 'SUCCESS', ipAddress: '192.168.1.1', deviceId: 'dev-abc123', createdAt: '2026-09-17T15:30:00' },
  { id: '5', userName: 'Lê Văn Staff', action: 'EXPORT_INVENTORY', status: 'FAILED', ipAddress: '172.16.0.10', deviceId: 'dev-ghi789', createdAt: '2026-09-17T14:00:00' },
  { id: '6', userName: 'Trần Thị Manager', action: 'CREATE_VOUCHER', status: 'SUCCESS', ipAddress: '10.0.0.5', deviceId: 'dev-def456', createdAt: '2026-09-17T11:20:00' },
  { id: '7', userName: 'Nguyễn Văn Admin', action: 'LOGOUT', status: 'SUCCESS', ipAddress: '192.168.1.1', deviceId: 'dev-abc123', createdAt: '2026-09-16T18:00:00' },
  { id: '8', userName: null, action: 'REGISTER', status: 'FAILED', ipAddress: '1.2.3.4', deviceId: null, createdAt: '2026-09-16T07:30:00' },
];

function fmtDatetime(iso: string): string {
  const d = new Date(iso);
  const time = d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const date = d.toLocaleDateString('vi-VN');
  return `${time} ${date}`;
}

export default function LogsPage() {
  const [statusFilter, setStatusFilter] = useState<LogStatus | 'all'>('all');
  const [actionFilter, setActionFilter] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const filtered = MOCK_LOGS.filter((log) => {
    if (statusFilter !== 'all' && log.status !== statusFilter) return false;
    if (actionFilter && !log.action.toLowerCase().includes(actionFilter.toLowerCase())) return false;
    if (fromDate && new Date(log.createdAt) < new Date(fromDate)) return false;
    if (toDate && new Date(log.createdAt) > new Date(toDate + 'T23:59:59')) return false;
    return true;
  });

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <AdminHeader title="Nhật ký hoạt động" subtitle="Theo dõi mọi hành động trong hệ thống" />
      <div className="flex-1 p-6 space-y-4">
        {/* Warning banner */}
        <div className="flex items-center gap-2 px-4 py-2.5 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-700">
          <AlertTriangle size={15} />
          Trang này chỉ dành cho ADMIN. Dữ liệu nhật ký chỉ đọc, không thể chỉnh sửa.
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex gap-1">
            {([
              { id: 'all', label: 'Tất cả' },
              { id: 'SUCCESS', label: 'Thành công' },
              { id: 'FAILED', label: 'Thất bại' },
            ] as const).map((f) => (
              <button
                key={f.id}
                onClick={() => setStatusFilter(f.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  statusFilter === f.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
          <input
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            placeholder="Lọc theo hành động..."
            className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 w-44"
          />
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span className="text-slate-400 text-sm">→</span>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Table */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                {['Thời gian', 'Hành động', 'Người dùng', 'Trạng thái', 'IP Address', 'Device ID'].map((h) => (
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
                    Không có nhật ký nào
                  </td>
                </tr>
              ) : (
                filtered.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">
                      {fmtDatetime(log.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-mono text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                        {log.action}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {log.userName ?? <span className="italic text-slate-300">Ẩn danh</span>}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                          log.status === 'SUCCESS'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-red-100 text-red-600'
                        }`}
                      >
                        {log.status === 'SUCCESS' ? 'Thành công' : 'Thất bại'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs font-mono text-slate-500">
                      {log.ipAddress ?? '—'}
                    </td>
                    <td className="px-4 py-3 text-xs font-mono text-slate-400 max-w-[96px] truncate">
                      {log.deviceId ?? '—'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination mock */}
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>1–{filtered.length} của {filtered.length} bản ghi</span>
          <div className="flex gap-1">
            <button disabled className="px-3 py-1.5 border border-slate-200 rounded-lg disabled:opacity-40">← Trước</button>
            <button disabled className="px-3 py-1.5 border border-slate-200 rounded-lg disabled:opacity-40">Tiếp →</button>
          </div>
        </div>
      </div>
    </div>
  );
}
