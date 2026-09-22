import {
  TrendingUp,
  ShoppingBag,
  Users,
  Package,
  AlertTriangle,
} from 'lucide-react';
import { AdminHeader } from '../../../components/layout/AdminHeader';
import { KpiCard } from '../../../components/ui/KpiCard';
import { RevenueChart } from '../../../components/dashboard/RevenueChart';

const KPI_ITEMS = [
  {
    label: 'Total Revenue',
    value: '₫1,284.5M',
    sub: 'Tháng này',
    trend: { value: '12.4%', positive: true },
    icon: TrendingUp,
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-600',
  },
  {
    label: 'Total Orders',
    value: '12,482',
    sub: 'Tháng này',
    trend: { value: '8.1%', positive: true },
    icon: ShoppingBag,
    iconBg: 'bg-purple-50',
    iconColor: 'text-purple-600',
  },
  {
    label: 'Customers',
    value: '8,291',
    sub: 'Đã đăng ký',
    trend: { value: '15.3%', positive: true },
    icon: Users,
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
  },
  {
    label: 'Products',
    value: '1,284',
    sub: 'Đang hoạt động',
    icon: Package,
    iconBg: 'bg-orange-50',
    iconColor: 'text-orange-500',
  },
  {
    label: 'Low Stock',
    value: '3',
    sub: 'Cần nhập thêm',
    icon: AlertTriangle,
    iconBg: 'bg-red-50',
    iconColor: 'text-red-500',
  },
];

export default function DashboardPage() {
  const now = new Date();
  const dateStr = now.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="flex flex-col flex-1">
      <AdminHeader title="Dashboard" subtitle={dateStr} />

      <div className="flex-1 p-6 space-y-5">
        {/* KPI Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5 gap-4">
          {KPI_ITEMS.map((item) => (
            <KpiCard key={item.label} {...item} />
          ))}
        </div>

        {/* Revenue Chart */}
        <RevenueChart />

        {/* Bottom row: Recent activity summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Top products placeholder */}
          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <h3 className="font-semibold text-slate-900 text-sm mb-4">
              Sản phẩm bán chạy
            </h3>
            <div className="space-y-3">
              {[
                { name: 'iPhone 15 Pro Max', sold: 342, revenue: '₫11.6B' },
                { name: 'MacBook Pro M3', sold: 218, revenue: '₫12.0B' },
                { name: 'Samsung Galaxy S24', sold: 195, revenue: '₫5.8B' },
                { name: 'AirPods Pro 2', sold: 487, revenue: '₫3.4B' },
                { name: 'iPad Pro M4', sold: 156, revenue: '₫4.5B' },
              ].map((p, i) => (
                <div key={p.name} className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-300 w-4">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-slate-700 truncate">
                      {p.name}
                    </p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <div
                        className="h-1 bg-blue-500 rounded-full"
                        style={{ width: `${(p.sold / 500) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs font-semibold text-slate-900">
                      {p.revenue}
                    </p>
                    <p className="text-[10px] text-slate-400">{p.sold} sold</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent orders placeholder */}
          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <h3 className="font-semibold text-slate-900 text-sm mb-4">
              Đơn hàng gần đây
            </h3>
            <div className="space-y-2.5">
              {[
                { code: 'TG-2026091', name: 'Nguyễn Văn An', amount: '₫89.9M', status: 'pending' },
                { code: 'TG-2026090', name: 'Trần Thị Bình', amount: '₫33.9M', status: 'confirmed' },
                { code: 'TG-2026089', name: 'Lê Minh Cường', amount: '₫13.4M', status: 'shipping' },
                { code: 'TG-2026088', name: 'Phạm Thị Dung', amount: '₫55.9M', status: 'delivered' },
                { code: 'TG-2026087', name: 'Hoàng Văn Em', amount: '₫54.9M', status: 'cancelled' },
              ].map((o) => (
                <div
                  key={o.code}
                  className="flex items-center justify-between py-1.5 border-b border-slate-50 last:border-0"
                >
                  <div>
                    <p className="text-xs font-medium text-slate-700">
                      {o.name}
                    </p>
                    <p className="text-[10px] text-slate-400 font-mono">
                      #{o.code}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-semibold text-slate-900">
                      {o.amount}
                    </p>
                    <span
                      className={`text-[10px] font-semibold ${
                        o.status === 'delivered'
                          ? 'text-emerald-600'
                          : o.status === 'cancelled'
                          ? 'text-red-500'
                          : o.status === 'shipping'
                          ? 'text-purple-600'
                          : o.status === 'confirmed'
                          ? 'text-blue-600'
                          : 'text-amber-600'
                      }`}
                    >
                      {o.status === 'pending'
                        ? 'Chờ xử lý'
                        : o.status === 'confirmed'
                        ? 'Xác nhận'
                        : o.status === 'shipping'
                        ? 'Đang giao'
                        : o.status === 'delivered'
                        ? 'Đã giao'
                        : 'Đã huỷ'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
