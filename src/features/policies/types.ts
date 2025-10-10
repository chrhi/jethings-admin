export interface Resource {
  id: string
  code: string
  name: string
  description?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface Action {
  id: string
  code: string
  name: string
  description?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface Policy {
  id: string
  resourceId: string
  actionId: string
  conditionExpression?: string
  description?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  // Populated data from API response
  resource: Resource
  action: Action
}

export interface CreatePolicyRequest {
  resourceId: string
  actionId: string
  conditionExpression?: string
  description?: string
  isActive?: boolean
}

export interface UpdatePolicyRequest {
  resourceId?: string
  actionId?: string
  conditionExpression?: string
  description?: string
  isActive?: boolean
}

export interface PolicyFilters {
  search?: string
  resourceId?: string
  actionId?: string
  isActive?: boolean
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface PolicyResponse {
  data: Policy[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface PolicyStats {
  total: number
  active: number
  inactive: number
}

export interface ApiError {
  message: string
  statusCode: number
}
