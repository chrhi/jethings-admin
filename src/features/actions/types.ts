export interface Action {
  id: string
  code: string
  name: string
  description?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateActionRequest {
  code: string
  name: string
  description?: string
  isActive?: boolean
}

export interface UpdateActionRequest {
  code?: string
  name?: string
  description?: string
  isActive?: boolean
}

export interface ActionFilters {
  search?: string
  resourceId?: string
  isActive?: boolean
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface ActionResponse {
  data: Action[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface ActionStats {
  total: number
  active: number
  inactive: number
}

export interface ApiError {
  message: string
  statusCode: number
}
