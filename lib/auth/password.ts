import { createHash, createHmac, timingSafeEqual } from 'crypto'

const SALT = process.env.AUTH_SALT || 'ai-store-dev-salt'
const SESSION_SECRET = process.env.AUTH_SECRET || 'ai-store-dev-secret'

export function hashPassword(password: string): string {
  return createHash('sha256').update(`${SALT}:${password}`).digest('hex')
}

export function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash
}

export function createSessionToken(userId: number): string {
  const sig = createHmac('sha256', SESSION_SECRET)
    .update(String(userId))
    .digest('hex')
  return `${userId}.${sig}`
}

export function verifySessionToken(token: string): number | null {
  const [idStr, sig] = token.split('.')
  if (!idStr || !sig) return null

  const userId = Number(idStr)
  if (!Number.isFinite(userId)) return null

  const expected = createHmac('sha256', SESSION_SECRET)
    .update(String(userId))
    .digest('hex')

  try {
    const valid = timingSafeEqual(Buffer.from(sig), Buffer.from(expected))
    return valid ? userId : null
  } catch {
    return null
  }
}

export function getTokenFromHeader(authHeader: string | null): string | null {
  if (!authHeader?.startsWith('Bearer ')) return null
  return authHeader.slice(7).trim() || null
}
