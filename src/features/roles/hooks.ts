import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { rolesQueries } from './queries'
import { rolesMutations } from './mutations'
import { queryKeys } from './query-keys'
import { RoleFilters, CreateRoleRequest, UpdateRoleRequest } from './types'
import toast from 'react-hot-toast'

// Query hooks
export const useRolesQuery = (filters: RoleFilters = {}) => {
  return useQuery({
    queryKey: queryKeys.roles.list(filters),
    queryFn: () => rolesQueries.fetchRoles(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useRoleByIdQuery = (id: string) => {
  return useQuery({
    queryKey: queryKeys.roles.detail(id),
    queryFn: () => rolesQueries.fetchRoleById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Mutation hooks
export const useCreateRoleMutation = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: rolesMutations.createRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.roles.lists() })
      toast.success('Role created successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create role')
    },
  })
}

export const useUpdateRoleMutation = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateRoleRequest }) => 
      rolesMutations.updateRole(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.roles.lists() })
      queryClient.invalidateQueries({ queryKey: queryKeys.roles.detail(variables.id) })
      toast.success('Role updated successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update role')
    },
  })
}

export const useDeleteRoleMutation = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: rolesMutations.deleteRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.roles.lists() })
      toast.success('Role deleted successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete role')
    },
  })
}
