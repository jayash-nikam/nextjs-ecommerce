import { NextRequest, NextResponse } from 'next/server'
import { getAdminFromRequest } from '@/lib/auth/admin'
import { adminGetStats } from '@/lib/api/admin'

export async function GET(request: NextRequest) {
  const admin = await getAdminFromRequest(request)
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const stats = await adminGetStats()
    return NextResponse.json(stats)
  } catch {
    return NextResponse.json({ error: 'Failed to load stats' }, { status: 500 })
  }
}
