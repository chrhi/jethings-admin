import { apiClient } from '@/lib/api-client'
import { Store } from './types'

export const storesMutations = {
  // Create store
  createStore: async (data: any): Promise<Store> => {
    return apiClient.post<Store>('/stores', data)
  },

  // Update store
  updateStore: async (id: string, data: any): Promise<Store> => {
    return apiClient.patch<Store>(`/stores/${id}`, data)
  },

  // Delete store
  deleteStore: async (id: string): Promise<void> => {
    return apiClient.delete<void>(`/stores/${id}`)
  },
}
