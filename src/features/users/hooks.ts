import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { usersQueries } from './queries'
import { usersMutations } from './mutations'
import { queryKeys } from './query-keys'
import { UserFilters, UserUpdateData, CreateAdminData, CreateInvitationDto } from './types'
import toast from 'react-hot-toast'

// Query hooks
export const useUsersQuery = (filters: UserFilters = {}) => {
  return useQuery({
    queryKey: queryKeys.users.list(filters),
    queryFn: () => usersQueries.fetchUsers(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useUserStatsQuery = () => {
  return useQuery({
    queryKey: queryKeys.users.stats(),
    queryFn: usersQueries.fetchUserStats,
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

export const useCurrentUserQuery = () => {
  return useQuery({
    queryKey: queryKeys.users.current(),
    queryFn: usersQueries.fetchCurrentUser,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useUserByIdQuery = (id: string) => {
  return useQuery({
    queryKey: queryKeys.users.detail(id),
    queryFn: () => usersQueries.fetchUserById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useAdminsQuery = () => {
  return useQuery({
    queryKey: queryKeys.users.admins(),
    queryFn: usersQueries.fetchAdmins,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Mutation hooks
export const useUpdateCurrentUserMutation = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: usersMutations.updateCurrentUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.current() })
      toast.success('Profile updated successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update profile')
    },
  })
}

export const useUpdateUserMutation = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: usersMutations.updateUser,
    onSuccess: (data, variables) => {
      // Invalidate user lists and specific user detail
      queryClient.invalidateQueries({ queryKey: queryKeys.users.lists() })
      queryClient.invalidateQueries({ queryKey: queryKeys.users.detail(variables.id) })
      toast.success('User updated successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update user')
    },
  })
}

export const useDeactivateUserMutation = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: usersMutations.deactivateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.lists() })
      queryClient.invalidateQueries({ queryKey: queryKeys.users.stats() })
      toast.success('User deactivated successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to deactivate user')
    },
  })
}

export const useActivateUserMutation = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: usersMutations.activateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.lists() })
      queryClient.invalidateQueries({ queryKey: queryKeys.users.stats() })
      toast.success('User activated successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to activate user')
    },
  })
}

export const useDeleteUserMutation = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: usersMutations.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.lists() })
      queryClient.invalidateQueries({ queryKey: queryKeys.users.stats() })
      toast.success('User deleted successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete user')
    },
  })
}

export const useCreateAdminMutation = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: usersMutations.createAdmin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.admins() })
      queryClient.invalidateQueries({ queryKey: queryKeys.users.lists() })
      toast.success('Admin created successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create admin')
    },
  })
}

export const useDeleteAdminMutation = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: usersMutations.deleteAdmin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.admins() })
      queryClient.invalidateQueries({ queryKey: queryKeys.users.lists() })
      toast.success('Admin deleted successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete admin')
    },
  })
}

export const useBlockAdminMutation = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: usersMutations.blockAdmin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.admins() })
      queryClient.invalidateQueries({ queryKey: queryKeys.users.lists() })
      toast.success('Admin blocked successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to block admin')
    },
  })
}

export const useUnblockAdminMutation = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: usersMutations.unblockAdmin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.admins() })
      queryClient.invalidateQueries({ queryKey: queryKeys.users.lists() })
      toast.success('Admin unblocked successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to unblock admin')
    },
  })
}

export const useCreateInvitationMutation = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: usersMutations.createInvitation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.lists() })
      queryClient.invalidateQueries({ queryKey: queryKeys.users.stats() })
      toast.success('Invitation sent successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to send invitation')
    },
  })
}
