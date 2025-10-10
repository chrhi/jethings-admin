export interface RolePolicy {
  id: string
  roleId: string
  policyId: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface RolePolicyWithDetails extends RolePolicy {
  role: {
    id: string
    code: string
    name: string
    description?: string
    isActive: boolean
  }
  policy: {
    id: string
    resourceId: string
    actionId: string
    conditionExpression?: string
    description?: string
    isActive: boolean
    resource: {
      id: string
      code: string
      name: string
      description?: string
      isActive: boolean
    }
    action: {
      id: string
      code: string
      name: string
      description?: string
      isActive: boolean
    }
  }
}

export interface CreateRolePolicyRequest {
  roleId: string
  policyId: string
  isActive?: boolean
}

export interface UpdateRolePolicyRequest {
  isActive?: boolean
}

export interface RolePolicyFilters {
  roleId?: string
  policyId?: string
  isActive?: boolean
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface RolePolicyResponse {
  data: RolePolicyWithDetails[]
  total: number
  page: number
  limit: number
  totalPages: number
}
