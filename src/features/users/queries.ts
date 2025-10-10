import { apiClient } from '@/lib/api-client'
import { 
  User, 
  UserFilters, 
  UserStats, 
  UsersResponse 
} from './types'

export const usersQueries = {
  // Fetch users with filters
  fetchUsers: async (filters: UserFilters = {}): Promise<UsersResponse> => {
    const params = new URLSearchParams()
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach(v => params.append(`${key}[]`, v))
        } else {
          params.append(key, String(value))
        }
      }
    })

    // Backend response structure
    interface BackendUsersResponse {
      user: User[];
      pagination: {
        page: string;
        limit: string;
        total: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
      };
    }

    const backendResponse = await apiClient.get<BackendUsersResponse>(`/users?${params}`)
    
    // Transform backend response to frontend format
    return {
      users: backendResponse.user.map(user => ({
        ...user,
        roles: user.roles || [], // Ensure roles field exists
      })),
      pagination: {
        page: parseInt(backendResponse.pagination.page),
        limit: parseInt(backendResponse.pagination.limit),
        total: backendResponse.pagination.total,
        totalPages: backendResponse.pagination.totalPages,
        hasNext: backendResponse.pagination.hasNext,
        hasPrev: backendResponse.pagination.hasPrev,
      }
    }
  },

  // Fetch user stats
  fetchUserStats: async (): Promise<UserStats> => {
    return apiClient.get<UserStats>('/users/stats')
  },

  // Fetch current user
  fetchCurrentUser: async (): Promise<User> => {
    return apiClient.get<User>('/users/me')
  },

  // Fetch user by ID
  fetchUserById: async (id: string): Promise<User> => {
    return apiClient.get<User>(`/users/${id}`)
  },

  // Fetch admins
  fetchAdmins: async (): Promise<User[]> => {
    return apiClient.get<User[]>('/users/admins')
  },
}
