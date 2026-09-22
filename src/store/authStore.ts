import { create } from 'zustand';
import { persist } from 'zustand/middleware';

function getOrCreateDeviceId(): string {
  if (typeof window === 'undefined') return '';
  const key = 'techgo_admin_device_id';
  let id = localStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(key, id);
  }
  return id;
}

interface AuthState {
  isAuthenticated: boolean;
  role: string | null;
  userName: string | null;
  userAvatar: string | null;
  getDeviceId: () => string;
  setAuth: (role: string, name: string, avatar: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      role: null,
      userName: null,
      userAvatar: null,
      getDeviceId: () => getOrCreateDeviceId(),
      setAuth: (role, name, avatar) =>
        set({ isAuthenticated: true, role, userName: name, userAvatar: avatar }),
      logout: () => {
        if (typeof document !== 'undefined') {
          document.cookie = 'admin_session=; path=/; max-age=0';
        }
        set({ isAuthenticated: false, role: null, userName: null, userAvatar: null });
      },
    }),
    {
      name: 'techgo_admin_auth',
      partialize: (s) => ({
        isAuthenticated: s.isAuthenticated,
        role: s.role,
        userName: s.userName,
        userAvatar: s.userAvatar,
      }),
    },
  ),
);
