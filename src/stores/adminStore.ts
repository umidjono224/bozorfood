import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AdminStore {
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const ADMIN_CREDENTIALS = {
  username: 'Umidjon0224',
  password: 'Umidjon20080224',
};

export const useAdminStore = create<AdminStore>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      login: (username, password) => {
        if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
          set({ isAuthenticated: true });
          return true;
        }
        return false;
      },
      logout: () => set({ isAuthenticated: false }),
    }),
    {
      name: 'bozorfood-admin',
    }
  )
);
