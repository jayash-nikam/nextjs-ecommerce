import { randomBytes } from 'crypto'

const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth'
const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token'
const GOOGLE_USERINFO_URL = 'https://www.googleapis.com/oauth2/v3/userinfo'

export interface GoogleUserInfo {
  sub: string
  email: string
  email_verified: boolean
  name: string
  picture?: string
}

export function isGoogleAuthConfigured(): boolean {
  return Boolean(
    process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET,
  )
}

export function createOAuthState(): string {
  return randomBytes(24).toString('hex')
}

export function getGoogleAuthUrl(state: string): string {
  const clientId = process.env.GOOGLE_CLIENT_ID
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const redirectUri = `${siteUrl}/api/auth/google/callback`

  const params = new URLSearchParams({
    client_id: clientId!,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'openid email profile',
    state,
    prompt: 'select_account',
    access_type: 'online',
  })

  return `${GOOGLE_AUTH_URL}?${params.toString()}`
}

export async function exchangeGoogleCode(
  code: string,
): Promise<GoogleUserInfo> {
  const clientId = process.env.GOOGLE_CLIENT_ID
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const redirectUri = `${siteUrl}/api/auth/google/callback`

  const tokenRes = await fetch(GOOGLE_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: clientId!,
      client_secret: clientSecret!,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    }),
  })

  if (!tokenRes.ok) {
    throw new Error('Failed to exchange Google authorization code')
  }

  const { access_token } = await tokenRes.json()
  if (!access_token) {
    throw new Error('Google did not return an access token')
  }

  const userRes = await fetch(GOOGLE_USERINFO_URL, {
    headers: { Authorization: `Bearer ${access_token}` },
  })

  if (!userRes.ok) {
    throw new Error('Failed to fetch Google user profile')
  }

  return userRes.json()
}
