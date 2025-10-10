import { apiClient } from '@/lib/api-client'
import { RolePolicy } from './types/role-policy'

export const rolePoliciesQueries = {
  // Fetch role-policies
  fetchRolePolicies: async (): Promise<RolePolicy[]> => {
    return apiClient.get<RolePolicy[]>('/role-policies')
  },

  // Fetch role-policies by role
  fetchRolePoliciesByRole: async (roleId: string): Promise<RolePolicy[]> => {
    return apiClient.get<RolePolicy[]>(`/role-policies/by-role/${roleId}`)
  },

  // Fetch role-policies by policy
  fetchRolePoliciesByPolicy: async (policyId: string): Promise<RolePolicy[]> => {
    return apiClient.get<RolePolicy[]>(`/role-policies/by-policy/${policyId}`)
  },
}
