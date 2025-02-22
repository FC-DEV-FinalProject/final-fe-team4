import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id?: number;
  email?: string;
  name?: string;
  phoneNumber?: string;
}

interface AuthState {
  user: User | null;
  setUser: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      logout: () => set({ user: null }),
    }),
    {
      name: 'auth-storage', // localStorage 키 이름
      partialize: (state) => ({ user: state.user }), // user 정보만 저장
    }
  )
);
