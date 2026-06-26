'use client'

import Link from 'next/link'
import { useAuthStore } from '@/store/useAuthStore'
import { Package, MapPin, ChevronRight } from 'lucide-react'

export default function AccountDashboard() {
  const user = useAuthStore((s) => s.user)

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Hello, <span className="gradient-text">{user?.name.split(' ')[0]}</span>
        </h1>
        <p className="text-muted mt-1">Manage your account and orders</p>
      </header>

      <div className="grid sm:grid-cols-2 gap-4">
        <Link
          href="/account/orders"
          className="card-surface p-5 flex items-center gap-4 hover:-translate-y-0.5 transition-all group"
        >
          <div className="p-3 rounded-xl bg-accent-soft text-primary">
            <Package size={24} />
          </div>
          <div className="flex-1">
            <p className="font-semibold group-hover:text-primary transition-colors">
              My Orders
            </p>
            <p className="text-sm text-muted">Track and view order history</p>
          </div>
          <ChevronRight size={18} className="text-muted" />
        </Link>

        <Link
          href="/account/addresses"
          className="card-surface p-5 flex items-center gap-4 hover:-translate-y-0.5 transition-all group"
        >
          <div className="p-3 rounded-xl bg-accent-soft text-primary">
            <MapPin size={24} />
          </div>
          <div className="flex-1">
            <p className="font-semibold group-hover:text-primary transition-colors">
              Addresses
            </p>
            <p className="text-sm text-muted">Manage delivery addresses</p>
          </div>
          <ChevronRight size={18} className="text-muted" />
        </Link>
      </div>
    </div>
  )
}
