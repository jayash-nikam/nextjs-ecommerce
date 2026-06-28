import { create } from 'zustand'
import type { UserPublic } from '@/types/user'

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated'

interface AuthStore {
  user: UserPublic | null
  status: AuthStatus
  setUser: (user: UserPublic | null) => void
  hydrate: () => Promise<void>
  logout: () => Promise<void>
}

let legacyToken: string | null = null

function readLegacyToken(): string | null {
  if (legacyToken !== null) return legacyToken
  if (typeof window === 'undefined') return null

  try {
    const raw = localStorage.getItem('ai-store-auth')
    if (!raw) return null
    const parsed = JSON.parse(raw) as { state?: { token?: string } }
    legacyToken = parsed.state?.token ?? null
    return legacyToken
  } catch {
    return null
  }
}

function clearLegacyAuthStorage(): void {
  legacyToken = null
  if (typeof window !== 'undefined') {
    localStorage.removeItem('ai-store-auth')
  }
}

export const useAuthStore = create<AuthStore>()((set, get) => ({
  user: null,
  status: 'loading',

  setUser: (user) =>
    set({
      user,
      status: user ? 'authenticated' : 'unauthenticated',
    }),

  hydrate: async () => {
    set({ status: 'loading' })

    try {
      const token = readLegacyToken()
      const res = await fetch('/api/auth/session', {
        credentials: 'include',
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      })

      if (res.ok) {
        const data = await res.json()
        clearLegacyAuthStorage()
        set({ user: data.user, status: 'authenticated' })
        return
      }

      clearLegacyAuthStorage()
      set({ user: null, status: 'unauthenticated' })
    } catch {
      set({ user: null, status: 'unauthenticated' })
    }
  },

  logout: async () => {
    const token = readLegacyToken()
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      })
    } catch {
      // Clear local state even if the network call fails.
    }

    clearLegacyAuthStorage()
    set({ user: null, status: 'unauthenticated' })
  },
}))

export function authHeaders(): HeadersInit {
  return { 'Content-Type': 'application/json' }
}

export function authFetch(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Response> {
  return fetch(input, {
    ...init,
    credentials: 'include',
    headers: {
      ...authHeaders(),
      ...init?.headers,
    },
  })
}
