'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuthStore } from '@/store/useAuthStore'
import {
  LayoutDashboard,
  Package,
  MapPin,
  LogOut,
  User,
} from 'lucide-react'

const links = [
  { href: '/account', label: 'Overview', icon: LayoutDashboard, exact: true },
  { href: '/account/orders', label: 'Orders', icon: Package },
  { href: '/account/addresses', label: 'Addresses', icon: MapPin },
]

export function AccountSidebar() {
  const pathname = usePathname()
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)

  if (!user) return null

  return (
    <aside className="card-surface p-5 h-fit lg:sticky lg:top-24 space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-border">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0">
          <p className="font-semibold truncate">{user.name}</p>
          <p className="text-xs text-muted truncate">{user.email}</p>
        </div>
      </div>

      <nav className="space-y-1">
        {links.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors
                ${
                  active
                    ? 'bg-accent-soft text-primary'
                    : 'text-muted hover:bg-border-subtle hover:text-foreground'
                }
              `}
            >
              <Icon size={18} />
              {label}
            </Link>
          )
        })}
      </nav>

      <button
        onClick={logout}
        className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-muted hover:bg-red-50 hover:text-red-600 transition-colors"
      >
        <LogOut size={18} />
        Sign Out
      </button>
    </aside>
  )
}

export function AuthCard({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle: string
  children: React.ReactNode
}) {
  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-accent-soft text-primary mb-4">
          <User size={28} />
        </div>
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="text-muted mt-2">{subtitle}</p>
      </div>
      <div className="card-surface p-6 sm:p-8">{children}</div>
    </div>
  )
}
