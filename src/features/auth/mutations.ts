import { apiClient } from '@/lib/api-client'
import { 
  AuthResponse, 
  SignInData, 
  ForgotPasswordData, 
  VerifyPasswordResetData, 
  LogoutResponse, 
  PasswordResetResponse 
} from './types'

export const authMutations = {
  // Sign in user
  signIn: async (data: SignInData): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/signin', data)
    
    // Save tokens to localStorage
    if (response.accessToken) {
      localStorage.setItem('accessToken', response.accessToken)
    }
    if (response.refreshToken) {
      localStorage.setItem('refreshToken', response.refreshToken)
    }
    
    // Save user data
    if (response.user) {
      localStorage.setItem('user_data', JSON.stringify(response.user))
    }
    
    return response
  },

  // Logout user
  logout: async (): Promise<LogoutResponse> => {
    const response = await apiClient.post<LogoutResponse>('/auth/logout')
    
    // Clear tokens from localStorage
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user_data')
    
    return response
  },

  // Refresh access token
  refreshToken: async (): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/refresh-token')
    
    // Save new tokens to localStorage
    if (response.accessToken) {
      localStorage.setItem('accessToken', response.accessToken)
    }
    if (response.refreshToken) {
      localStorage.setItem('refreshToken', response.refreshToken)
    }
    
    // Update user data if provided
    if (response.user) {
      localStorage.setItem('user_data', JSON.stringify(response.user))
    }
    
    return response
  },

  // Request password reset
  requestPasswordReset: async (data: ForgotPasswordData): Promise<PasswordResetResponse> => {
    return apiClient.post<PasswordResetResponse>('/auth/request-password-reset', data)
  },

  // Verify password reset
  verifyPasswordReset: async (data: VerifyPasswordResetData): Promise<PasswordResetResponse> => {
    return apiClient.post<PasswordResetResponse>('/auth/verify-password-reset', data)
  },
}
