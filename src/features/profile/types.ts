export interface UserProfile {
  id: string
  firstName: string
  lastName: string
  email: string
  phoneNumber?: string
  age?: number
  description?: string
  avatarUrl?: string
  isActive: boolean
  isEmailVerified: boolean
  roles: string[]
  createdAt: string
  updatedAt: string
  lastActivity?: string
}

export interface UpdateProfileRequest {
  firstName?: string
  lastName?: string
  phoneNumber?: string
  age?: number
  description?: string
}

export interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
}
