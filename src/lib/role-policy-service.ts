import { 
  RolePolicy, 
  RolePolicyWithDetails, 
  CreateRolePolicyRequest, 
  UpdateRolePolicyRequest, 
  RolePolicyFilters, 
  RolePolicyResponse 
} from '@/features/roles/types/role-policy'

const API_BASE_URL = ''

class RolePolicyService {
  private static instance: RolePolicyService

  private constructor() {}

  static getInstance(): RolePolicyService {
    if (!RolePolicyService.instance) {
      RolePolicyService.instance = new RolePolicyService()
    }
    return RolePolicyService.instance
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

  async getRolePolicies(filters: RolePolicyFilters = {}): Promise<RolePolicyResponse> {
    const params = new URLSearchParams()
    
    if (filters.roleId) params.append('roleId', filters.roleId)
    if (filters.policyId) params.append('policyId', filters.policyId)
    if (filters.isActive !== undefined) params.append('isActive', String(filters.isActive))
    if (filters.page) params.append('page', String(filters.page))
    if (filters.limit) params.append('limit', String(filters.limit))
    if (filters.sortBy) params.append('sortBy', filters.sortBy)
    if (filters.sortOrder) params.append('sortOrder', filters.sortOrder)

    const queryString = params.toString()
    const endpoint = queryString ? `/api/role-policies?${queryString}` : '/api/role-policies'
    
    return this.makeRequest<RolePolicyResponse>(endpoint)
  }

  async getRolePoliciesByRole(roleId: string): Promise<RolePolicyWithDetails[]> {
    return this.makeRequest<RolePolicyWithDetails[]>(`/api/role-policies/by-role/${roleId}`)
  }

  async getRolePoliciesByPolicy(policyId: string): Promise<RolePolicyWithDetails[]> {
    return this.makeRequest<RolePolicyWithDetails[]>(`/api/role-policies/by-policy/${policyId}`)
  }

  async getRolePolicyById(id: string): Promise<RolePolicyWithDetails> {
    return this.makeRequest<RolePolicyWithDetails>(`/api/role-policies/${id}`)
  }

  async createRolePolicy(data: CreateRolePolicyRequest): Promise<RolePolicy> {
    return this.makeRequest<RolePolicy>('/api/role-policies', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateRolePolicy(id: string, data: UpdateRolePolicyRequest): Promise<RolePolicy> {
    return this.makeRequest<RolePolicy>(`/api/role-policies/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  }

  async deleteRolePolicy(id: string): Promise<void> {
    await this.makeRequest<void>(`/api/role-policies/${id}`, {
      method: 'DELETE',
    })
  }
}

export const rolePolicyService = RolePolicyService.getInstance()
