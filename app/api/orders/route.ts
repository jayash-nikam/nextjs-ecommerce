import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/auth/users'
import { Order } from '@/types/order'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL!

export async function GET(request: NextRequest) {
  const user = await getUserFromRequest(request)
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const res = await fetch(
      `${BASE_URL}/orders?userId=${user.id}&_sort=createdAt&_order=desc`,
      { cache: 'no-store' },
    )
    if (!res.ok) throw new Error('fetch failed')
    const orders: Order[] = await res.json()
    return NextResponse.json(orders)
  } catch {
    return NextResponse.json({ error: 'Failed to load orders' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const user = await getUserFromRequest(request)
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const res = await fetch(`${BASE_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: user.id,
        items: body.items,
        total: body.total,
        status: 'pending',
        createdAt: new Date().toISOString(),
        shippingAddress: body.shippingAddress,
      }),
    })

    if (!res.ok) throw new Error('create failed')
    const order: Order = await res.json()
    return NextResponse.json(order, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }
}
