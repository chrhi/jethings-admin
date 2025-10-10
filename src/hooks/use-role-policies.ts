import { useState, useCallback } from 'react'
import { 
  RolePolicy, 
  RolePolicyWithDetails, 
  CreateRolePolicyRequest, 
  UpdateRolePolicyRequest, 
  RolePolicyFilters, 
  RolePolicyResponse 
} from '@/features/roles/types/role-policy'
import { rolePolicyService } from '@/lib/role-policy-service'

export function useRolePolicies() {
  const [rolePolicies, setRolePolicies] = useState<RolePolicyWithDetails[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  })

  const fetchRolePolicies = useCallback(async (filters: RolePolicyFilters = {}) => {
    setLoading(true)
    setError(null)
    
    try {
      const data: RolePolicyResponse = await rolePolicyService.getRolePolicies(filters)
      setRolePolicies(data.data)
      setPagination({
        total: data.total,
        page: data.page,
        limit: data.limit,
        totalPages: data.totalPages,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch role-policies')
      console.error('Error fetching role-policies:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchRolePoliciesByRole = useCallback(async (roleId: string) => {
    setLoading(true)
    setError(null)
    
    try {
      const data = await rolePolicyService.getRolePoliciesByRole(roleId)
      setRolePolicies(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch role-policies')
      console.error('Error fetching role-policies by role:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const createRolePolicy = useCallback(async (data: CreateRolePolicyRequest): Promise<RolePolicy | null> => {
    try {
      const newRolePolicy = await rolePolicyService.createRolePolicy(data)
      // Refresh the list after creation
      return newRolePolicy
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create role-policy')
      console.error('Error creating role-policy:', err)
      throw err
    }
  }, [])

  const updateRolePolicy = useCallback(async (id: string, data: UpdateRolePolicyRequest): Promise<RolePolicy | null> => {
    try {
      const updatedRolePolicy = await rolePolicyService.updateRolePolicy(id, data)
      setRolePolicies(prev => prev.map(rp => rp.id === id ? { ...rp, ...updatedRolePolicy } : rp))
      return updatedRolePolicy
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update role-policy')
      console.error('Error updating role-policy:', err)
      throw err
    }
  }, [])

  const deleteRolePolicy = useCallback(async (id: string): Promise<boolean> => {
    try {
      await rolePolicyService.deleteRolePolicy(id)
      setRolePolicies(prev => prev.filter(rp => rp.id !== id))
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete role-policy')
      console.error('Error deleting role-policy:', err)
      return false
    }
  }, [])

  return {
    rolePolicies,
    loading,
    error,
    pagination,
    fetchRolePolicies,
    fetchRolePoliciesByRole,
    createRolePolicy,
    updateRolePolicy,
    deleteRolePolicy,
  }
}
