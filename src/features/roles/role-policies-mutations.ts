import { apiClient } from '@/lib/api-client'
import { RolePolicy } from './types/role-policy'

export const rolePoliciesMutations = {
  // Create role-policy
  createRolePolicy: async (data: { roleId: string; policyId: string }): Promise<RolePolicy> => {
    return apiClient.post<RolePolicy>('/role-policies', data)
  },

  // Delete role-policy
  deleteRolePolicy: async (id: string): Promise<void> => {
    return apiClient.delete<void>(`/role-policies/${id}`)
  },
}
