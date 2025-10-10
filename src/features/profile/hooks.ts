import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { profileQueries } from './queries'
import { profileMutations } from './queries' // mutations are in the same file
import { queryKeys } from './query-keys'
import { UpdateProfileRequest, ChangePasswordRequest } from './types'
import toast from 'react-hot-toast'

// Query hooks
export const useCurrentUserQuery = () => {
  return useQuery({
    queryKey: queryKeys.profile.currentUser(),
    queryFn: profileQueries.fetchCurrentUser,
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 1,
  })
}

// Mutation hooks
export const useUpdateProfileMutation = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: profileMutations.updateProfile,
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.profile.currentUser(), data)
      toast.success('Profile updated successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update profile')
    },
  })
}

export const useChangePasswordMutation = () => {
  return useMutation({
    mutationFn: profileMutations.changePassword,
    onSuccess: () => {
      toast.success('Password updated successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update password')
    },
  })
}

export const useDeleteAccountMutation = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: profileMutations.deleteAccount,
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: queryKeys.profile.all })
      toast.success('Account deletion initiated')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete account')
    },
  })
}
