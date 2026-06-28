import { NextRequest, NextResponse } from 'next/server'
import {
  createPhoneUser,
  findUserByPhone,
  toPublicUser,
} from '@/lib/auth/users'
import { deleteOtp, verifyPhoneOtp } from '@/lib/otp'
import { jsonWithSession } from '@/lib/auth/issueSession'
import { isValidIndianMobile, normalizePhone } from '@/lib/phone'
import { validateName } from '@/lib/validation'

export async function POST(request: NextRequest) {
  try {
    const { phone, otp, name } = await request.json()

    if (!phone?.trim() || !otp?.trim()) {
      return NextResponse.json(
        { error: 'Mobile number and verification code are required' },
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
    const result = await verifyPhoneOtp(normalized, 'phone_login', otp)
    if (!result.ok) {
      return NextResponse.json(
        { error: result.error },
        { status: result.status },
      )
    }

    let record = await findUserByPhone(normalized)

    if (!record) {
      const nameError = validateName(name || '')
      if (nameError) {
        return NextResponse.json({ error: nameError, needsName: true }, { status: 400 })
      }
      record = await createPhoneUser(name.trim(), normalized)
    }

    await deleteOtp(result.record.id)
    return jsonWithSession(toPublicUser(record))
  } catch {
    return NextResponse.json({ error: 'Sign in failed' }, { status: 500 })
  }
}
