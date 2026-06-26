import { NextRequest, NextResponse } from 'next/server'
import {
  authenticateUser,
  createSessionToken,
  findUserByEmail,
} from '@/lib/auth/users'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email?.trim() || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 },
      )
    }

    const record = await findUserByEmail(email.trim())
    if (!record || record.role !== 'admin') {
      return NextResponse.json(
        { error: 'Invalid admin credentials' },
        { status: 401 },
      )
    }

    const user = await authenticateUser(email.trim(), password)
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Invalid admin credentials' },
        { status: 401 },
      )
    }

    const token = createSessionToken(user.id)
    return NextResponse.json({ user, token })
  } catch {
    return NextResponse.json({ error: 'Login failed' }, { status: 500 })
  }
}
