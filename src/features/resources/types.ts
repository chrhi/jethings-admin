export interface Resource {
  id: string
  code: string
  name: string
  description?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateResourceRequest {
  code: string
  name: string
  description?: string
  isActive?: boolean
}

export interface UpdateResourceRequest {
  code?: string
  name?: string
  description?: string
  isActive?: boolean
}

export interface ResourceFilters {
  search?: string
  isActive?: boolean
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface ResourceResponse {
  data: Resource[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface ResourceStats {
  total: number
  active: number
  inactive: number
}

export interface ApiError {
  message: string
  statusCode: number
}
