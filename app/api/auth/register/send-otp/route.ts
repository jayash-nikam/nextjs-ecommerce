import { NextRequest, NextResponse } from 'next/server'
import { findUserByEmail } from '@/lib/auth/users'
import { hashPassword } from '@/lib/auth/password'
import { sendOtpEmail } from '@/lib/email/sendOtp'
import { createOtp, isDevOtpExposed } from '@/lib/otp'

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

    const normalizedEmail = email.trim().toLowerCase()
    const existing = await findUserByEmail(normalizedEmail)
    if (existing) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 },
      )
    }

    const { code } = await createOtp(normalizedEmail, 'register', {
      name: name.trim(),
      passwordHash: hashPassword(password),
    })

    await sendOtpEmail(normalizedEmail, code, 'register')

    const body: Record<string, string> = {
      message: 'Verification code sent to your email',
    }
    if (isDevOtpExposed()) {
      body.devOtp = code
    }

    return NextResponse.json(body)
  } catch {
    return NextResponse.json(
      { error: 'Failed to send verification code' },
      { status: 500 },
    )
  }
}
