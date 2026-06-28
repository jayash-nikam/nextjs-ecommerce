'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  Loader2,
  MapPin,
  Package,
  Phone,
  X,
} from 'lucide-react'
import { adminHeaders, useAdminStore } from '@/store/useAdminStore'
import { showToast } from '@/store/useToastStore'
import type { AdminUserRow } from '@/types/admin'
import type { Address } from '@/types/address'
import type { Order } from '@/types/order'
import {
  AdminSearchInput,
  AdminSelect,
  AuthProviderBadge,
  OrderStatusBadge,
  RoleBadge,
} from '@/components/admin/admin-ui'
import { formatPhoneDisplay } from '@/lib/phone'
import { getUserContact } from '@/lib/user/display'

export function UsersManager() {
  const token = useAdminStore((s) => s.token)
  const currentAdmin = useAdminStore((s) => s.user)
  const [users, setUsers] = useState<AdminUserRow[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [providerFilter, setProviderFilter] = useState('all')
  const [selected, setSelected] = useState<AdminUserRow | null>(null)
  const [addresses, setAddresses] = useState<Address[]>([])
  const [userOrders, setUserOrders] = useState<Order[]>([])
  const [detailLoading, setDetailLoading] = useState(false)

  function load() {
    return fetch('/api/admin/users', { headers: adminHeaders(token) })
      .then((res) => res.json())
      .then(setUsers)
  }

  useEffect(() => {
    load()
      .catch(() => showToast('Failed to load users'))
      .finally(() => setLoading(false))
  }, [token])

  async function openDetail(user: AdminUserRow) {
    setSelected(user)
    setDetailLoading(true)
    try {
      const [addrRes, orderRes] = await Promise.all([
        fetch('/api/admin/addresses', { headers: adminHeaders(token) }),
        fetch('/api/admin/orders', { headers: adminHeaders(token) }),
      ])
      const allAddresses: Address[] = await addrRes.json()
      const allOrders: Order[] = await orderRes.json()
      setAddresses(allAddresses.filter((a) => a.userId === user.id))
      setUserOrders(allOrders.filter((o) => o.userId === user.id))
    } catch {
      showToast('Failed to load user details')
    } finally {
      setDetailLoading(false)
    }
  }

  async function updateRole(userId: number, role: 'admin' | 'user') {
    const res = await fetch('/api/admin/users', {
      method: 'PATCH',
      headers: adminHeaders(token),
      body: JSON.stringify({ id: userId, role }),
    })
    const data = await res.json()
    if (!res.ok) {
      showToast(data.error || 'Failed to update role')
      return
    }
    showToast('Role updated')
    await load()
    if (selected?.id === userId) {
      setSelected((s) => (s ? { ...s, role } : null))
    }
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return users.filter((u) => {
      if (roleFilter !== 'all' && u.role !== roleFilter) return false
      if (providerFilter !== 'all' && u.authProvider !== providerFilter) return false
      if (!q) return true
      return (
        u.name.toLowerCase().includes(q) ||
        (u.email?.toLowerCase().includes(q) ?? false) ||
        (u.phone?.includes(q.replace(/\D/g, '')) ?? false)
      )
    })
  }, [users, search, roleFilter, providerFilter])

  const totalCustomers = users.filter((u) => u.role === 'user').length
  const totalSpent = users.reduce((sum, u) => sum + u.totalSpent, 0)

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 size={28} className="text-indigo-400 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Users</h2>
        <p className="text-slate-400 text-sm mt-1">
          {totalCustomers} customers · {users.length} total · ₹
          {totalSpent.toLocaleString()} lifetime revenue
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <AdminSearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search by name or email…"
        />
        <AdminSelect
          value={roleFilter}
          onChange={setRoleFilter}
          options={[
            { value: 'all', label: 'All roles' },
            { value: 'user', label: 'Customers' },
            { value: 'admin', label: 'Admins' },
          ]}
        />
        <AdminSelect
          value={providerFilter}
          onChange={setProviderFilter}
          options={[
            { value: 'all', label: 'All sign-in methods' },
            { value: 'email', label: 'Email' },
            { value: 'google', label: 'Google' },
            { value: 'phone', label: 'Mobile OTP' },
          ]}
        />
      </div>

      <div className="bg-slate-800/50 border border-white/10 rounded-2xl overflow-hidden responsive-scroll">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 text-slate-400 text-left">
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium hidden md:table-cell">Joined</th>
              <th className="px-4 py-3 font-medium hidden lg:table-cell">Sign-in</th>
              <th className="px-4 py-3 font-medium">Orders</th>
              <th className="px-4 py-3 font-medium hidden sm:table-cell">Spent</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <tr
                key={u.id}
                className="border-b border-white/5 hover:bg-white/5 transition-colors"
              >
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => openDetail(u)}
                    className="text-left group"
                  >
                    <p className="font-medium text-white group-hover:text-indigo-300 transition-colors">
                      {u.name}
                    </p>
                    <p className="text-xs text-slate-500">{getUserContact(u)}</p>
                    {u.phone && u.email && (
                      <p className="text-[10px] text-slate-600">
                        {formatPhoneDisplay(u.phone)}
                      </p>
                    )}
                  </button>
                </td>
                <td className="px-4 py-3 text-slate-400 hidden md:table-cell">
                  {new Date(u.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </td>
                <td className="px-4 py-3 hidden lg:table-cell">
                  <AuthProviderBadge provider={u.authProvider} />
                </td>
                <td className="px-4 py-3 text-slate-300">{u.orderCount}</td>
                <td className="px-4 py-3 text-slate-300 hidden sm:table-cell">
                  ₹{u.totalSpent.toLocaleString()}
                </td>
                <td className="px-4 py-3">
                  <RoleBadge role={u.role} />
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    type="button"
                    onClick={() => openDetail(u)}
                    className="text-xs text-indigo-400 hover:underline"
                  >
                    Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="text-center text-slate-500 py-12">No users found</p>
        )}
      </div>

      {selected && (
        <div
          className="fixed inset-0 z-50 flex justify-end"
          role="dialog"
          aria-modal="true"
          aria-label={`User details for ${selected.name}`}
        >
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setSelected(null)}
            aria-hidden="true"
          />
          <div className="relative w-full max-w-md bg-slate-900 border-l border-white/10 h-full overflow-y-auto animate-fade-in">
            <div className="sticky top-0 z-10 flex items-center justify-between p-5 border-b border-white/10 bg-slate-900/95 backdrop-blur">
              <div>
                <h3 className="font-semibold text-white">{selected.name}</h3>
                <p className="text-xs text-slate-500">{getUserContact(selected)}</p>
                <div className="mt-2">
                  <AuthProviderBadge provider={selected.authProvider} />
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="p-2 rounded-lg hover:bg-white/10 text-slate-400"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-5 space-y-6">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-800/50 border border-white/5">
                  <p className="text-xs text-slate-500">Orders</p>
                  <p className="text-lg font-bold text-white">
                    {selected.orderCount}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-800/50 border border-white/5">
                  <p className="text-xs text-slate-500">Total spent</p>
                  <p className="text-lg font-bold text-emerald-400">
                    ₹{selected.totalSpent.toLocaleString()}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                  Role
                </p>
                {selected.id === currentAdmin?.id ? (
                  <RoleBadge role={selected.role} />
                ) : (
                  <AdminSelect
                    value={selected.role}
                    onChange={(role) =>
                      updateRole(selected.id, role as 'admin' | 'user')
                    }
                    options={[
                      { value: 'user', label: 'Customer' },
                      { value: 'admin', label: 'Admin' },
                    ]}
                    className="w-full"
                  />
                )}
              </div>

              <div>
                <p className="text-xs text-slate-500">
                  Email: {selected.email || '—'}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Mobile:{' '}
                  {selected.phone ? formatPhoneDisplay(selected.phone) : '—'}
                </p>
                <p className="text-xs text-slate-500 mt-2">
                  Joined{' '}
                  {new Date(selected.createdAt).toLocaleDateString('en-IN', {
                    dateStyle: 'long',
                  })}
                </p>
              </div>

              {detailLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 size={24} className="text-indigo-400 animate-spin" />
                </div>
              ) : (
                <>
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
                      <MapPin size={14} />
                      Addresses ({addresses.length})
                    </h4>
                    {addresses.length === 0 ? (
                      <p className="text-sm text-slate-500">No saved addresses</p>
                    ) : (
                      <ul className="space-y-3">
                        {addresses.map((a) => (
                          <li
                            key={a.id}
                            className="text-sm p-3 rounded-xl bg-slate-800/50 border border-white/5"
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-white">
                                {a.label}
                              </span>
                              {a.isDefault && (
                                <span className="text-[10px] uppercase tracking-wider bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded">
                                  Default
                                </span>
                              )}
                            </div>
                            <p className="text-slate-300">{a.name}</p>
                            <p className="text-slate-400">
                              {a.line1}
                              {a.line2 ? `, ${a.line2}` : ''}
                            </p>
                            <p className="text-slate-400">
                              {a.city}, {a.state} {a.pincode}
                            </p>
                            <p className="text-slate-500 flex items-center gap-1 mt-1">
                              <Phone size={12} />
                              {a.phone}
                            </p>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
                      <Package size={14} />
                      Order History ({userOrders.length})
                    </h4>
                    {userOrders.length === 0 ? (
                      <p className="text-sm text-slate-500">No orders yet</p>
                    ) : (
                      <ul className="space-y-2">
                        {userOrders.map((o) => (
                          <li
                            key={o.id}
                            className="flex items-center justify-between gap-2 p-3 rounded-xl bg-slate-800/50 border border-white/5 text-sm"
                          >
                            <div>
                              <p className="font-medium text-white">
                                #{o.id}
                              </p>
                              <p className="text-xs text-slate-500">
                                {new Date(o.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="text-right">
                              <OrderStatusBadge status={o.status} />
                              <p className="text-indigo-300 font-semibold mt-1">
                                ₹{o.total.toLocaleString()}
                              </p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
