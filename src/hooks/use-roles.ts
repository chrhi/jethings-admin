"use client"

import { useState, useEffect } from "react"
import { Role, RoleFilters, CreateRoleData } from "@/features/roles/types"

// Mock data for demonstration
const mockRoles: Role[] = [
  {
    id: "1",
    name: "Super Admin",
    description: "Full system access with all permissions",
    permissions: ["users.read", "users.create", "users.update", "users.delete", "roles.read", "roles.create", "roles.update", "roles.delete", "dashboard.read", "settings.read", "settings.update", "reports.read"],
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    userCount: 2,
  },
  {
    id: "2",
    name: "Admin",
    description: "Administrative access with most permissions",
    permissions: ["users.read", "users.create", "users.update", "roles.read", "dashboard.read", "settings.read", "reports.read"],
    isActive: true,
    createdAt: "2024-01-02T00:00:00Z",
    updatedAt: "2024-01-02T00:00:00Z",
    userCount: 5,
  },
  {
    id: "3",
    name: "Content Manager",
    description: "Can manage content and view users",
    permissions: ["users.read", "dashboard.read", "reports.read"],
    isActive: true,
    createdAt: "2024-01-03T00:00:00Z",
    updatedAt: "2024-01-03T00:00:00Z",
    userCount: 8,
  },
  {
    id: "4",
    name: "Viewer",
    description: "Read-only access to dashboard and reports",
    permissions: ["dashboard.read", "reports.read"],
    isActive: true,
    createdAt: "2024-01-04T00:00:00Z",
    updatedAt: "2024-01-04T00:00:00Z",
    userCount: 12,
  },
  {
    id: "5",
    name: "Guest",
    description: "Limited access role for temporary users",
    permissions: ["dashboard.read"],
    isActive: false,
    createdAt: "2024-01-05T00:00:00Z",
    updatedAt: "2024-01-05T00:00:00Z",
    userCount: 0,
  },
]

export function useRoles(filters: RoleFilters) {
  const [roles, setRoles] = useState<Role[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchRoles = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      let filteredRoles = [...mockRoles]
      
      // Apply search filter
      if (filters.search) {
        filteredRoles = filteredRoles.filter(role =>
          role.name.toLowerCase().includes(filters.search!.toLowerCase()) ||
          role.description.toLowerCase().includes(filters.search!.toLowerCase())
        )
      }
      
      // Apply active filter
      if (filters.isActive !== undefined) {
        filteredRoles = filteredRoles.filter(role => role.isActive === filters.isActive)
      }
      
      // Apply sorting
      filteredRoles.sort((a, b) => {
        const aValue = a[filters.sortBy]
        const bValue = b[filters.sortBy]
        
        if (filters.sortOrder === 'asc') {
          return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
        } else {
          return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
        }
      })
      
      // Apply pagination
      const startIndex = (filters.page - 1) * filters.limit
      const endIndex = startIndex + filters.limit
      const paginatedRoles = filteredRoles.slice(startIndex, endIndex)
      
      setRoles(paginatedRoles)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch roles')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRoles()
  }, [filters])

  const createRole = async (roleData: CreateRoleData) => {
    try {
      setLoading(true)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const newRole: Role = {
        ...roleData,
        isActive: roleData.isActive ?? true, // Default to active if not specified
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userCount: 0,
      }
      
      setRoles(prev => [newRole, ...prev])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create role')
    } finally {
      setLoading(false)
    }
  }

  const updateRole = async (roleId: string, updates: Partial<Role>) => {
    try {
      setLoading(true)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setRoles(prev => prev.map(role => 
        role.id === roleId 
          ? { ...role, ...updates, updatedAt: new Date().toISOString() }
          : role
      ))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update role')
    } finally {
      setLoading(false)
    }
  }

  const deleteRole = async (roleId: string) => {
    try {
      setLoading(true)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setRoles(prev => prev.filter(role => role.id !== roleId))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete role')
    } finally {
      setLoading(false)
    }
  }

  const refetch = () => {
    fetchRoles()
  }

  // Calculate pagination info
  const totalRoles = mockRoles.length
  const totalPages = Math.ceil(totalRoles / filters.limit)
  const hasNext = filters.page < totalPages
  const hasPrev = filters.page > 1

  const pagination = {
    page: filters.page,
    limit: filters.limit,
    total: totalRoles,
    totalPages,
    hasNext,
    hasPrev,
  }

  return {
    roles,
    loading,
    error,
    pagination,
    createRole,
    updateRole,
    deleteRole,
    refetch,
  }
}
