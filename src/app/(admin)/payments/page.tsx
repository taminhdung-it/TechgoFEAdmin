import { CreditCard, TrendingUp, RefreshCcw, AlertCircle } from 'lucide-react';
import { AdminHeader } from '../../../components/layout/AdminHeader';
import { StatusBadge } from '../../../components/ui/StatusBadge';

const MOCK_PAYMENTS = [
  { id: 'PAY001', orderCode: 'TG-2026091', customer: 'Nguyễn Văn An', amount: 89970000, method: 'MoMo', status: 'paid', txnId: 'MOMO20260917001', date: '2026-09-17 09:23' },
  { id: 'PAY002', orderCode: 'TG-2026090', customer: 'Trần Thị Bình', amount: 33990000, method: 'ATM', status: 'paid', txnId: 'ATM20260916002', date: '2026-09-16 14:05' },
  { id: 'PAY003', orderCode: 'TG-2026089', customer: 'Lê Minh Cường', amount: 13480000, method: 'MoMo', status: 'paid', txnId: 'MOMO20260915003', date: '2026-09-15 11:30' },
  { id: 'PAY004', orderCode: 'TG-2026088', customer: 'Phạm Thị Dung', amount: 55960000, method: 'COD', status: 'paid', txnId: 'COD20260914004', date: '2026-09-14 16:45' },
  { id: 'PAY005', orderCode: 'TG-2026087', customer: 'Hoàng Văn Em', amount: 54990000, method: 'ATM', status: 'refunded', txnId: 'ATM20260913005', date: '2026-09-13 10:12' },
  { id: 'PAY006', orderCode: 'TG-2026086', customer: 'Vũ Thị Phương', amount: 42980000, method: 'MoMo', status: 'paid', txnId: 'MOMO20260912006', date: '2026-09-12 08:55' },
];

const totalRevenue = MOCK_PAYMENTS.filter(p => p.status === 'paid').reduce((s, p) => s + p.amount, 0);
const totalRefunded = MOCK_PAYMENTS.filter(p => p.status === 'refunded').reduce((s, p) => s + p.amount, 0);

const METHOD_ICON: Record<string, string> = { MoMo: '💜', ATM: '🏦', COD: '💵', VNPAY: '🔵' };

export default function PaymentsPage() {
  return (
    <div className="flex flex-col flex-1">
      <AdminHeader title="Payments" subtitle="Quản lý giao dịch thanh toán" />

      <div className="flex-1 p-6 space-y-4">
        {/* Summary */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'Tổng giao dịch', value: MOCK_PAYMENTS.length, icon: CreditCard, bg: 'bg-blue-50', color: 'text-blue-600' },
            { label: 'Doanh thu', value: `₫${(totalRevenue / 1000000).toFixed(1)}M`, icon: TrendingUp, bg: 'bg-emerald-50', color: 'text-emerald-600' },
            { label: 'Hoàn tiền', value: `₫${(totalRefunded / 1000000).toFixed(1)}M`, icon: RefreshCcw, bg: 'bg-orange-50', color: 'text-orange-500' },
            { label: 'Tranh chấp', value: '0', icon: AlertCircle, bg: 'bg-red-50', color: 'text-red-500' },
          ].map((s) => (
            <div key={s.label} className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-3">
              <div className={`p-2.5 rounded-xl ${s.bg}`}><s.icon size={18} className={s.color} /></div>
              <div>
                <p className="text-xl font-bold text-slate-900">{s.value}</p>
                <p className="text-xs text-slate-400">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                {['Mã GD', 'Đơn hàng', 'Khách hàng', 'Số tiền', 'Phương thức', 'Mã TXN', 'Trạng thái', 'Thời gian'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {MOCK_PAYMENTS.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs font-semibold text-slate-600">#{p.id}</td>
                  <td className="px-4 py-3 font-mono text-xs text-slate-500">{p.orderCode}</td>
                  <td className="px-4 py-3 font-medium text-slate-900">{p.customer}</td>
                  <td className="px-4 py-3 font-bold text-slate-900">₫{p.amount.toLocaleString('vi-VN')}</td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1.5 text-sm">
                      <span>{METHOD_ICON[p.method] ?? '💳'}</span>
                      <span className="font-medium text-slate-700">{p.method}</span>
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-[11px] text-slate-400">{p.txnId}</td>
                  <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
                  <td className="px-4 py-3 text-slate-400 text-xs">{p.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
