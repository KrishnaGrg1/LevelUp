// stores/useAuth.ts
import { User } from '@/lib/generated';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// stores/useAuth.ts
interface AuthState {
  isAuthenticated: boolean;
  setAuthenticated: (value: boolean) => void;
  user?: User;
  setUser: (user: User) => void;
  logout: () => void;
}

const authStore = create<AuthState>()(
  persist(
    set => ({
      isAuthenticated: false,
      setAuthenticated: (value: boolean) => set({ isAuthenticated: value }),
      user: undefined,
      setUser: (user: User) => set({ user }), // ← Set both user and authenticated
      logout: () => set({ user: undefined, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage', // unique name for localStorage
    },
  ),
);

export default authStore;
