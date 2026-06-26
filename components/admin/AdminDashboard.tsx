'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  Package,
  Users,
  ShoppingBag,
  AlertTriangle,
  IndianRupee,
  TrendingUp,
  UserPlus,
} from 'lucide-react'
import { adminHeaders, useAdminStore } from '@/store/useAdminStore'
import type { AdminDashboardStats } from '@/types/admin'
import {
  AdminPanel,
  AdminStatCard,
  OrderStatusBadge,
} from '@/components/admin/admin-ui'

export function AdminDashboard() {
  const token = useAdminStore((s) => s.token)
  const [stats, setStats] = useState<AdminDashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/stats', { headers: adminHeaders(token) })
      .then((res) => res.json())
      .then(setStats)
      .catch(() => setStats(null))
      .finally(() => setLoading(false))
  }, [token])

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-48 bg-slate-800 rounded-lg" />
        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-slate-800/50 rounded-2xl" />
          ))}
        </div>
      </div>
    )
  }

  if (!stats) {
    return (
      <p className="text-slate-400 text-center py-12">
        Failed to load dashboard. Check that the backend is running.
      </p>
    )
  }

  const maxCategory = Math.max(...stats.categoryBreakdown.map((c) => c.count), 1)
  const statusTotal = Object.values(stats.ordersByStatus).reduce((a, b) => a + b, 0)

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white">Dashboard</h2>
        <p className="text-slate-400 text-sm mt-1">
          Store performance and inventory overview
        </p>
      </div>

      {(stats.outOfStock > 0 || stats.lowStock > 0) && (
        <div className="flex flex-wrap gap-3">
          {stats.outOfStock > 0 && (
            <Link
              href="/admin/products?stock=out"
              className="text-sm bg-red-500/10 border border-red-500/20 text-red-200 rounded-xl px-4 py-2.5 hover:bg-red-500/15 transition-colors"
            >
              {stats.outOfStock} product{stats.outOfStock !== 1 ? 's' : ''} out of stock
            </Link>
          )}
          {stats.lowStock > 0 && (
            <Link
              href="/admin/products?stock=low"
              className="text-sm bg-amber-500/10 border border-amber-500/20 text-amber-200 rounded-xl px-4 py-2.5 hover:bg-amber-500/15 transition-colors"
            >
              {stats.lowStock} product{stats.lowStock !== 1 ? 's' : ''} low on stock
            </Link>
          )}
        </div>
      )}

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <AdminStatCard
          label="Total Revenue"
          value={`₹${stats.totalRevenue.toLocaleString()}`}
          sub={`Avg ₹${stats.averageOrderValue.toLocaleString()} / order`}
          icon={IndianRupee}
          accent="emerald"
        />
        <AdminStatCard
          label="Orders"
          value={stats.orderCount}
          sub={`${stats.ordersByStatus.processing + stats.ordersByStatus.pending} active`}
          icon={ShoppingBag}
          href="/admin/orders"
        />
        <AdminStatCard
          label="Products"
          value={stats.productCount}
          sub={`${stats.outOfStock} out of stock`}
          icon={Package}
          href="/admin/products"
        />
        <AdminStatCard
          label="Customers"
          value={stats.userCount}
          sub={`+${stats.newUsersThisMonth} this month`}
          icon={Users}
          href="/admin/users"
          accent="violet"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <AdminPanel title="Recent Orders" className="lg:col-span-2">
          <div className="divide-y divide-white/5">
            {stats.recentOrders.length === 0 ? (
              <p className="text-slate-500 text-sm text-center py-8">No orders yet</p>
            ) : (
              stats.recentOrders.map((order) => (
                <Link
                  key={order.id}
                  href="/admin/orders"
                  className="flex items-center justify-between gap-4 px-5 py-3.5 hover:bg-white/5 transition-colors"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-white text-sm">
                      Order #{order.id}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      User {order.userId} · {order.itemCount} item
                      {order.itemCount !== 1 ? 's' : ''} ·{' '}
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <OrderStatusBadge status={order.status} />
                    <span className="font-semibold text-indigo-300 text-sm">
                      ₹{order.total.toLocaleString()}
                    </span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </AdminPanel>

        <AdminPanel title="Orders by Status">
          <div className="p-5 space-y-3">
            {(
              Object.entries(stats.ordersByStatus) as [string, number][]
            ).map(([status, count]) => (
              <div key={status}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-400 capitalize">{status}</span>
                  <span className="text-white font-medium">{count}</span>
                </div>
                <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 rounded-full transition-all"
                    style={{
                      width: `${statusTotal ? (count / statusTotal) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </AdminPanel>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <AdminPanel title="Top Selling Products">
          <div className="divide-y divide-white/5">
            {stats.topSellingProducts.length === 0 ? (
              <p className="text-slate-500 text-sm text-center py-8">No sales data yet</p>
            ) : (
              stats.topSellingProducts.map((p, i) => (
                <div
                  key={p.productId}
                  className="flex items-center gap-4 px-5 py-3.5"
                >
                  <span className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold flex items-center justify-center shrink-0">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {p.title}
                    </p>
                    <p className="text-xs text-slate-500">
                      {p.quantitySold} sold · ₹{p.revenue.toLocaleString()} revenue
                    </p>
                  </div>
                  <Link
                    href={`/products/${p.productId}`}
                    target="_blank"
                    className="text-xs text-indigo-400 hover:underline shrink-0"
                  >
                    View
                  </Link>
                </div>
              ))
            )}
          </div>
        </AdminPanel>

        <AdminPanel title="Low Stock Alert">
          <div className="divide-y divide-white/5">
            {stats.lowStockProducts.length === 0 ? (
              <p className="text-slate-500 text-sm text-center py-8">
                All products well stocked
              </p>
            ) : (
              stats.lowStockProducts.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between gap-4 px-5 py-3.5"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {p.title}
                    </p>
                    <p className="text-xs text-slate-500 capitalize">
                      {p.brand} · {p.category}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-amber-400 font-bold text-sm">{p.stock} left</p>
                    <p className="text-xs text-slate-500">
                      ₹{p.price.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
          {stats.lowStockProducts.length > 0 && (
            <div className="px-5 py-3 border-t border-white/10">
              <Link
                href="/admin/products?stock=low"
                className="text-xs text-indigo-400 hover:underline"
              >
                Manage inventory →
              </Link>
            </div>
          )}
        </AdminPanel>
      </div>

      <AdminPanel title="Catalog by Category">
        <div className="p-5 grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {stats.categoryBreakdown.map((cat) => (
            <Link
              key={cat.category}
              href={`/admin/products?category=${cat.category}`}
              className="p-4 rounded-xl bg-slate-900/50 border border-white/5 hover:border-indigo-500/30 transition-colors"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg" aria-hidden="true">
                  {cat.icon}
                </span>
                <span className="text-sm font-medium text-white">{cat.label}</span>
              </div>
              <p className="text-2xl font-bold text-white mb-2">{cat.count}</p>
              <div className="h-1 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-violet-500 rounded-full"
                  style={{ width: `${(cat.count / maxCategory) * 100}%` }}
                />
              </div>
            </Link>
          ))}
        </div>
      </AdminPanel>

      <div className="grid sm:grid-cols-3 gap-4">
        <div className="flex items-center gap-3 bg-slate-800/30 border border-white/5 rounded-xl px-4 py-3">
          <TrendingUp size={18} className="text-emerald-400 shrink-0" />
          <div>
            <p className="text-xs text-slate-500">Avg order value</p>
            <p className="text-sm font-semibold text-white">
              ₹{stats.averageOrderValue.toLocaleString()}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-slate-800/30 border border-white/5 rounded-xl px-4 py-3">
          <UserPlus size={18} className="text-violet-400 shrink-0" />
          <div>
            <p className="text-xs text-slate-500">New users (month)</p>
            <p className="text-sm font-semibold text-white">{stats.newUsersThisMonth}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-slate-800/30 border border-white/5 rounded-xl px-4 py-3">
          <AlertTriangle size={18} className="text-amber-400 shrink-0" />
          <div>
            <p className="text-xs text-slate-500">Inventory alerts</p>
            <p className="text-sm font-semibold text-white">
              {stats.lowStock + stats.outOfStock} items need attention
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
