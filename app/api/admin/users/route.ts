import { NextRequest, NextResponse } from 'next/server'
import { getAdminFromRequest } from '@/lib/auth/admin'
import {
  adminGetUsersWithMeta,
  adminUpdateUserRole,
} from '@/lib/api/admin'

export async function GET(request: NextRequest) {
  const admin = await getAdminFromRequest(
    request.headers.get('authorization'),
  )
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const users = await adminGetUsersWithMeta()
    return NextResponse.json(users)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
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
    const { id, role } = await request.json()

    if (!id || !role) {
      return NextResponse.json(
        { error: 'id and role are required' },
        { status: 400 },
      )
    }

    if (role !== 'admin' && role !== 'user') {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 })
    }

    if (Number(id) === admin.id && role !== 'admin') {
      return NextResponse.json(
        { error: 'You cannot remove your own admin role' },
        { status: 400 },
      )
    }

    const updated = await adminUpdateUserRole(Number(id), role)
    const { password, ...safe } = updated
    return NextResponse.json(safe)
  } catch {
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 })
  }
}
