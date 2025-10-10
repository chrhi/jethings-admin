import { apiClient } from '@/lib/api-client'

export const productTypesMutations = {
  // Create product type
  createProductType: async (data: any): Promise<any> => {
    return apiClient.post<any>('/product-types', data)
  },

  // Update product type
  updateProductType: async (id: string, data: any): Promise<any> => {
    return apiClient.patch<any>(`/product-types/${id}`, data)
  },

  // Delete product type
  deleteProductType: async (id: string): Promise<void> => {
    return apiClient.delete<void>(`/product-types/${id}`)
  },
}
