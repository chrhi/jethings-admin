export interface Role {
  id: string
  code: string
  name: string
  description?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateRoleRequest {
  code: string
  name: string
  description?: string
  isActive?: boolean
}

export interface UpdateRoleRequest {
  code?: string
  name?: string
  description?: string
  isActive?: boolean
}

export interface RoleFilters {
  search?: string
  isActive?: boolean
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface RoleResponse {
  data: Role[]
  total: number
  page: number
  limit: number
  totalPages: number
}