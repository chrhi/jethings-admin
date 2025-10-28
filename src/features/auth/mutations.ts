import { apiClient } from '@/lib/api-client'
import { 
  AuthResponse, 
  SignInData, 
  ForgotPasswordData, 
  VerifyPasswordResetData, 
  LogoutResponse, 
  PasswordResetResponse,
  AcceptInvitationData,
  AcceptInvitationResponse
} from './types'
import { removeCookie, setCookie } from '@/lib/cookies'

export const authMutations = {
  // Sign in user
  signIn: async (data: SignInData): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/signin', data)
    
    
        // Save tokens to cookies
        if (response.accessToken) {
          setCookie('accessToken', response.accessToken, 7) // 7 days
        }
        if (response.refreshToken) {
          setCookie('refreshToken', response.refreshToken, 30) // 30 days
        }
        
        // Save user data to localStorage
        if (response.user) {
          localStorage.setItem('user_data', JSON.stringify(response.user))
        }
    return response
  },

  // Logout user
  logout: async (): Promise<LogoutResponse> => {
    const response = await apiClient.post<LogoutResponse>('/auth/logout')
    
  
     // Clear tokens from cookies
     removeCookie('accessToken')
     removeCookie('refreshToken')
     
     // Clear user data from localStorage
     localStorage.removeItem('user_data')
    
    return response
  },

  // Token refresh is now handled automatically by the proxy route
  // This mutation is kept for backward compatibility but is no longer needed
  refreshToken: async (): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/refresh-token')
    
    // Note: Token refresh is now handled automatically by the proxy route
    // This is kept for backward compatibility
    
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

  // Accept invitation
  acceptInvitation: async (data: AcceptInvitationData): Promise<AcceptInvitationResponse> => {
    return apiClient.post<AcceptInvitationResponse>('/auth/accept-invitation', data)
  },
}
