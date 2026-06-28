'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Loader2, Package, ChevronRight } from 'lucide-react'
import { useAuthStore, authFetch } from '@/store/useAuthStore'
import type { Order, OrderStatus } from '@/types/order'

const statusStyles: Record<OrderStatus, string> = {
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  processing: 'bg-blue-50 text-blue-700 border-blue-200',
  shipped: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  delivered: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  cancelled: 'bg-red-50 text-red-600 border-red-200',
}

export function OrdersList() {
  const user = useAuthStore((s) => s.user)
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }

    authFetch('/api/orders')
      .then((res) => res.json())
      .then(setOrders)
      .finally(() => setLoading(false))
  }, [user])

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 size={28} className="text-primary animate-spin" />
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="card-surface flex flex-col items-center py-16 text-center">
        <Package size={48} className="text-muted mb-4" />
        <h2 className="text-xl font-semibold mb-2">No orders yet</h2>
        <p className="text-muted mb-6">Your order history will appear here.</p>
        <Link href="/products" className="btn-primary px-6 py-2.5">
          Start Shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <article key={order.id} className="card-surface p-5 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
            <div>
              <p className="text-sm text-muted">Order #{order.id}</p>
              <p className="font-semibold">
                {new Date(order.createdAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </div>
            <span
              className={`text-xs font-semibold px-2.5 py-1 rounded-full border capitalize ${statusStyles[order.status]}`}
            >
              {order.status}
            </span>
          </div>

          <ul className="space-y-3 mb-4">
            {order.items.map((item) => (
              <li key={item.productId} className="flex items-center gap-3">
                <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-border-subtle shrink-0">
                  {item.image && (
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/products/${item.productId}`}
                    className="text-sm font-medium hover:text-primary line-clamp-1 transition-colors"
                  >
                    {item.title}
                  </Link>
                  <p className="text-xs text-muted">
                    Qty {item.quantity} · ₹{item.price.toLocaleString()}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          {order.shippingAddress && (
            <p className="text-xs text-muted mb-3">
              Shipped to {order.shippingAddress.name},{' '}
              {order.shippingAddress.city}
            </p>
          )}

          <div className="flex items-center justify-between pt-3 border-t border-border">
            <span className="font-bold text-lg">
              ₹{order.total.toLocaleString()}
            </span>
            <Link
              href={`/products/${order.items[0]?.productId}`}
              className="text-sm text-primary font-medium flex items-center gap-1 hover:underline"
            >
              View product
              <ChevronRight size={14} />
            </Link>
          </div>
        </article>
      ))}
    </div>
  )
}
