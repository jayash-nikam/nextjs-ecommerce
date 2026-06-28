import { NextRequest, NextResponse } from 'next/server'
import { findUserByPhone } from '@/lib/auth/users'
import { createPhoneOtp, isDevOtpExposed } from '@/lib/otp'
import { sendOtpSms } from '@/lib/sms/sendOtp'
import { isValidIndianMobile, normalizePhone } from '@/lib/phone'

export async function POST(request: NextRequest) {
  try {
    const { phone } = await request.json()

    if (!phone?.trim()) {
      return NextResponse.json(
        { error: 'Mobile number is required' },
        { status: 400 },
      )
    }

    if (!isValidIndianMobile(phone)) {
      return NextResponse.json(
        { error: 'Enter a valid 10-digit Indian mobile number' },
        { status: 400 },
      )
    }

    const normalized = normalizePhone(phone)
    const existing = await findUserByPhone(normalized)
    const { code } = await createPhoneOtp(normalized, 'phone_login')

    await sendOtpSms(normalized, code)

    const body: Record<string, string | boolean> = {
      message: 'Verification code sent to your mobile',
      isNewUser: !existing,
      phone: normalized,
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
