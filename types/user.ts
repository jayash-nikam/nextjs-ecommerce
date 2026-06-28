export type UserRole = 'admin' | 'user'

export type AuthProvider = 'email' | 'google' | 'phone'

export interface UserPublic {
  id: number
  email: string | null
  phone: string | null
  name: string
  role: UserRole
  authProvider: AuthProvider
  avatarUrl: string | null
}

export interface UserRecord extends UserPublic {
  password: string | null
  googleId: string | null
  createdAt: string
}
