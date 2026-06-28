import { NextResponse } from 'next/server'
import { UserPublic } from '@/types/user'
import { createSession } from '@/lib/auth/sessions'
import { setSessionCookie } from '@/lib/auth/cookies'

export async function jsonWithSession(
  user: UserPublic,
  init?: { status?: number },
): Promise<NextResponse> {
  const session = await createSession(user.id)
  const response = NextResponse.json({ user }, { status: init?.status ?? 200 })
  return setSessionCookie(response, session.token)
}

export async function redirectWithSession(
  user: UserPublic,
  redirectPath = '/account',
): Promise<NextResponse> {
  const session = await createSession(user.id)
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const response = NextResponse.redirect(new URL(redirectPath, siteUrl))
  return setSessionCookie(response, session.token)
}
