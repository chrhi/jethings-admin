import { apiClient } from '@/lib/api-client'

export const productTypesQueries = {
  // Fetch product types
  fetchProductTypes: async (): Promise<any[]> => {
    return apiClient.get<any[]>('/product-types')
  },

  // Fetch product type by ID
  fetchProductTypeById: async (id: string): Promise<any> => {
    return apiClient.get<any>(`/product-types/${id}`)
  },
}
