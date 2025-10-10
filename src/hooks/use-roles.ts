import { useState, useCallback } from 'react'
import { Role, CreateRoleRequest, UpdateRoleRequest, RoleFilters, RoleResponse } from '@/features/roles/types'
import { roleService } from '@/lib/role-service'

export function useRoles() {
  const [roles, setRoles] = useState<Role[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  })

  const fetchRoles = useCallback(async (filters: RoleFilters = {}) => {
    setLoading(true)
    setError(null)
    
    try {
      const data: RoleResponse = await roleService.getRoles(filters)
      setRoles(data.data)
      setPagination({
        total: data.total,
        page: data.page,
        limit: data.limit,
        totalPages: data.totalPages,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch roles')
      console.error('Error fetching roles:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const createRole = useCallback(async (data: CreateRoleRequest): Promise<Role | null> => {
    try {
      const newRole = await roleService.createRole(data)
      setRoles(prev => [newRole, ...prev])
      return newRole
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create role')
      console.error('Error creating role:', err)
      throw err
    }
  }, [])

  const updateRole = useCallback(async (id: string, data: UpdateRoleRequest): Promise<Role | null> => {
    try {
      const updatedRole = await roleService.updateRole(id, data)
      setRoles(prev => prev.map(role => role.id === id ? updatedRole : role))
      return updatedRole
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update role')
      console.error('Error updating role:', err)
      throw err
    }
  }, [])

  const deleteRole = useCallback(async (id: string): Promise<boolean> => {
    try {
      await roleService.deleteRole(id)
      setRoles(prev => prev.filter(role => role.id !== id))
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete role')
      console.error('Error deleting role:', err)
      return false
    }
  }, [])

  return {
    roles,
    loading,
    error,
    pagination,
    fetchRoles,
    createRole,
    updateRole,
    deleteRole,
  }
}