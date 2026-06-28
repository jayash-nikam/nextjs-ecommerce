import { NextResponse } from 'next/server'
import { isGoogleAuthConfigured } from '@/lib/auth/google'

export async function GET() {
  return NextResponse.json({ enabled: isGoogleAuthConfigured() })
}
