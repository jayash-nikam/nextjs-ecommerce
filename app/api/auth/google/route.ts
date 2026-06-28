import { NextResponse } from 'next/server'
import {
  createOAuthState,
  getGoogleAuthUrl,
  isGoogleAuthConfigured,
} from '@/lib/auth/google'
import { GOOGLE_OAUTH_STATE_COOKIE } from '@/lib/auth/cookies'

export async function GET() {
  if (!isGoogleAuthConfigured()) {
    return NextResponse.json(
      { error: 'Google sign-in is not configured' },
      { status: 503 },
    )
  }

  const state = createOAuthState()
  const response = NextResponse.redirect(getGoogleAuthUrl(state))
  response.cookies.set(GOOGLE_OAUTH_STATE_COOKIE, state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 10,
  })
  return response
}
