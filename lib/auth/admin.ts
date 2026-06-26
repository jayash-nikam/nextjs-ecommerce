import { UserPublic } from '@/types/user'
import { getUserFromRequest } from '@/lib/auth/users'

export async function getAdminFromRequest(
  authHeader: string | null,
): Promise<UserPublic | null> {
  const user = await getUserFromRequest(authHeader)
  if (!user || user.role !== 'admin') return null
  return user
}
