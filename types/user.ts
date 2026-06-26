export type UserRole = 'admin' | 'user'

export interface UserPublic {
  id: number
  email: string
  name: string
  role: UserRole
}

export interface UserRecord extends UserPublic {
  password: string
  createdAt: string
}
