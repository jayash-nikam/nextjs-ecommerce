'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAdminStore } from '@/store/useAdminStore'
import { Loader2 } from 'lucide-react'

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const user = useAdminStore((s) => s.user)

  useEffect(() => {
    if (pathname === '/admin/login') return
    if (!user) {
      router.replace('/admin/login')
    }
  }, [user, pathname, router])

  if (pathname === '/admin/login') return <>{children}</>

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <Loader2 size={32} className="text-indigo-400 animate-spin" />
      </div>
    )
  }

  return <>{children}</>
}
