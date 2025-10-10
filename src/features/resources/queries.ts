import { apiClient } from '@/lib/api-client'
import { 
  Resource, 
  ResourceFilters, 
  ResourceResponse 
} from './types'

export const resourcesQueries = {
  // Fetch resources with filters
  fetchResources: async (filters: ResourceFilters = {}): Promise<ResourceResponse> => {
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

    return apiClient.get<ResourceResponse>(`/resources?${params}`)
  },

  // Fetch resource by ID
  fetchResourceById: async (id: string): Promise<Resource> => {
    return apiClient.get<Resource>(`/resources/${id}`)
  },
}
