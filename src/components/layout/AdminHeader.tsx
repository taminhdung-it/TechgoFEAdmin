'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, LogOut } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
}

export function AdminHeader({ title, subtitle }: AdminHeaderProps) {
  const router = useRouter();
  const { userName, role, logout } = useAuthStore();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState<string | null>(null);

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    setLogoutError(null);
    try {
      // Gọi API logout khi có backend; hiện tại clear local state
      logout();
      router.replace('/login');
    } catch {
      setLogoutError('Đăng xuất thất bại. Vui lòng thử lại.');
    } finally {
      setIsLoggingOut(false);
    }
  };

  const initials = userName
    ? userName.split(' ').map((w) => w[0]).slice(-2).join('').toUpperCase()
    : 'AD';

  return (
    <header className="sticky top-0 z-20 bg-white border-b border-slate-200 px-6 h-14 flex items-center justify-between shrink-0">
      {/* Page title */}
      <div>
        <h1 className="font-bold text-slate-900 text-base leading-tight">{title}</h1>
        {subtitle && <p className="text-[11px] text-slate-400 leading-none mt-0.5">{subtitle}</p>}
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2">
        {logoutError && (
          <span className="text-xs text-red-500 mr-1">{logoutError}</span>
        )}

        {/* Notification bell */}
        <button className="relative p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
        </button>
      </div>
    </header>
  );
}
