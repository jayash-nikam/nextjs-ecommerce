import type { OrderStatus } from '@/types/order'
import type { AuthProvider } from '@/types/user'

export interface AdminRecentOrder {
  id: number
  userId: number
  total: number
  status: OrderStatus
  createdAt: string
  itemCount: number
}

export interface AdminLowStockProduct {
  id: number
  title: string
  stock: number
  category: string
  price: number
  brand: string
}

export interface AdminCategoryStat {
  category: string
  label: string
  count: number
  icon: string
}

export interface AdminTopProduct {
  productId: number
  title: string
  quantitySold: number
  revenue: number
}

export interface AdminDashboardStats {
  productCount: number
  userCount: number
  orderCount: number
  lowStock: number
  outOfStock: number
  totalRevenue: number
  averageOrderValue: number
  newUsersThisMonth: number
  ordersByStatus: Record<OrderStatus, number>
  recentOrders: AdminRecentOrder[]
  lowStockProducts: AdminLowStockProduct[]
  categoryBreakdown: AdminCategoryStat[]
  topSellingProducts: AdminTopProduct[]
}

export interface AdminUserRow {
  id: number
  email: string | null
  phone: string | null
  name: string
  role: 'admin' | 'user'
  authProvider: AuthProvider
  avatarUrl: string | null
  createdAt: string
  orderCount: number
  totalSpent: number
  addressCount: number
}
