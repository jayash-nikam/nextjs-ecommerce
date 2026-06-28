import { NextRequest, NextResponse } from 'next/server'

export const SESSION_COOKIE = 'ai-store-session'
export const GOOGLE_OAUTH_STATE_COOKIE = 'ai-store-google-state'

const SESSION_MAX_AGE_SECONDS = Number(
  process.env.SESSION_MAX_AGE_SECONDS || 60 * 60 * 24 * 7,
)

export function getSessionMaxAgeSeconds(): number {
  return SESSION_MAX_AGE_SECONDS
}

export function getSessionCookie(request: NextRequest): string | null {
  return request.cookies.get(SESSION_COOKIE)?.value ?? null
}

export function setSessionCookie(
  response: NextResponse,
  token: string,
): NextResponse {
  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE_SECONDS,
  })
  return response
}

export function clearSessionCookie(response: NextResponse): NextResponse {
  response.cookies.set(SESSION_COOKIE, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  })
  return response
}
