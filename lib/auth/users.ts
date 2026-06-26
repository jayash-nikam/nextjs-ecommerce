import { UserPublic, UserRecord } from '@/types/user'
import {
  hashPassword,
  verifyPassword,
  createSessionToken,
  verifySessionToken,
  getTokenFromHeader,
} from '@/lib/auth/password'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL

if (!BASE_URL) {
  throw new Error('NEXT_PUBLIC_API_URL is not defined')
}

export { getTokenFromHeader, verifySessionToken, createSessionToken }

export function toPublicUser(user: UserRecord): UserPublic {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role || 'user',
  }
}

export async function findUserByEmail(
  email: string,
): Promise<UserRecord | null> {
  const res = await fetch(
    `${BASE_URL}/users?email=${encodeURIComponent(email.toLowerCase())}`,
    { cache: 'no-store' },
  )
  if (!res.ok) return null
  const users: UserRecord[] = await res.json()
  return users[0] ?? null
}

export async function findUserById(id: number): Promise<UserRecord | null> {
  const res = await fetch(`${BASE_URL}/users/${id}`, { cache: 'no-store' })
  if (!res.ok) return null
  return res.json()
}

export async function createUser(
  name: string,
  email: string,
  password: string,
): Promise<UserRecord> {
  const res = await fetch(`${BASE_URL}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name,
      email: email.toLowerCase(),
      password: hashPassword(password),
      role: 'user',
      createdAt: new Date().toISOString(),
    }),
  })

  if (!res.ok) {
    throw new Error('Failed to create user')
  }

  return res.json()
}

export async function createUserFromHash(
  name: string,
  email: string,
  passwordHash: string,
): Promise<UserRecord> {
  const res = await fetch(`${BASE_URL}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name,
      email: email.toLowerCase(),
      password: passwordHash,
      role: 'user',
      createdAt: new Date().toISOString(),
    }),
  })

  if (!res.ok) {
    throw new Error('Failed to create user')
  }

  return res.json()
}

export async function updateUserPassword(
  userId: number,
  newPassword: string,
): Promise<UserRecord> {
  const res = await fetch(`${BASE_URL}/users/${userId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password: hashPassword(newPassword) }),
  })

  if (!res.ok) {
    throw new Error('Failed to update password')
  }

  return res.json()
}

export async function authenticateUser(
  email: string,
  password: string,
): Promise<UserPublic | null> {
  const user = await findUserByEmail(email)
  if (!user || !verifyPassword(password, user.password)) return null
  return toPublicUser(user)
}

export async function getUserFromRequest(
  authHeader: string | null,
): Promise<UserPublic | null> {
  const token = getTokenFromHeader(authHeader)
  if (!token) return null

  const userId = verifySessionToken(token)
  if (!userId) return null

  const user = await findUserById(userId)
  return user ? toPublicUser(user) : null
}
