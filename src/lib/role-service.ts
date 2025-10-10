import { Role, CreateRoleRequest, UpdateRoleRequest, RoleFilters, RoleResponse } from '@/features/roles/types'

const API_BASE_URL = ''

class RoleService {
  private static instance: RoleService

  private constructor() {}

  static getInstance(): RoleService {
    if (!RoleService.instance) {
      RoleService.instance = new RoleService()
    }
    return RoleService.instance
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`
    
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    }

    const response = await fetch(url, { ...defaultOptions, ...options })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`API request failed for ${endpoint}: ${response.status} ${response.statusText} - ${errorText}`)
    }

    return response.json()
  }

  async getRoles(filters: RoleFilters = {}): Promise<RoleResponse> {
    const params = new URLSearchParams()
    
    if (filters.search) params.append('search', filters.search)
    if (filters.isActive !== undefined) params.append('isActive', String(filters.isActive))
    if (filters.page) params.append('page', String(filters.page))
    if (filters.limit) params.append('limit', String(filters.limit))
    if (filters.sortBy) params.append('sortBy', filters.sortBy)
    if (filters.sortOrder) params.append('sortOrder', filters.sortOrder)

    const queryString = params.toString()
    const endpoint = queryString ? `/api/roles?${queryString}` : '/api/roles'
    
    return this.makeRequest<RoleResponse>(endpoint)
  }

  async getRoleById(id: string): Promise<Role> {
    return this.makeRequest<Role>(`/api/roles/${id}`)
  }

  async createRole(data: CreateRoleRequest): Promise<Role> {
    return this.makeRequest<Role>('/api/roles', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateRole(id: string, data: UpdateRoleRequest): Promise<Role> {
    return this.makeRequest<Role>(`/api/roles/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  }

  async deleteRole(id: string): Promise<void> {
    await this.makeRequest<void>(`/api/roles/${id}`, {
      method: 'DELETE',
    })
  }
}

export const roleService = RoleService.getInstance()
