'use client'

import { Suspense } from 'react'
import { usePathname } from 'next/navigation'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdmin = pathname.startsWith('/admin')

  if (isAdmin) {
    return <>{children}</>
  }

  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <Suspense fallback={<header className="site-header h-16 border-b border-white/10" />}>
        <Navbar />
      </Suspense>
      <main id="main-content" className="site-main" tabIndex={-1}>
        {children}
      </main>
      <Footer />
    </>
  )
}
