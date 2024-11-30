import { create } from 'zustand';

interface AuthState {
  user: { id: number; email: string; name: string } | null;
  setUser: (user: { id: number; email: string; name: string } | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),
}));