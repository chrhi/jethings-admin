import { apiClient } from '@/lib/api-client'
import { 
  Policy, 
  CreatePolicyRequest, 
  UpdatePolicyRequest 
} from './types'

export const policiesMutations = {
  // Create policy
  createPolicy: async (data: CreatePolicyRequest): Promise<Policy> => {
    return apiClient.post<Policy>('/policies', data)
  },

  // Update policy
  updatePolicy: async (id: string, data: UpdatePolicyRequest): Promise<Policy> => {
    return apiClient.patch<Policy>(`/policies/${id}`, data)
  },

  // Delete policy
  deletePolicy: async (id: string): Promise<void> => {
    return apiClient.delete<void>(`/policies/${id}`)
  },
}
