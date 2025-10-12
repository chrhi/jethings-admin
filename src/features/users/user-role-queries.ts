import { apiClient } from '@/lib/api-client'
import { 
  UserRoleWithDetails, 
  UserRolesResponse, 
  UserRoleFilters 
} from './user-role-types'

export const userRoleQueries = {
  // Fetch all user-role assignments with filters
  fetchUserRoles: async (filters: UserRoleFilters = {}): Promise<UserRolesResponse> => {
    const params = new URLSearchParams()
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value))
      }
    })

    return apiClient.get<UserRolesResponse>(`/user-roles?${params}`)
  },

  // Fetch all roles assigned to a specific user
  fetchRolesByUser: async (userId: string): Promise<UserRoleWithDetails[]> => {
    return apiClient.get<UserRoleWithDetails[]>(`/user-roles/by-user/${userId}`)
  },

  // Fetch all users that have a specific role
  fetchUsersByRole: async (roleId: string): Promise<UserRoleWithDetails[]> => {
    return apiClient.get<UserRoleWithDetails[]>(`/user-roles/by-role/${roleId}`)
  },

  // Fetch a user-role assignment by ID
  fetchUserRoleById: async (id: string): Promise<UserRoleWithDetails> => {
    return apiClient.get<UserRoleWithDetails>(`/user-roles/${id}`)
  },
}
