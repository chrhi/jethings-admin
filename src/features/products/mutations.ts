import { apiClient } from '@/lib/api-client'
import { Product } from './types'

export const productsMutations = {
  // Create product
  createProduct: async (data: any): Promise<Product> => {
    return apiClient.post<Product>('/products', data)
  },

  // Update product
  updateProduct: async (id: string, data: any): Promise<Product> => {
    return apiClient.patch<Product>(`/products/${id}`, data)
  },

  // Delete product
  deleteProduct: async (id: string): Promise<void> => {
    return apiClient.delete<void>(`/products/${id}`)
  },
}
