import { NextRequest } from 'next/server'
import { UserPublic } from '@/types/user'
import { getUserFromRequest } from '@/lib/auth/users'

export async function getAdminFromRequest(
  request: NextRequest,
): Promise<UserPublic | null> {
  const user = await getUserFromRequest(request)
  if (!user || user.role !== 'admin') return null
  return user
}
