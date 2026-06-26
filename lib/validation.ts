export type FieldErrors<T> = Partial<Record<keyof T, string>>

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_RE = /^(\+91[\s-]?)?[6-9]\d{9}$/
const PINCODE_RE = /^[1-9][0-9]{5}$/
const NAME_RE = /^[a-zA-Z\s.'-]{2,60}$/

export function validateRequired(value: string, label: string): string | null {
  if (!value.trim()) return `${label} is required`
  return null
}

export function validateEmail(value: string): string | null {
  const trimmed = value.trim()
  if (!trimmed) return 'Email is required'
  if (!EMAIL_RE.test(trimmed)) return 'Enter a valid email address'
  return null
}

export function validatePassword(value: string): string | null {
  if (!value) return 'Password is required'
  if (value.length < 6) return 'Password must be at least 6 characters'
  if (value.length > 72) return 'Password is too long'
  return null
}

export function validateConfirmPassword(
  password: string,
  confirm: string,
): string | null {
  if (!confirm) return 'Please confirm your password'
  if (password !== confirm) return 'Passwords do not match'
  return null
}

export function validateName(value: string): string | null {
  const trimmed = value.trim()
  if (!trimmed) return 'Name is required'
  if (trimmed.length < 2) return 'Name must be at least 2 characters'
  if (!NAME_RE.test(trimmed)) return 'Name contains invalid characters'
  return null
}

export function validatePhone(value: string): string | null {
  const normalized = value.replace(/\s/g, '')
  if (!normalized) return 'Phone number is required'
  if (!PHONE_RE.test(normalized)) {
    return 'Enter a valid 10-digit Indian mobile number'
  }
  return null
}

export function validatePincode(value: string): string | null {
  const trimmed = value.trim()
  if (!trimmed) return 'Pincode is required'
  if (!PINCODE_RE.test(trimmed)) return 'Enter a valid 6-digit pincode'
  return null
}

export function validateLabel(value: string): string | null {
  const trimmed = value.trim()
  if (!trimmed) return 'Label is required'
  if (trimmed.length < 2) return 'Label must be at least 2 characters'
  return null
}

export function validateAddressLine(value: string): string | null {
  const trimmed = value.trim()
  if (!trimmed) return 'Address is required'
  if (trimmed.length < 5) return 'Address must be at least 5 characters'
  return null
}

export function validateCity(value: string): string | null {
  const trimmed = value.trim()
  if (!trimmed) return 'City is required'
  if (trimmed.length < 2) return 'Enter a valid city name'
  return null
}

export function validateState(value: string): string | null {
  const trimmed = value.trim()
  if (!trimmed) return 'State is required'
  if (trimmed.length < 2) return 'Enter a valid state name'
  return null
}

export function validateContactMessage(value: string): string | null {
  const trimmed = value.trim()
  if (!trimmed) return 'Message is required'
  if (trimmed.length < 10) return 'Message must be at least 10 characters'
  if (trimmed.length > 2000) return 'Message is too long (max 2000 characters)'
  return null
}

export function validateSubject(value: string): string | null {
  const trimmed = value.trim()
  if (!trimmed) return 'Subject is required'
  if (trimmed.length < 3) return 'Subject must be at least 3 characters'
  return null
}

export function validateOtp(value: string): string | null {
  const trimmed = value.trim()
  if (!trimmed) return 'Verification code is required'
  if (!/^\d{6}$/.test(trimmed)) return 'Enter the 6-digit code from your email'
  return null
}

export function hasErrors<T>(errors: FieldErrors<T>): boolean {
  return Object.values(errors).some(Boolean)
}
