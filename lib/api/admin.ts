import { Product } from '@/types/product'
import { UserRecord } from '@/types/user'
import type { Address } from '@/types/address'
import type { Order, OrderStatus } from '@/types/order'
import { CATEGORY_META, PRODUCT_CATEGORIES } from '@/lib/constants'
import type {
  AdminDashboardStats,
  AdminUserRow,
} from '@/types/admin'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL!

const ORDER_STATUSES: OrderStatus[] = [
  'pending',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
]

async function adminFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    cache: 'no-store',
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || `Request failed: ${res.status}`)
  }
  if (res.status === 204) return undefined as T
  return res.json()
}

export async function adminGetProducts(): Promise<Product[]> {
  const res = await fetch(`${BASE_URL}/products?_sort=id&_order=asc`, {
    cache: 'no-store',
  })
  if (!res.ok) throw new Error('Failed to fetch products')
  return res.json()
}

export async function adminCreateProduct(
  data: Omit<Product, 'id'>,
): Promise<Product> {
  return adminFetch('/products', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function adminUpdateProduct(
  id: number,
  data: Partial<Product>,
): Promise<Product> {
  return adminFetch(`/products/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  })
}

export async function adminDeleteProduct(id: number): Promise<void> {
  await adminFetch(`/products/${id}`, { method: 'DELETE' })
}

export async function adminGetUsers(): Promise<UserRecord[]> {
  return adminFetch('/users')
}

export async function adminGetOrders(): Promise<Order[]> {
  return adminFetch('/orders?_sort=createdAt&_order=desc')
}

export async function adminUpdateOrder(
  id: number,
  data: { status: OrderStatus },
): Promise<Order> {
  return adminFetch(`/orders/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  })
}

export async function adminGetAddresses(): Promise<Address[]> {
  return adminFetch('/addresses')
}

export async function adminUpdateUserRole(
  id: number,
  role: 'admin' | 'user',
): Promise<UserRecord> {
  return adminFetch(`/users/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ role }),
  })
}

export async function adminGetUsersWithMeta(): Promise<AdminUserRow[]> {
  const [users, orders, addresses] = await Promise.all([
    adminGetUsers(),
    adminGetOrders(),
    adminGetAddresses(),
  ])

  return users.map(({ password, ...user }) => {
    const userOrders = orders.filter((o) => o.userId === user.id)
    const totalSpent = userOrders
      .filter((o) => o.status !== 'cancelled')
      .reduce((sum, o) => sum + o.total, 0)

    return {
      id: user.id,
      email: user.email ?? null,
      phone: user.phone ?? null,
      name: user.name,
      role: user.role || 'user',
      authProvider: user.authProvider || 'email',
      avatarUrl: user.avatarUrl ?? null,
      createdAt: user.createdAt,
      orderCount: userOrders.length,
      totalSpent,
      addressCount: addresses.filter((a) => a.userId === user.id).length,
    }
  })
}

export async function adminGetStats(): Promise<AdminDashboardStats> {
  const [products, users, orders] = await Promise.all([
    adminGetProducts(),
    adminGetUsers(),
    adminGetOrders(),
  ])

  const activeOrders = orders.filter((o) => o.status !== 'cancelled')
  const totalRevenue = activeOrders.reduce((sum, o) => sum + o.total, 0)

  const ordersByStatus = ORDER_STATUSES.reduce(
    (acc, status) => {
      acc[status] = orders.filter((o) => o.status === status).length
      return acc
    },
    {} as Record<OrderStatus, number>,
  )

  const productSales = new Map<
    number,
    { title: string; quantitySold: number; revenue: number }
  >()

  for (const order of activeOrders) {
    for (const item of order.items) {
      const cur = productSales.get(item.productId) ?? {
        title: item.title,
        quantitySold: 0,
        revenue: 0,
      }
      cur.quantitySold += item.quantity
      cur.revenue += item.price * item.quantity
      productSales.set(item.productId, cur)
    }
  }

  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)

  return {
    productCount: products.length,
    userCount: users.length,
    orderCount: orders.length,
    lowStock: products.filter((p) => p.stock > 0 && p.stock <= 10).length,
    outOfStock: products.filter((p) => p.stock === 0).length,
    totalRevenue,
    averageOrderValue:
      activeOrders.length > 0
        ? Math.round(totalRevenue / activeOrders.length)
        : 0,
    newUsersThisMonth: users.filter(
      (u) => new Date(u.createdAt) >= monthStart,
    ).length,
    ordersByStatus,
    recentOrders: orders.slice(0, 6).map((o) => ({
      id: o.id,
      userId: o.userId,
      total: o.total,
      status: o.status,
      createdAt: o.createdAt,
      itemCount: o.items.length,
    })),
    lowStockProducts: products
      .filter((p) => p.stock > 0 && p.stock <= 10)
      .sort((a, b) => a.stock - b.stock)
      .slice(0, 8)
      .map((p) => ({
        id: p.id,
        title: p.title,
        stock: p.stock,
        category: p.category,
        price: p.price,
        brand: p.brand,
      })),
    categoryBreakdown: PRODUCT_CATEGORIES.map((cat) => ({
      category: cat,
      label: CATEGORY_META[cat].label,
      icon: CATEGORY_META[cat].icon,
      count: products.filter((p) => p.category === cat).length,
    })),
    topSellingProducts: [...productSales.entries()]
      .map(([productId, data]) => ({ productId, ...data }))
      .sort((a, b) => b.quantitySold - a.quantitySold)
      .slice(0, 5),
  }
}
