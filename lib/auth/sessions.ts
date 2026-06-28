import { randomBytes } from 'crypto'
import { SessionRecord } from '@/types/session'
import { getSessionMaxAgeSeconds } from '@/lib/auth/cookies'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL

if (!BASE_URL) {
  throw new Error('NEXT_PUBLIC_API_URL is not defined')
}

function createSessionToken(): string {
  return randomBytes(32).toString('hex')
}

export function isSessionExpired(session: SessionRecord): boolean {
  return new Date(session.expiresAt).getTime() <= Date.now()
}

export async function createSession(userId: number): Promise<SessionRecord> {
  const now = new Date()
  const expiresAt = new Date(
    now.getTime() + getSessionMaxAgeSeconds() * 1000,
  )

  const res = await fetch(`${BASE_URL}/sessions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      token: createSessionToken(),
      userId,
      createdAt: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
    }),
  })

  if (!res.ok) {
    throw new Error('Failed to create session')
  }

  return res.json()
}

async function findSessionRecord(token: string): Promise<SessionRecord | null> {
  const res = await fetch(
    `${BASE_URL}/sessions?token=${encodeURIComponent(token)}`,
    { cache: 'no-store' },
  )
  if (!res.ok) return null

  const sessions: SessionRecord[] = await res.json()
  return sessions[0] ?? null
}

export async function findSessionByToken(
  token: string,
): Promise<SessionRecord | null> {
  const session = await findSessionRecord(token)
  if (!session) return null

  if (isSessionExpired(session)) {
    await deleteSessionById(session.id)
    return null
  }

  return session
}

export async function deleteSessionByToken(token: string): Promise<void> {
  const session = await findSessionRecord(token)
  if (!session) return
  await deleteSessionById(session.id)
}

async function deleteSessionById(id: number): Promise<void> {
  await fetch(`${BASE_URL}/sessions/${id}`, { method: 'DELETE' })
}

export async function deleteSessionsForUser(userId: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/sessions?userId=${userId}`, {
    cache: 'no-store',
  })
  if (!res.ok) return

  const sessions: SessionRecord[] = await res.json()
  await Promise.all(sessions.map((s) => deleteSessionById(s.id)))
}
