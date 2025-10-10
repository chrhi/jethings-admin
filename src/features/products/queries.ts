import { apiClient } from '@/lib/api-client'
import { 
  Product, 
  ProductFilters, 
  ProductResponse,
  ProductStats 
} from './types'

export const productsQueries = {
  // Fetch products with filters
  fetchProducts: async (filters: ProductFilters = {}): Promise<ProductResponse> => {
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

    return apiClient.get<ProductResponse>(`/products?${params}`)
  },

  // Fetch product by ID
  fetchProductById: async (id: string): Promise<Product> => {
    return apiClient.get<Product>(`/products/${id}`)
  },

  // Fetch product stats
  fetchProductStats: async (): Promise<ProductStats> => {
    return apiClient.get<ProductStats>('/products/stats')
  },
}
