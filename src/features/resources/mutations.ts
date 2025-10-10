import { apiClient } from '@/lib/api-client'
import { 
  Resource, 
  CreateResourceRequest, 
  UpdateResourceRequest 
} from './types'

export const resourcesMutations = {
  // Create resource
  createResource: async (data: CreateResourceRequest): Promise<Resource> => {
    return apiClient.post<Resource>('/resources', data)
  },

  // Update resource
  updateResource: async (id: string, data: UpdateResourceRequest): Promise<Resource> => {
    return apiClient.patch<Resource>(`/resources/${id}`, data)
  },

  // Delete resource
  deleteResource: async (id: string): Promise<void> => {
    return apiClient.delete<void>(`/resources/${id}`)
  },
}
