import { NextRequest, NextResponse } from 'next/server'
import {
  createUser,
  findUserByEmail,
  createSessionToken,
  toPublicUser,
} from '@/lib/auth/users'

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json()

    if (!name?.trim() || !email?.trim() || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 },
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 },
      )
    }

    const existing = await findUserByEmail(email.trim())
    if (existing) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 },
      )
    }

    const record = await createUser(name.trim(), email.trim(), password)
    const user = toPublicUser(record)
    const token = createSessionToken(user.id)

    return NextResponse.json({ user, token }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 })
  }
}
