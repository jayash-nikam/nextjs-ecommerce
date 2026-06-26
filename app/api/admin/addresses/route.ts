import { NextRequest, NextResponse } from 'next/server'
import { getAdminFromRequest } from '@/lib/auth/admin'
import { adminGetAddresses } from '@/lib/api/admin'

export async function GET(request: NextRequest) {
  const admin = await getAdminFromRequest(
    request.headers.get('authorization'),
  )
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const addresses = await adminGetAddresses()
    return NextResponse.json(addresses)
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch addresses' },
      { status: 500 },
    )
  }
}
