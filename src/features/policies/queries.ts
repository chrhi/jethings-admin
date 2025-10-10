import { apiClient } from '@/lib/api-client'
import { 
  Policy, 
  PolicyFilters, 
  PolicyResponse 
} from './types'

export const policiesQueries = {
  // Fetch policies with filters
  fetchPolicies: async (filters: PolicyFilters = {}): Promise<PolicyResponse> => {
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

    return apiClient.get<PolicyResponse>(`/policies?${params}`)
  },

  // Fetch policy by ID
  fetchPolicyById: async (id: string): Promise<Policy> => {
    return apiClient.get<Policy>(`/policies/${id}`)
  },

  // Fetch policies by resource
  fetchPoliciesByResource: async (resourceId: string): Promise<Policy[]> => {
    return apiClient.get<Policy[]>(`/policies/by-resource/${resourceId}`)
  },

  // Fetch policies by action
  fetchPoliciesByAction: async (actionId: string): Promise<Policy[]> => {
    return apiClient.get<Policy[]>(`/policies/by-action/${actionId}`)
  },
}
