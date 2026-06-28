import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/auth/users'
import { Address } from '@/types/address'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL!

export async function GET(request: NextRequest) {
  const user = await getUserFromRequest(request)
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const res = await fetch(`${BASE_URL}/addresses?userId=${user.id}`, {
      cache: 'no-store',
    })
    if (!res.ok) throw new Error('fetch failed')
    const addresses: Address[] = await res.json()
    return NextResponse.json(addresses)
  } catch {
    return NextResponse.json(
      { error: 'Failed to load addresses' },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  const user = await getUserFromRequest(request)
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()

    if (body.isDefault) {
      const existing = await fetch(`${BASE_URL}/addresses?userId=${user.id}`)
      const list: Address[] = await existing.json()
      await Promise.all(
        list
          .filter((a) => a.isDefault)
          .map((a) =>
            fetch(`${BASE_URL}/addresses/${a.id}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ isDefault: false }),
            }),
          ),
      )
    }

    const res = await fetch(`${BASE_URL}/addresses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...body, userId: user.id }),
    })

    if (!res.ok) throw new Error('create failed')
    const address: Address = await res.json()
    return NextResponse.json(address, { status: 201 })
  } catch {
    return NextResponse.json(
      { error: 'Failed to save address' },
      { status: 500 },
    )
  }
}
