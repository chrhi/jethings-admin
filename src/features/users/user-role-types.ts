export interface UserRole {
  id: string
  userId: string
  roleId: string
  assignedBy?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface UserRoleWithDetails extends UserRole {
  user: {
    id: string
    firstName: string
    lastName: string
    email: string
  }
  role: {
    id: string
    code: string
    name: string
    description?: string
  }
  assignedByUser?: {
    id: string
    firstName: string
    lastName: string
    email: string
  }
}

export interface AssignRoleRequest {
  userId: string
  roleId: string
  assignedBy?: string
  isActive?: boolean
}

export interface UpdateUserRoleRequest {
  isActive: boolean
}

export interface UserRoleFilters {
  userId?: string
  roleId?: string
  isActive?: boolean
  page?: number
  limit?: number
}

export interface UserRolesResponse {
  data: UserRoleWithDetails[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface UserRoleResponse {
  message: string
  userRole?: UserRole
}
