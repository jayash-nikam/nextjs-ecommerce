export type OtpPurpose = 'register' | 'reset'

export interface RegisterOtpPayload {
  name: string
  passwordHash: string
}

export interface OtpRecord {
  id: number
  email: string
  codeHash: string
  purpose: OtpPurpose
  payload?: RegisterOtpPayload
  expiresAt: string
  attempts: number
  createdAt: string
}
