import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { UserPublic } from '@/types/user'

interface AuthStore {
  user: UserPublic | null
  token: string | null
  setAuth: (user: UserPublic, token: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,

      setAuth: (user, token) => set({ user, token }),

      logout: () => set({ user: null, token: null }),
    }),
    {
      name: 'ai-store-auth',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ user: state.user, token: state.token }),
    },
  ),
)

export function authHeaders(token: string | null): HeadersInit {
  if (!token) return { 'Content-Type': 'application/json' }
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }
}
