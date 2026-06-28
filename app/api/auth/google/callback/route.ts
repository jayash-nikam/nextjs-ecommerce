import { NextRequest, NextResponse } from 'next/server'
import {
  exchangeGoogleCode,
  isGoogleAuthConfigured,
} from '@/lib/auth/google'
import { GOOGLE_OAUTH_STATE_COOKIE } from '@/lib/auth/cookies'
import { upsertGoogleUser, toPublicUser } from '@/lib/auth/users'
import { redirectWithSession } from '@/lib/auth/issueSession'

export async function GET(request: NextRequest) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const loginUrl = new URL('/account/login', siteUrl)

  if (!isGoogleAuthConfigured()) {
    loginUrl.searchParams.set('error', 'google_not_configured')
    return NextResponse.redirect(loginUrl)
  }

  const { searchParams } = request.nextUrl
  const error = searchParams.get('error')
  if (error) {
    loginUrl.searchParams.set('error', 'google_denied')
    return NextResponse.redirect(loginUrl)
  }

  const code = searchParams.get('code')
  const state = searchParams.get('state')
  const savedState = request.cookies.get(GOOGLE_OAUTH_STATE_COOKIE)?.value

  if (!code || !state || !savedState || state !== savedState) {
    loginUrl.searchParams.set('error', 'google_invalid')
    return NextResponse.redirect(loginUrl)
  }

  try {
    const profile = await exchangeGoogleCode(code)
    if (!profile.email_verified) {
      loginUrl.searchParams.set('error', 'google_unverified')
      return NextResponse.redirect(loginUrl)
    }

    const record = await upsertGoogleUser(profile)
    const user = toPublicUser(record)
    const response = await redirectWithSession(user, '/account')
    response.cookies.set(GOOGLE_OAUTH_STATE_COOKIE, '', { maxAge: 0, path: '/' })
    return response
  } catch {
    loginUrl.searchParams.set('error', 'google_failed')
    return NextResponse.redirect(loginUrl)
  }
}
