import { apiClient } from '@/lib/api-client'
import { User, AuthCheckResponse } from './types'

export const authQueries = {
  // Check if user is authenticated
  checkAuth: async (): Promise<AuthCheckResponse> => {
    return apiClient.get<AuthCheckResponse>('/auth/check')
  },

  // Get current user
  getCurrentUser: async (): Promise<User> => {
    return apiClient.get<User>('/users/me')
  },
}
