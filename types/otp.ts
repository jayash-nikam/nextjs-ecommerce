export type OtpPurpose = 'register' | 'reset' | 'phone_login'

export interface RegisterOtpPayload {
  name: string
  passwordHash: string
}

export interface PhoneLoginOtpPayload {
  name?: string
}

export type OtpPayload = RegisterOtpPayload | PhoneLoginOtpPayload

export interface OtpRecord {
  id: number
  email: string
  phone: string | null
  codeHash: string
  purpose: OtpPurpose
  payload?: OtpPayload
  expiresAt: string
  attempts: number
  createdAt: string
}
