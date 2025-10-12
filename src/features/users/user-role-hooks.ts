import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { userRoleQueries } from './user-role-queries'
import { userRoleMutations } from './user-role-mutations'
import { queryKeys } from './query-keys'
import { AssignRoleRequest, UpdateUserRoleRequest } from './user-role-types'
import toast from 'react-hot-toast'

// Query hooks
export const useUserRolesByUserQuery = (userId: string) => {
  return useQuery({
    queryKey: queryKeys.userRoles.byUser(userId),
    queryFn: () => userRoleQueries.fetchRolesByUser(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useUsersByRoleQuery = (roleId: string) => {
  return useQuery({
    queryKey: queryKeys.userRoles.byRole(roleId),
    queryFn: () => userRoleQueries.fetchUsersByRole(roleId),
    enabled: !!roleId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useUserRolesQuery = (filters: any = {}) => {
  return useQuery({
    queryKey: queryKeys.userRoles.list(filters),
    queryFn: () => userRoleQueries.fetchUserRoles(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useUserRoleByIdQuery = (id: string) => {
  return useQuery({
    queryKey: queryKeys.userRoles.detail(id),
    queryFn: () => userRoleQueries.fetchUserRoleById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Mutation hooks
export const useAssignRoleMutation = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: userRoleMutations.assignRole,
    onSuccess: (data, variables) => {
      // Invalidate user roles queries
      queryClient.invalidateQueries({ queryKey: queryKeys.userRoles.byUser(variables.userId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.userRoles.lists() })
      // Invalidate users queries to refresh user data
      queryClient.invalidateQueries({ queryKey: queryKeys.users.lists() })
      queryClient.invalidateQueries({ queryKey: queryKeys.users.stats() })
      toast.success('Rôle assigné avec succès')
    },
    onError: (error: Error) => {
      const errorMessage = error.message || 'Échec de l\'assignation du rôle'
      if (errorMessage.includes('409') || errorMessage.includes('already assigned')) {
        toast.error('Ce rôle est déjà assigné à cet utilisateur')
      } else {
        toast.error(errorMessage)
      }
    },
  })
}

export const useUnassignRoleMutation = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: userRoleMutations.unassignRole,
    onSuccess: (data, variables) => {
      // Invalidate all user roles queries
      queryClient.invalidateQueries({ queryKey: queryKeys.userRoles.all })
      // Invalidate users queries to refresh user data
      queryClient.invalidateQueries({ queryKey: queryKeys.users.lists() })
      queryClient.invalidateQueries({ queryKey: queryKeys.users.stats() })
      toast.success('Rôle retiré avec succès')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Échec du retrait du rôle')
    },
  })
}

export const useUpdateUserRoleMutation = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserRoleRequest }) => 
      userRoleMutations.updateUserRole({ id, data }),
    onSuccess: (data, variables) => {
      // Invalidate user roles queries
      queryClient.invalidateQueries({ queryKey: queryKeys.userRoles.detail(variables.id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.userRoles.lists() })
      // Invalidate users queries to refresh user data
      queryClient.invalidateQueries({ queryKey: queryKeys.users.lists() })
      queryClient.invalidateQueries({ queryKey: queryKeys.users.stats() })
      toast.success('Assignation de rôle mise à jour avec succès')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Échec de la mise à jour de l\'assignation')
    },
  })
}
