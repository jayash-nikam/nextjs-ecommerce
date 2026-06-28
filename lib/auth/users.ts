import { NextRequest } from 'next/server'
import { UserPublic, UserRecord, AuthProvider } from '@/types/user'
import { getSessionCookie } from '@/lib/auth/cookies'
import { findSessionByToken } from '@/lib/auth/sessions'
import { normalizePhone } from '@/lib/phone'
import {
  hashPassword,
  verifyPassword,
  createSessionToken,
  verifySessionToken,
  getTokenFromHeader,
} from '@/lib/auth/password'
import type { GoogleUserInfo } from '@/lib/auth/google'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL

if (!BASE_URL) {
  throw new Error('NEXT_PUBLIC_API_URL is not defined')
}

export { getTokenFromHeader, verifySessionToken, createSessionToken }

function inferAuthProvider(user: UserRecord): AuthProvider {
  if (user.authProvider) return user.authProvider
  if (user.googleId) return 'google'
  if (user.phone) return 'phone'
  return 'email'
}

export function toPublicUser(user: UserRecord): UserPublic {
  return {
    id: user.id,
    email: user.email ?? null,
    phone: user.phone ?? null,
    name: user.name,
    role: user.role || 'user',
    authProvider: inferAuthProvider(user),
    avatarUrl: user.avatarUrl ?? null,
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

export async function findUserByPhone(
  phone: string,
): Promise<UserRecord | null> {
  const normalized = normalizePhone(phone)
  const res = await fetch(
    `${BASE_URL}/users?phone=${encodeURIComponent(normalized)}`,
    { cache: 'no-store' },
  )
  if (!res.ok) return null
  const users: UserRecord[] = await res.json()
  return users[0] ?? null
}

export async function findUserByGoogleId(
  googleId: string,
): Promise<UserRecord | null> {
  const res = await fetch(
    `${BASE_URL}/users?googleId=${encodeURIComponent(googleId)}`,
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

async function postUser(data: Record<string, unknown>): Promise<UserRecord> {
  const res = await fetch(`${BASE_URL}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    throw new Error('Failed to create user')
  }

  return res.json()
}

export async function createUser(
  name: string,
  email: string,
  password: string,
): Promise<UserRecord> {
  return postUser({
    name,
    email: email.toLowerCase(),
    phone: null,
    password: hashPassword(password),
    googleId: null,
    avatarUrl: null,
    authProvider: 'email',
    role: 'user',
    createdAt: new Date().toISOString(),
  })
}

export async function createUserFromHash(
  name: string,
  email: string,
  passwordHash: string,
): Promise<UserRecord> {
  return postUser({
    name,
    email: email.toLowerCase(),
    phone: null,
    password: passwordHash,
    googleId: null,
    avatarUrl: null,
    authProvider: 'email',
    role: 'user',
    createdAt: new Date().toISOString(),
  })
}

export async function createPhoneUser(
  name: string,
  phone: string,
): Promise<UserRecord> {
  const normalized = normalizePhone(phone)
  return postUser({
    name: name.trim(),
    email: null,
    phone: normalized,
    password: null,
    googleId: null,
    avatarUrl: null,
    authProvider: 'phone',
    role: 'user',
    createdAt: new Date().toISOString(),
  })
}

export async function upsertGoogleUser(
  profile: GoogleUserInfo,
): Promise<UserRecord> {
  const byGoogle = await findUserByGoogleId(profile.sub)
  if (byGoogle) {
    return patchUser(byGoogle.id, {
      name: profile.name || byGoogle.name,
      email: profile.email.toLowerCase(),
      avatarUrl: profile.picture ?? byGoogle.avatarUrl,
      authProvider: 'google',
    })
  }

  const byEmail = await findUserByEmail(profile.email)
  if (byEmail) {
    return patchUser(byEmail.id, {
      googleId: profile.sub,
      name: profile.name || byEmail.name,
      avatarUrl: profile.picture ?? byEmail.avatarUrl,
      authProvider: byEmail.authProvider === 'phone' ? 'phone' : 'google',
    })
  }

  return postUser({
    name: profile.name,
    email: profile.email.toLowerCase(),
    phone: null,
    password: null,
    googleId: profile.sub,
    avatarUrl: profile.picture ?? null,
    authProvider: 'google',
    role: 'user',
    createdAt: new Date().toISOString(),
  })
}

async function patchUser(
  id: number,
  data: Partial<UserRecord>,
): Promise<UserRecord> {
  const res = await fetch(`${BASE_URL}/users/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    throw new Error('Failed to update user')
  }

  return res.json()
}

export async function updateUserPassword(
  userId: number,
  newPassword: string,
): Promise<UserRecord> {
  return patchUser(userId, { password: hashPassword(newPassword) })
}

export async function authenticateUser(
  email: string,
  password: string,
): Promise<UserPublic | null> {
  const user = await findUserByEmail(email)
  if (!user?.password || !verifyPassword(password, user.password)) return null
  return toPublicUser(user)
}

async function getUserIdFromToken(token: string): Promise<number | null> {
  const session = await findSessionByToken(token)
  if (session) return session.userId

  return verifySessionToken(token)
}

export async function getUserFromRequest(
  request: NextRequest,
): Promise<UserPublic | null> {
  const cookieToken = getSessionCookie(request)
  const bearerToken = getTokenFromHeader(request.headers.get('authorization'))
  const token = cookieToken ?? bearerToken
  if (!token) return null

  const userId = await getUserIdFromToken(token)
  if (!userId) return null

  const user = await findUserById(userId)
  return user ? toPublicUser(user) : null
}
