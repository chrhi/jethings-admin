import { apiClient } from '@/lib/api-client'
import { 
  Store, 
  StoreFilters, 
  StoreResponse 
} from './types'

export const storesQueries = {
  // Fetch stores with filters
  fetchStores: async (filters: StoreFilters = {}): Promise<StoreResponse> => {
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

    return apiClient.get<StoreResponse>(`/stores?${params}`)
  },

  // Fetch current user's stores
  fetchMyStores: async (): Promise<Store[]> => {
    return apiClient.get<Store[]>('/stores/my')
  },

  // Fetch store by ID
  fetchStoreById: async (id: string): Promise<Store> => {
    return apiClient.get<Store>(`/stores/${id}`)
  },
}
