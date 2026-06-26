'use client'

import { usePathname } from 'next/navigation'
import { AccountGuard } from '@/components/account/AccountGuard'
import { AccountSidebar } from '@/components/account/AccountSidebar'

const AUTH_PAGES = ['/account/login', '/account/register']

export function AccountLayoutShell({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isAuthPage = AUTH_PAGES.includes(pathname)

  return (
    <AccountGuard>
      {isAuthPage ? (
        <div className="animate-fade-in-up py-4">{children}</div>
      ) : (
        <div className="animate-fade-in-up">
          <div className="grid lg:grid-cols-[260px_1fr] gap-8 items-start">
            <AccountSidebar />
            <div className="min-w-0">{children}</div>
          </div>
        </div>
      )}
    </AccountGuard>
  )
}
