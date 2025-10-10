export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  age?: number
  phoneNumber?: string
  avatarUrl?: string
  description?: string
  roles: string[]
  isEmailVerified: boolean
  isActive: boolean
  lastActivity?: string
  createdAt: string
  updatedAt: string
  isAdmin?: boolean
  isSuperAdmin?: boolean
}

export interface AuthResponse {
  message: string
  user: User
  accessToken: string
  refreshToken: string
  expiresIn: number
}

export interface SignInData {
  email: string
  password: string
}

export interface ForgotPasswordData {
  email: string
}

export interface VerifyPasswordResetData {
  otp: string
  newPassword: string
}

export interface AuthCheckResponse {
  authenticated: boolean
}

export interface LogoutResponse {
  message: string
}

export interface PasswordResetResponse {
  message: string
}
