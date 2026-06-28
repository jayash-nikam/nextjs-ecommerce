import { NextRequest, NextResponse } from 'next/server'
import { authenticateUser } from '@/lib/auth/users'
import { jsonWithSession } from '@/lib/auth/issueSession'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email?.trim() || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 },
      )
    }

    const user = await authenticateUser(email.trim(), password)
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 },
      )
    }

    return jsonWithSession(user)
  } catch {
    return NextResponse.json({ error: 'Login failed' }, { status: 500 })
  }
}
