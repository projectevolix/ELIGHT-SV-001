import { create } from "zustand";
import { persist } from "zustand/middleware";

export type UserRole = "ADMIN" | "ORGANIZER" | "COACH" | "PLAYER";

export interface AuthUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  associationId?: number;
}

interface AuthStore {
  // State
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  setUser: (user: AuthUser) => void;
  clearUser: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Helpers
  hasRole: (role: UserRole) => boolean;
  hasAnyRole: (roles: UserRole[]) => boolean;
  isAdmin: () => boolean;
  isOrganizer: () => boolean;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      setUser: (user: AuthUser) =>
        set({
          user,
          isAuthenticated: true,
          error: null,
        }),

      clearUser: () =>
        set({
          user: null,
          isAuthenticated: false,
          error: null,
        }),

      setLoading: (isLoading: boolean) => set({ isLoading }),

      setError: (error: string | null) => set({ error }),

      // Helpers
      hasRole: (role: UserRole) => {
        const { user } = get();
        return user?.role === role;
      },

      hasAnyRole: (roles: UserRole[]) => {
        const { user } = get();
        return user ? roles.includes(user.role) : false;
      },

      isAdmin: () => {
        const { user } = get();
        return user?.role === "ADMIN";
      },

      isOrganizer: () => {
        const { user } = get();
        return user?.role === "ORGANIZER";
      },
    }),
    {
      name: "auth-store",
      // Partial persistence - don't persist isLoading and error
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
