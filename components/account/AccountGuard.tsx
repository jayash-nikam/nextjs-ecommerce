'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuthStore } from '@/store/useAuthStore'
import { Loader2 } from 'lucide-react'

const PUBLIC_PATHS = [
  '/account/login',
  '/account/register',
  '/account/forgot-password',
]

export function AccountGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const user = useAuthStore((s) => s.user)
  const status = useAuthStore((s) => s.status)

  const isPublic = PUBLIC_PATHS.includes(pathname)
  const isLoading = status === 'loading'

  useEffect(() => {
    if (isLoading) return

    if (!user && !isPublic) {
      router.replace('/account/login')
    } else if (user && isPublic) {
      router.replace('/account')
    }
  }, [isLoading, user, isPublic, router])

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 size={28} className="text-primary animate-spin" />
      </div>
    )
  }

  if (!user && !isPublic) return null
  if (user && isPublic) return null

  return <>{children}</>
}
