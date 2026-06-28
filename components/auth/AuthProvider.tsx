'use client'

import { useEffect } from 'react'
import { useAuthStore } from '@/store/useAuthStore'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const hydrate = useAuthStore((s) => s.hydrate)
  const status = useAuthStore((s) => s.status)

  useEffect(() => {
    if (status === 'loading') {
      void hydrate()
    }
  }, [hydrate, status])

  return <>{children}</>
}
