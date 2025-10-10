import { apiClient } from '@/lib/api-client'
import { 
  Role, 
  CreateRoleRequest, 
  UpdateRoleRequest 
} from './types'

export const rolesMutations = {
  // Create role
  createRole: async (data: CreateRoleRequest): Promise<Role> => {
    return apiClient.post<Role>('/roles', data)
  },

  // Update role
  updateRole: async (id: string, data: UpdateRoleRequest): Promise<Role> => {
    return apiClient.patch<Role>(`/roles/${id}`, data)
  },

  // Delete role
  deleteRole: async (id: string): Promise<void> => {
    return apiClient.delete<void>(`/roles/${id}`)
  },
}
