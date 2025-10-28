export interface Store {
  id: string
  userId: string
  name: string
  description?: string
  icon?: string
  status: StoreStatus
  isActive: boolean
  createdAt: string
  updatedAt: string
  deletedAt?: string | null
}

export type StoreStatus = 'pending' | 'rejected' | 'accepted'

export interface CreateStoreRequest {
  name: string
  description?: string
  icon?: string
}

export interface UpdateStoreRequest {
  name?: string
  description?: string
  icon?: string
  status?: StoreStatus
  isActive?: boolean
}

export interface UpdateStoreUserRequest {
  name?: string
  description?: string
  icon?: string
}

export interface StoreFilters {
  search?: string
  name?: string
  userId?: string
  status?: StoreStatus[]
  isActive?: boolean
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface StoreResponse {
  store: Store[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export interface ApiError {
  message: string
  statusCode: number
}
