import { NextRequest, NextResponse } from 'next/server'
import { getTokenFromHeader } from '@/lib/auth/password'
import { getSessionCookie, clearSessionCookie } from '@/lib/auth/cookies'
import { deleteSessionByToken } from '@/lib/auth/sessions'

export async function POST(request: NextRequest) {
  try {
    const cookieToken = getSessionCookie(request)
    const bearerToken = getTokenFromHeader(request.headers.get('authorization'))
    const token = cookieToken ?? bearerToken

    if (token) {
      await deleteSessionByToken(token)
    }

    const response = NextResponse.json({ success: true })
    return clearSessionCookie(response)
  } catch {
    return NextResponse.json({ error: 'Logout failed' }, { status: 500 })
  }
}
