'use client'

import Link from 'next/link'
import { getUserContact } from '@/lib/user/display'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  LogOut,
  Zap,
  Menu,
  X,
} from 'lucide-react'
import { useState } from 'react'
import { useAdminStore } from '@/store/useAdminStore'
import { AdminGuard } from '@/components/admin/AdminGuard'
import { BRAND_NAME } from '@/lib/brand'

const links = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { href: '/admin/users', label: 'Customers', icon: Users },
]

const PAGE_TITLES: Record<string, string> = {
  admin: 'Dashboard',
  products: 'Products',
  orders: 'Orders',
  users: 'Customers',
  login: 'Sign In',
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const user = useAdminStore((s) => s.user)
  const logout = useAdminStore((s) => s.logout)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  function handleLogout() {
    logout()
    router.push('/admin/login')
  }

  function isActive(href: string, exact?: boolean) {
    if (exact) return pathname === href
    return pathname.startsWith(href)
  }

  const sidebar = (
    <aside className="flex flex-col h-full bg-slate-950 border-r border-white/10">
      <div className="p-5 border-b border-white/10">
        <Link href="/admin" className="flex items-center gap-2 font-bold text-white">
          <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center">
            <Zap size={18} className="text-white" fill="currentColor" />
          </span>
          <div>
            <p className="text-sm">{BRAND_NAME}</p>
            <p className="text-[10px] text-slate-400 font-normal uppercase tracking-wider">
              Admin
            </p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {links.map(({ href, label, icon: Icon, exact }) => (
          <Link
            key={href}
            href={href}
            onClick={() => setSidebarOpen(false)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              isActive(href, exact)
                ? 'bg-indigo-500/20 text-indigo-300'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Icon size={18} />
            {label}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-white/10">
        {user && (
          <p className="text-xs text-slate-500 mb-3 truncate">{getUserContact(user)}</p>
        )}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <LogOut size={16} />
          Sign Out
        </button>
        <Link
          href="/"
          className="mt-2 block text-center text-xs text-slate-500 hover:text-slate-300 py-2"
        >
          ← Back to store
        </Link>
      </div>
    </aside>
  )

  return (
    <AdminGuard>
      <div className="min-h-screen bg-slate-900 text-slate-100 flex">
        <div className="hidden lg:block w-64 shrink-0 fixed inset-y-0 left-0">
          {sidebar}
        </div>

        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/60 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        <div
          className={`fixed inset-y-0 left-0 w-64 z-50 lg:hidden transition-transform ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {sidebar}
        </div>

        <div className="flex-1 lg:ml-64 min-h-screen">
          <header className="sticky top-0 z-30 flex items-center gap-4 px-4 sm:px-6 h-14 border-b border-white/10 bg-slate-900/90 backdrop-blur">
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-white/5"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={20} />
            </button>
            <h1 className="text-sm font-semibold text-slate-300">
              {PAGE_TITLES[pathname.split('/').pop() || 'admin'] ?? 'Admin'}
            </h1>
          </header>
          <div className="p-4 sm:p-6 lg:p-8">{children}</div>
        </div>
      </div>
    </AdminGuard>
  )
}
