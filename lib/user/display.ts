import { formatPhoneDisplay } from '@/lib/phone'
import type { UserPublic } from '@/types/user'

export function getUserContact(user: Pick<UserPublic, 'email' | 'phone'>): string {
  if (user.email) return user.email
  if (user.phone) return formatPhoneDisplay(user.phone)
  return '—'
}

export function getAuthProviderLabel(provider: UserPublic['authProvider']): string {
  switch (provider) {
    case 'google':
      return 'Google'
    case 'phone':
      return 'Mobile OTP'
    default:
      return 'Email & password'
  }
}
