import { apiClient } from '@/lib/api-client'
import { 
  Role, 
  RoleFilters, 
  RoleResponse 
} from './types'

export const rolesQueries = {
  // Fetch roles with filters
  fetchRoles: async (filters: RoleFilters = {}): Promise<RoleResponse> => {
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

    return apiClient.get<RoleResponse>(`/roles?${params}`)
  },

  // Fetch role by ID
  fetchRoleById: async (id: string): Promise<Role> => {
    return apiClient.get<Role>(`/roles/${id}`)
  },
}
