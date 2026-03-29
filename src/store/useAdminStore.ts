import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AdminState {
  isAdmin: boolean;
  login: (password: string) => boolean;
  logout: () => void;
}

const ADMIN_PASSWORD = import.meta.env?.VITE_ADMIN_PASSWORD || 'admin123';

export const useAdminStore = create<AdminState>()(
  persist(
    (set) => ({
      isAdmin: false,
      login: (password: string) => {
        if (password === ADMIN_PASSWORD) {
          set({ isAdmin: true });
          return true;
        }
        return false;
      },
      logout: () => set({ isAdmin: false }),
    }),
    {
      name: 'eduguide-admin-storage',
    }
  )
);
