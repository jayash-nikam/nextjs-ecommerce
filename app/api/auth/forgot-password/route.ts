import { NextRequest, NextResponse } from 'next/server'
import { findUserByEmail } from '@/lib/auth/users'
import { sendOtpEmail } from '@/lib/email/sendOtp'
import { createOtp, isDevOtpExposed } from '@/lib/otp'

const GENERIC_MESSAGE =
  'If an account exists for this email, a verification code has been sent.'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email?.trim()) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const normalizedEmail = email.trim().toLowerCase()
    const user = await findUserByEmail(normalizedEmail)

    if (user) {
      const { code } = await createOtp(normalizedEmail, 'reset')
      await sendOtpEmail(normalizedEmail, code, 'reset')

      const body: Record<string, string> = { message: GENERIC_MESSAGE }
      if (isDevOtpExposed()) {
        body.devOtp = code
      }
      return NextResponse.json(body)
    }

    return NextResponse.json({ message: GENERIC_MESSAGE })
  } catch {
    return NextResponse.json(
      { error: 'Failed to send verification code' },
      { status: 500 },
    )
  }
}
