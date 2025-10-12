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
    
    // Set tokens in cookies via API route
    if (response.accessToken) {
      await fetch('/api/auth/set-tokens', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accessToken: response.accessToken,
          refreshToken: response.refreshToken,
        }),
      });
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
    
    // Clear tokens from cookies via API route
    await fetch('/api/auth/clear-tokens', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
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
}
