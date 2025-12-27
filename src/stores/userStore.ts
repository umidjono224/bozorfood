import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  phone: string;
  name?: string;
}

interface UserStore {
  user: User | null;
  setUser: (user: User | null) => void;
  isRegistered: boolean;
  setIsRegistered: (value: boolean) => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user, isRegistered: !!user }),
      isRegistered: false,
      setIsRegistered: (value) => set({ isRegistered: value }),
    }),
    {
      name: 'bozorfood-user',
    }
  )
);
