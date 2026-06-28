'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  ChevronDown,
  ChevronUp,
  Loader2,
  MapPin,
  Package,
  Phone,
  Search,
} from 'lucide-react'
import { adminHeaders, useAdminStore } from '@/store/useAdminStore'
import { showToast } from '@/store/useToastStore'
import type { Order, OrderStatus } from '@/types/order'
import type { AdminUserRow } from '@/types/admin'
import {
  AdminSearchInput,
  AdminSelect,
  OrderStatusBadge,
} from '@/components/admin/admin-ui'
import { getUserContact } from '@/lib/user/display'

const STATUSES: OrderStatus[] = [
  'pending',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
]

export function OrdersManager() {
  const token = useAdminStore((s) => s.token)
  const [orders, setOrders] = useState<Order[]>([])
  const [users, setUsers] = useState<AdminUserRow[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [expandedId, setExpandedId] = useState<number | null>(null)

  function load() {
    return Promise.all([
      fetch('/api/admin/orders', { headers: adminHeaders(token) }).then((r) =>
        r.json(),
      ),
      fetch('/api/admin/users', { headers: adminHeaders(token) }).then((r) =>
        r.json(),
      ),
    ]).then(([orderData, userData]) => {
      setOrders(orderData)
      setUsers(userData)
    })
  }

  useEffect(() => {
    load()
      .catch(() => showToast('Failed to load orders'))
      .finally(() => setLoading(false))
  }, [token])

  const userMap = useMemo(
    () => new Map(users.map((u) => [u.id, u])),
    [users],
  )

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return orders.filter((order) => {
      if (statusFilter !== 'all' && order.status !== statusFilter) return false
      if (!q) return true
      const user = userMap.get(order.userId)
      return (
        String(order.id).includes(q) ||
        user?.email?.toLowerCase().includes(q) ||
        user?.phone?.includes(q.replace(/\D/g, '')) ||
        user?.name.toLowerCase().includes(q) ||
        order.items.some((i) => i.title.toLowerCase().includes(q))
      )
    })
  }, [orders, search, statusFilter, userMap])

  const totalRevenue = useMemo(
    () =>
      filtered
        .filter((o) => o.status !== 'cancelled')
        .reduce((sum, o) => sum + o.total, 0),
    [filtered],
  )

  async function updateStatus(id: number, status: OrderStatus) {
    const res = await fetch('/api/admin/orders', {
      method: 'PATCH',
      headers: adminHeaders(token),
      body: JSON.stringify({ id, status }),
    })
    if (res.ok) {
      showToast(`Order #${id} → ${status}`)
      await load()
    } else {
      const data = await res.json()
      showToast(data.error || 'Failed to update status')
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 size={28} className="text-indigo-400 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Orders</h2>
          <p className="text-slate-400 text-sm mt-1">
            {filtered.length} of {orders.length} orders · ₹
            {totalRevenue.toLocaleString()} revenue
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <AdminSearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search by order #, customer, product…"
        />
        <AdminSelect
          value={statusFilter}
          onChange={setStatusFilter}
          options={[
            { value: 'all', label: 'All statuses' },
            ...STATUSES.map((s) => ({
              value: s,
              label: s.charAt(0).toUpperCase() + s.slice(1),
            })),
          ]}
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {STATUSES.map((status) => {
          const count = orders.filter((o) => o.status === status).length
          return (
            <button
              key={status}
              type="button"
              onClick={() =>
                setStatusFilter(statusFilter === status ? 'all' : status)
              }
              className={`p-3 rounded-xl border text-left transition-colors ${
                statusFilter === status
                  ? 'border-indigo-500/40 bg-indigo-500/10'
                  : 'border-white/10 bg-slate-800/30 hover:border-white/20'
              }`}
            >
              <p className="text-lg font-bold text-white">{count}</p>
              <p className="text-xs text-slate-400 capitalize">{status}</p>
            </button>
          )
        })}
      </div>

      <div className="space-y-4">
        {filtered.map((order) => {
          const user = userMap.get(order.userId)
          const expanded = expandedId === order.id
          const addr = order.shippingAddress

          return (
            <div
              key={order.id}
              className="bg-slate-800/50 border border-white/10 rounded-2xl overflow-hidden"
            >
              <div className="p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-white">
                        Order #{order.id}
                      </p>
                      <OrderStatusBadge status={order.status} />
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      {new Date(order.createdAt).toLocaleString('en-IN', {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      })}
                    </p>
                    {user && (
                      <p className="text-sm text-slate-300 mt-1">
                        {user.name}{' '}
                        <span className="text-slate-500">({getUserContact(user)})</span>
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <p className="text-lg font-bold text-indigo-300">
                      ₹{order.total.toLocaleString()}
                    </p>
                    <select
                      value={order.status}
                      onChange={(e) =>
                        updateStatus(order.id, e.target.value as OrderStatus)
                      }
                      className="px-3 py-1.5 rounded-lg bg-slate-900 border border-white/10 text-sm text-white"
                      aria-label={`Update status for order ${order.id}`}
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setExpandedId(expanded ? null : order.id)}
                  className="mt-4 flex items-center gap-1.5 text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  {expanded ? (
                    <>
                      <ChevronUp size={16} /> Hide details
                    </>
                  ) : (
                    <>
                      <ChevronDown size={16} /> View items & shipping
                    </>
                  )}
                </button>
              </div>

              {expanded && (
                <div className="border-t border-white/10 p-5 grid lg:grid-cols-2 gap-6 bg-slate-900/30">
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
                      <Package size={14} />
                      Line Items ({order.items.length})
                    </h4>
                    <ul className="space-y-3">
                      {order.items.map((item, i) => (
                        <li
                          key={i}
                          className="flex items-center gap-3 text-sm"
                        >
                          <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-slate-700 shrink-0">
                            {item.image && (
                              <Image
                                src={item.image}
                                alt=""
                                fill
                                className="object-cover"
                                sizes="48px"
                              />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-white truncate">
                              {item.title}
                            </p>
                            <p className="text-xs text-slate-500">
                              Qty {item.quantity} · ₹
                              {item.price.toLocaleString()} each
                            </p>
                          </div>
                          <p className="font-semibold text-slate-300 shrink-0">
                            ₹{(item.price * item.quantity).toLocaleString()}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
                      <MapPin size={14} />
                      Shipping Address
                    </h4>
                    {addr ? (
                      <div className="text-sm text-slate-300 space-y-1 bg-slate-800/50 rounded-xl p-4 border border-white/5">
                        <p className="font-medium text-white">{addr.name}</p>
                        <p>{addr.line1}</p>
                        {addr.line2 && <p>{addr.line2}</p>}
                        <p>
                          {addr.city}, {addr.state} — {addr.pincode}
                        </p>
                        <p className="flex items-center gap-1.5 text-slate-400 pt-1">
                          <Phone size={13} />
                          {addr.phone}
                        </p>
                      </div>
                    ) : (
                      <p className="text-sm text-slate-500">No address on file</p>
                    )}

                    {user && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        <Link
                          href="/admin/users"
                          className="text-xs px-3 py-1.5 rounded-lg bg-white/5 text-slate-300 hover:bg-white/10 transition-colors"
                        >
                          View customer
                        </Link>
                        <span className="text-xs text-slate-500 py-1.5">
                          {user.orderCount} total orders · ₹
                          {user.totalSpent.toLocaleString()} lifetime
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )
        })}

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <Search size={32} className="mx-auto text-slate-600 mb-3" />
            <p className="text-slate-500">No orders match your filters</p>
          </div>
        )}
      </div>
    </div>
  )
}
