
import { create } from "zustand";
import { persist } from 'zustand/middleware';
interface AuthState {
    isAuthenticated: boolean;
    setAuthenticated: (value: boolean) => void;
    token?: string;
    user?: { id: number; UserName: string; email: string };
    setToken?: (token: string) => void;
    setUser?: (user: {
        id: number;
        UserName: string;
        email: string;
     }) => void;

}

const authStore = create<AuthState>()(
    persist(
        (set) => ({
            isAuthenticated: false,
            setAuthenticated: (value: boolean) => set({ isAuthenticated: value }),
            token: undefined,
            setToken: (token: string) => set({ token }),
            user: undefined,
            setUser: (user: { id: number; UserName: string; email: string }) => set({ user }),
        }),
        {
            name: "auth-storage", // unique name for localStorage
            partialize:state=>({
                isAuthenticated: state.isAuthenticated,
                token: state.token,
                user: state.user,
            })
        }
    )
);

export default authStore;
