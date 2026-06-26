import { createHash } from 'crypto'
import type { OtpPurpose, OtpRecord, RegisterOtpPayload } from '@/types/otp'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL

if (!BASE_URL) {
  throw new Error('NEXT_PUBLIC_API_URL is not defined')
}

const OTP_SALT = process.env.AUTH_SALT || 'ai-store-dev-salt'
const OTP_EXPIRY_MINUTES = Number(process.env.OTP_EXPIRY_MINUTES || 10)
const MAX_ATTEMPTS = 5

export function generateOtpCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000))
}

export function hashOtp(code: string): string {
  return createHash('sha256').update(`${OTP_SALT}:otp:${code}`).digest('hex')
}

export function verifyOtpCode(code: string, hash: string): boolean {
  return hashOtp(code) === hash
}

function expiryDate(): string {
  return new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000).toISOString()
}

export function isOtpExpired(record: OtpRecord): boolean {
  return new Date(record.expiresAt).getTime() < Date.now()
}

export async function findOtp(
  email: string,
  purpose: OtpPurpose,
): Promise<OtpRecord | null> {
  const res = await fetch(
    `${BASE_URL}/otps?email=${encodeURIComponent(email.toLowerCase())}&purpose=${purpose}`,
    { cache: 'no-store' },
  )
  if (!res.ok) return null
  const records: OtpRecord[] = await res.json()
  return records.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )[0] ?? null
}

export async function deleteOtp(id: number): Promise<void> {
  await fetch(`${BASE_URL}/otps/${id}`, { method: 'DELETE' })
}

export async function deleteOtpsForEmail(
  email: string,
  purpose: OtpPurpose,
): Promise<void> {
  const res = await fetch(
    `${BASE_URL}/otps?email=${encodeURIComponent(email.toLowerCase())}&purpose=${purpose}`,
    { cache: 'no-store' },
  )
  if (!res.ok) return
  const records: OtpRecord[] = await res.json()
  await Promise.all(records.map((r) => deleteOtp(r.id)))
}

export async function createOtp(
  email: string,
  purpose: OtpPurpose,
  payload?: RegisterOtpPayload,
): Promise<{ record: OtpRecord; code: string }> {
  const normalized = email.toLowerCase().trim()
  await deleteOtpsForEmail(normalized, purpose)

  const code = generateOtpCode()
  const res = await fetch(`${BASE_URL}/otps`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: normalized,
      codeHash: hashOtp(code),
      purpose,
      payload: payload ?? null,
      expiresAt: expiryDate(),
      attempts: 0,
      createdAt: new Date().toISOString(),
    }),
  })

  if (!res.ok) {
    throw new Error('Failed to create OTP')
  }

  const record: OtpRecord = await res.json()
  return { record, code }
}

export type OtpVerifyResult =
  | { ok: true; record: OtpRecord }
  | { ok: false; error: string; status: number }

export async function verifyOtp(
  email: string,
  purpose: OtpPurpose,
  code: string,
): Promise<OtpVerifyResult> {
  const record = await findOtp(email, purpose)

  if (!record) {
    return { ok: false, error: 'No verification code found. Request a new one.', status: 400 }
  }

  if (isOtpExpired(record)) {
    await deleteOtp(record.id)
    return { ok: false, error: 'Verification code has expired. Request a new one.', status: 400 }
  }

  if (record.attempts >= MAX_ATTEMPTS) {
    await deleteOtp(record.id)
    return {
      ok: false,
      error: 'Too many failed attempts. Request a new code.',
      status: 429,
    }
  }

  if (!verifyOtpCode(code.trim(), record.codeHash)) {
    await fetch(`${BASE_URL}/otps/${record.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ attempts: record.attempts + 1 }),
    })
    return { ok: false, error: 'Invalid verification code', status: 400 }
  }

  return { ok: true, record }
}

export function isDevOtpExposed(): boolean {
  return process.env.NODE_ENV === 'development'
}
