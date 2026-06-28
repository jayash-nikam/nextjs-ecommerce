import { NextRequest, NextResponse } from 'next/server'
import { getTokenFromHeader, verifySessionToken } from '@/lib/auth/password'
import { getSessionCookie, setSessionCookie } from '@/lib/auth/cookies'
import { createSession } from '@/lib/auth/sessions'
import { findUserById, getUserFromRequest, toPublicUser } from '@/lib/auth/users'

export async function GET(request: NextRequest) {
  try {
    let user = await getUserFromRequest(request)

    if (!user) {
      const bearerToken = getTokenFromHeader(
        request.headers.get('authorization'),
      )
      if (bearerToken) {
        const legacyUserId = verifySessionToken(bearerToken)
        if (legacyUserId) {
          const record = await findUserById(legacyUserId)
          if (record) {
            user = toPublicUser(record)
            const session = await createSession(user.id)
            const response = NextResponse.json({ user })
            return setSessionCookie(response, session.token)
          }
        }
      }

      return NextResponse.json({ user: null }, { status: 401 })
    }

    const cookieToken = getSessionCookie(request)
    if (!cookieToken) {
      const session = await createSession(user.id)
      const response = NextResponse.json({ user })
      return setSessionCookie(response, session.token)
    }

    return NextResponse.json({ user })
  } catch {
    return NextResponse.json({ error: 'Session check failed' }, { status: 500 })
  }
}
