export interface OrderItem {
  productId: number
  title: string
  price: number
  quantity: number
  image: string
}

export type OrderStatus =
  | 'pending'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'

export interface Order {
  id: number
  userId: number
  items: OrderItem[]
  total: number
  status: OrderStatus
  createdAt: string
  shippingAddress?: {
    name: string
    line1: string
    line2?: string
    city: string
    state: string
    pincode: string
    phone: string
  }
}
