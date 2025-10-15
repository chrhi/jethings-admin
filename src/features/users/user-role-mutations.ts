import { apiClient } from '@/lib/api-client'
import { 
  UserRole, 
  UserRoleWithDetails, 
  AssignRoleRequest, 
  UpdateUserRoleRequest,
  UserRoleResponse 
} from './user-role-types'

export const userRoleMutations = {
  // Assign a role to a user
  assignRole: async (data: AssignRoleRequest): Promise<UserRole> => {
    return apiClient.post<UserRole>('/user-roles', data)
  },

  // Remove a role from a user
  unassignRole: async (id: string): Promise<UserRoleResponse> => {
    return apiClient.delete<UserRoleResponse>(`/user-roles/${id}`)
  },

  // Update a user-role assignment (currently only active status)
  updateUserRole: async ({ id, data }: { id: string; data: UpdateUserRoleRequest }): Promise<UserRole> => {
    return apiClient.patch<UserRole>(`/user-roles/${id}`, data)
  },
}
