import { NextRequest, NextResponse } from 'next/server'
import { getAdminFromRequest } from '@/lib/auth/admin'
import { adminGetOrders, adminUpdateOrder } from '@/lib/api/admin'
import type { OrderStatus } from '@/types/order'

const VALID_STATUSES: OrderStatus[] = [
  'pending',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
]

export async function GET(request: NextRequest) {
  const admin = await getAdminFromRequest(
    request.headers.get('authorization'),
  )
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const orders = await adminGetOrders()
    return NextResponse.json(orders)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  const admin = await getAdminFromRequest(
    request.headers.get('authorization'),
  )
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id, status } = await request.json()
    if (!id || !status) {
      return NextResponse.json({ error: 'id and status required' }, { status: 400 })
    }
    if (!VALID_STATUSES.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }
    const order = await adminUpdateOrder(Number(id), { status })
    return NextResponse.json(order)
  } catch {
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 })
  }
}
