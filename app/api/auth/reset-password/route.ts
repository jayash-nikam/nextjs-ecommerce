import { NextRequest, NextResponse } from 'next/server'
import { findUserByEmail, updateUserPassword } from '@/lib/auth/users'
import { deleteOtp, verifyOtp } from '@/lib/otp'

export async function POST(request: NextRequest) {
  try {
    const { email, otp, password } = await request.json()

    if (!email?.trim() || !otp?.trim() || !password) {
      return NextResponse.json(
        { error: 'Email, verification code, and new password are required' },
        { status: 400 },
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 },
      )
    }

    const normalizedEmail = email.trim().toLowerCase()
    const user = await findUserByEmail(normalizedEmail)

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid verification code' },
        { status: 400 },
      )
    }

    const result = await verifyOtp(normalizedEmail, 'reset', otp)
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: result.status })
    }

    await updateUserPassword(user.id, password)
    await deleteOtp(result.record.id)

    return NextResponse.json({ message: 'Password updated successfully' })
  } catch {
    return NextResponse.json(
      { error: 'Failed to reset password' },
      { status: 500 },
    )
  }
}
