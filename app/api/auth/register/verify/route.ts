import { NextRequest, NextResponse } from 'next/server'
import {
  createUserFromHash,
  findUserByEmail,
  createSessionToken,
  toPublicUser,
} from '@/lib/auth/users'
import { deleteOtp, verifyOtp } from '@/lib/otp'

export async function POST(request: NextRequest) {
  try {
    const { email, otp } = await request.json()

    if (!email?.trim() || !otp?.trim()) {
      return NextResponse.json(
        { error: 'Email and verification code are required' },
        { status: 400 },
      )
    }

    const normalizedEmail = email.trim().toLowerCase()

    const existing = await findUserByEmail(normalizedEmail)
    if (existing) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 },
      )
    }

    const result = await verifyOtp(normalizedEmail, 'register', otp)
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: result.status })
    }

    const payload = result.record.payload
    if (!payload?.name || !payload?.passwordHash) {
      return NextResponse.json(
        { error: 'Registration data expired. Please start again.' },
        { status: 400 },
      )
    }

    const record = await createUserFromHash(
      payload.name,
      normalizedEmail,
      payload.passwordHash,
    )
    await deleteOtp(result.record.id)

    const user = toPublicUser(record)
    const token = createSessionToken(user.id)

    return NextResponse.json({ user, token }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 })
  }
}
