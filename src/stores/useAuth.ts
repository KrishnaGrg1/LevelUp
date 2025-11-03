// stores/useAuth.ts
import { User } from '@/lib/generated';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// stores/useAuth.ts
interface AuthState {
  isAuthenticated: boolean;
  setAuthenticated: (value: boolean) => void;
  user?: User;
  isAdmin: boolean;
  setUser: (user: User) => void;
  setAdminStatus: (isAdmin: boolean) => void;
  logout: () => void;
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
}

const authStore = create<AuthState>()(
  persist(
    set => ({
      isAuthenticated: false,
      setAuthenticated: (value: boolean) => set({ isAuthenticated: value }),
      user: undefined,
      isAdmin: false,
      setUser: (user: User) => {
        set({
          user,
          isAuthenticated: true,
          isAdmin: user.isAdmin === true,
        });
      },
      setAdminStatus: (isAdmin: boolean) => set({ isAdmin }),
      logout: () => set({ user: undefined, isAuthenticated: false, isAdmin: false }),
      _hasHydrated: false,
      setHasHydrated: (state: boolean) => set({ _hasHydrated: state }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => state => {
        state?.setHasHydrated(true);
      },
    },
  ),
);

export default authStore;
