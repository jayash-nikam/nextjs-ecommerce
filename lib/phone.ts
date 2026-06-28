export function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  if (digits.length === 10) return digits
  if (digits.length === 12 && digits.startsWith('91')) return digits.slice(2)
  if (digits.length === 11 && digits.startsWith('0')) return digits.slice(1)
  return digits
}

export function formatPhoneDisplay(phone: string): string {
  const normalized = normalizePhone(phone)
  if (normalized.length !== 10) return phone
  return `+91 ${normalized.slice(0, 5)} ${normalized.slice(5)}`
}

export function isValidIndianMobile(phone: string): boolean {
  return /^[6-9]\d{9}$/.test(normalizePhone(phone))
}
