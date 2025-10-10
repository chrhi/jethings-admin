import { apiClient } from './api-client'
import { 
  User, 
  AuthResponse, 
  SignInData, 
  ForgotPasswordData, 
  VerifyPasswordResetData 
} from '@/features/auth/types'


async function refreshTokenHelper(): Promise<AuthResponse> {
  return apiClient.post<AuthResponse>('/auth/refresh-token')
}


function clearUserData(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('user_data')
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
  }
}


export const authService = {

  async signIn(credentials: SignInData): Promise<AuthResponse> {
    console.log('Signing in with:', credentials.email);
    const response = await apiClient.post<AuthResponse>('/auth/signin', credentials);
    
    
    if (response.accessToken) {
      localStorage.setItem('accessToken', response.accessToken);
    }
    if (response.refreshToken) {
      localStorage.setItem('refreshToken', response.refreshToken);
    }
    
    console.log('Sign in response:', response);
    return response;
  },


  async getCurrentUser(): Promise<User> {
    return apiClient.get<User>('/users/me')
  },


  async refreshAccessToken(): Promise<AuthResponse> {
    return refreshTokenHelper()
  },

  
  async logout(): Promise<{ message: string }> {
    console.log('Auth service: Calling logout API');
    const response = await apiClient.post<{ message: string }>('/auth/logout');
    
  
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user_data');
    
    console.log('Auth service: Logout API response:', response);
    return response;
  },


  async requestPasswordReset(data: ForgotPasswordData): Promise<{ message: string }> {
    return apiClient.post<{ message: string }>('/auth/request-password-reset', data)
  },

  
  async verifyPasswordReset(data: VerifyPasswordResetData): Promise<{ message: string }> {
    return apiClient.post<{ message: string }>('/auth/verify-password-reset', data)
  },


  async isAuthenticated(): Promise<boolean> {
    try {
      const response = await apiClient.get<{ authenticated: boolean }>('/auth/check');
      return response.authenticated;
    } catch (error) {
      console.error('Auth check failed:', error);
      return false;
    }
  },

  
  getStoredUser(): User | null {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('user_data')
      if (stored) {
        try {
          return JSON.parse(stored)
        } catch {
          return null
        }
      }
    }
    return null
  },


  setStoredUser(user: User): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('user_data', JSON.stringify(user))
    }
  },


  clearStoredUser(): void {
    clearUserData()
  },

  // Check if token needs refresh (not applicable with direct backend calls)
  needsRefresh(): boolean {
    return false
  }
}
