'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Warehouse,
  Users,
  CreditCard,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Star,
  Tag,
  Ticket,
  UserCog,
  ShieldCheck,
  ClipboardList,
  Contact,
  LogOut,
 } from 'lucide-react';
 import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../store/authStore';

type NavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  roles: readonly string[];
};

type NavGroup = {
  label: string | null;
  items: readonly NavItem[];
};

const NAV_GROUPS: readonly NavGroup[] = [
  {
    label: null,
    items: [
      { href: '/dashboard', label: 'Dashboard',  icon: LayoutDashboard, roles: ['ADMIN', 'MANAGER'] },
      { href: '/reports',   label: 'Báo cáo',    icon: BarChart3,        roles: ['ADMIN', 'MANAGER'] },
    ],
  },
  {
    label: 'Kinh doanh',
    items: [
      { href: '/orders',   label: 'Đơn hàng',  icon: ShoppingBag, roles: ['ADMIN', 'MANAGER'] },
      { href: '/payments', label: 'Thanh toán', icon: CreditCard,  roles: ['ADMIN', 'MANAGER'] },
      { href: '/reviews',  label: 'Đánh giá',  icon: Star,        roles: ['ADMIN', 'MANAGER'] },
    ],
  },
  {
    label: 'Hàng hóa',
    items: [
      { href: '/products',   label: 'Sản phẩm', icon: Package,   roles: ['ADMIN', 'MANAGER'] },
      { href: '/categories', label: 'Danh mục', icon: Tag,       roles: ['ADMIN', 'MANAGER'] },
      { href: '/inventory',  label: 'Kho hàng', icon: Warehouse, roles: ['ADMIN', 'MANAGER'] },
      { href: '/vouchers',   label: 'Voucher',  icon: Ticket,    roles: ['ADMIN', 'MANAGER'] },
    ],
  },
  {
    label: 'Người dùng',
    items: [
      { href: '/customers',        label: 'Khách hàng',              icon: Users,    roles: ['ADMIN', 'MANAGER'] },
      { href: '/user-information', label: 'Thông tin người dùng', icon: Contact, roles: ['ADMIN', 'MANAGER'] },
      { href: '/admin-accounts',   label: 'Quản lí tài khoản',             icon: UserCog,  roles: ['ADMIN'] },
    ],
  },
  {
    label: 'Hệ thống',
    items: [
      { href: '/permissions', label: 'Phân quyền', icon: ShieldCheck,   roles: ['ADMIN'] },
      { href: '/logs',        label: 'Nhật ký',    icon: ClipboardList, roles: ['ADMIN'] },
    ],
  },
];

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .slice(-2)
    .join('')
    .toUpperCase();
}

export function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { role, userName, logout } = useAuthStore();
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('techgo_admin_sidebar');
    if (saved !== null) setCollapsed(saved === 'true');
  }, []);

  const toggleCollapse = () => {
    setCollapsed((prev) => {
      localStorage.setItem('techgo_admin_sidebar', String(!prev));
      return !prev;
    });
  };

  return (
    <aside
      className={`flex flex-col h-screen sticky top-0 bg-slate-900 text-white transition-all duration-200 shrink-0 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Logo */}
      <div className="flex items-center gap-[3px] px-3 h-14 border-b border-slate-700/60 shrink-0 overflow-hidden">
        <img
          src="https://res.cloudinary.com/dgfwcrbyg/image/upload/v1788495477/ChatGPT_Image_11_17_41_4_thg_9_2026_ttogsp.png"
          alt="TechGo Logo"
          className="h-10 w-auto shrink-0"
        />
        {!collapsed && (
          <span className="font-bold text-sm truncate text-white">TechGo Admin</span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-2 overflow-y-auto overflow-x-hidden">
        {NAV_GROUPS.map((group, gi) => {
          const visibleItems = group.items.filter(
            (item) => !role || (item.roles as readonly string[]).includes(role),
          );
          if (visibleItems.length === 0) return null;

          return (
            <div key={gi} className="mb-1">
              {/* Section label */}
              {group.label && !collapsed && (
                <p className="px-4 pt-3 pb-1 text-[10px] font-semibold text-slate-500 uppercase tracking-widest">
                  {group.label}
                </p>
              )}
              {group.label && collapsed && (
                <div className="border-t border-slate-700/40 mx-3 my-2" />
              )}

              {visibleItems.map(({ href, label, icon: Icon }) => {
                const active = pathname === href || pathname.startsWith(href + '/');
                return (
                  <Link
                    key={href}
                    href={href}
                    title={collapsed ? label : undefined}
                    className={`flex items-center gap-3 mx-2 px-3 py-2.5 rounded-lg mb-0.5 text-sm font-medium transition-colors ${
                      active
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <Icon size={18} className="shrink-0" />
                    {!collapsed && <span className="truncate">{label}</span>}
                  </Link>
                );
              })}
            </div>
          );
        })}
      </nav>

      {/* Footer: user card + logout + collapse toggle */}
      <div className="border-t border-slate-700/60 shrink-0">
        {mounted && (
          <Link
            href="/account"
            title={collapsed ? (userName ?? 'Tài khoản') : undefined}
            className="flex items-center gap-3 px-4 py-3 hover:bg-slate-800 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
              {userName ? getInitials(userName) : 'A'}
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <p className="text-sm font-medium text-white truncate">{userName ?? 'Admin'}</p>
                <p className="text-[11px] text-slate-400 truncate">{role ?? ''}</p>
              </div>
            )}
          </Link>
        )}

        {/* Removed duplicate logout from sidebar */}

        {mounted && (
          <button
            onClick={toggleCollapse}
            className="flex items-center gap-2 w-full px-4 py-2.5 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors text-xs border-t border-slate-700/40"
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            {!collapsed && <span>Thu gọn</span>}
          </button>
        )}
      </div>
    </aside>
  );
}
