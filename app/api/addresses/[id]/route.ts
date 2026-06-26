import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/auth/users'
import { Address } from '@/types/address'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL!

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getUserFromRequest(request.headers.get('authorization'))
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params

  try {
    const check = await fetch(`${BASE_URL}/addresses/${id}`)
    if (!check.ok) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
    const existing: Address = await check.json()
    if (existing.userId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()

    if (body.isDefault) {
      const listRes = await fetch(`${BASE_URL}/addresses?userId=${user.id}`)
      const list: Address[] = await listRes.json()
      await Promise.all(
        list
          .filter((a) => a.isDefault && a.id !== existing.id)
          .map((a) =>
            fetch(`${BASE_URL}/addresses/${a.id}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ isDefault: false }),
            }),
          ),
      )
    }

    const res = await fetch(`${BASE_URL}/addresses/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    if (!res.ok) throw new Error('update failed')
    return NextResponse.json(await res.json())
  } catch {
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getUserFromRequest(request.headers.get('authorization'))
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params

  try {
    const check = await fetch(`${BASE_URL}/addresses/${id}`)
    if (!check.ok) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
    const existing: Address = await check.json()
    if (existing.userId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    await fetch(`${BASE_URL}/addresses/${id}`, { method: 'DELETE' })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 })
  }
}
