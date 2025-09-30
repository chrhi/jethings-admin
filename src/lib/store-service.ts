import { 
  Store, 
  StoreResponse, 
  StoreFilters, 
  CreateStoreRequest, 
  UpdateStoreRequest, 
  UpdateStoreUserRequest,
  ApiError 
} from '@/types/store'
import { mockStoreResponse, mockStoreStats } from './mock-store-data'

const API_BASE_URL = '/api/stores'

// Helper function to get auth token
function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null
  try {
    return localStorage.getItem('access_token')
  } catch {
    return null
  }
}

// Helper function to make API requests
async function apiRequest<T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<T> {
  const token = getAuthToken()
  
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    })

    if (!response.ok) {
      let errorMessage = 'API request failed'
      try {
        const error: ApiError = await response.json()
        errorMessage = error.message || errorMessage
      } catch {
        errorMessage = `HTTP ${response.status}: ${response.statusText}`
      }
      throw new Error(errorMessage)
    }

    return response.json()
  } catch (error) {
    // If API fails, return mock data for development
    if (endpoint === '' || endpoint === '/my') {
      return mockStoreResponse as T
    }
    if (endpoint === '/stats') {
      return mockStoreStats as T
    }
    
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Network error occurred')
  }
}

// Store API functions
export const storeService = {
  // Get all stores (Admin only)
  async getAllStores(filters: StoreFilters = {}): Promise<StoreResponse> {
    const queryParams = new URLSearchParams()
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        if (Array.isArray(value)) {
          value.forEach(v => queryParams.append(key, v))
        } else {
          queryParams.append(key, value.toString())
        }
      }
    })

    const queryString = queryParams.toString()
    return apiRequest<StoreResponse>(`${queryString ? `?${queryString}` : ''}`)
  },

  // Get user's stores
  async getMyStores(filters: StoreFilters = {}): Promise<StoreResponse> {
    const queryParams = new URLSearchParams()
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        if (Array.isArray(value)) {
          value.forEach(v => queryParams.append(key, v))
        } else {
          queryParams.append(key, value.toString())
        }
      }
    })

    const queryString = queryParams.toString()
    return apiRequest<StoreResponse>(`/my${queryString ? `?${queryString}` : ''}`)
  },

  // Get store by ID
  async getStoreById(id: string): Promise<Store> {
    return apiRequest<Store>(`/${id}`)
  },

  // Create store
  async createStore(data: CreateStoreRequest): Promise<Store> {
    return apiRequest<Store>('', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  // Update store (Admin only)
  async updateStore(id: string, data: UpdateStoreRequest): Promise<Store> {
    return apiRequest<Store>(`/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },

  // Update store (User)
  async updateStoreUser(id: string, data: UpdateStoreUserRequest): Promise<Store> {
    return apiRequest<Store>(`/${id}/user`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },

  // Delete store (Admin only)
  async deleteStore(id: string): Promise<{ message: string }> {
    return apiRequest<{ message: string }>(`/${id}`, {
      method: 'DELETE',
    })
  },

  // Get store statistics
  async getStoreStats(): Promise<{
    total: number
    pending: number
    accepted: number
    rejected: number
    active: number
    inactive: number
  }> {
    try {
      const stores = await this.getAllStores({ limit: 1000 })
      
      const stats = stores.stores.reduce(
        (acc, store) => {
          acc.total++
          
          if (store.status === 'pending') acc.pending++
          if (store.status === 'accepted') acc.accepted++
          if (store.status === 'rejected') acc.rejected++
          if (store.isActive) acc.active++
          if (!store.isActive) acc.inactive++
          
          return acc
        },
        {
          total: 0,
          pending: 0,
          accepted: 0,
          rejected: 0,
          active: 0,
          inactive: 0,
        }
      )

      return stats
    } catch (error) {
      // Return mock stats if API fails
      return mockStoreStats
    }
  }
}

// Export individual functions for convenience
export const {
  getAllStores,
  getMyStores,
  getStoreById,
  createStore,
  updateStore,
  updateStoreUser,
  deleteStore,
  getStoreStats,
} = storeService