import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../types';

// persist middleware saves auth state to localStorage automatically
// so users stay logged in across page refreshes
interface AuthState {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,

      setAuth: (user, token) => set({ user, token }),

      logout: () => set({ user: null, token: null }),

      // Derived state as a function — keeps logic co-located with the store
      isAuthenticated: () => !!get().token,
    }),
    {
      name: 'auth-storage', // localStorage key
    }
  )
);