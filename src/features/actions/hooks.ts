import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { actionsQueries } from './queries'
import { actionsMutations } from './mutations'
import { queryKeys } from './query-keys'
import { ActionFilters, CreateActionRequest, UpdateActionRequest } from './types'
import toast from 'react-hot-toast'

// Query hooks
export const useActionsQuery = (filters: ActionFilters = {}) => {
  return useQuery({
    queryKey: queryKeys.actions.list(filters),
    queryFn: () => actionsQueries.fetchActions(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useActionByIdQuery = (id: string) => {
  return useQuery({
    queryKey: queryKeys.actions.detail(id),
    queryFn: () => actionsQueries.fetchActionById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Mutation hooks
export const useCreateActionMutation = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: actionsMutations.createAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.actions.lists() })
      toast.success('Action created successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create action')
    },
  })
}

export const useUpdateActionMutation = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateActionRequest }) => 
      actionsMutations.updateAction(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.actions.lists() })
      queryClient.invalidateQueries({ queryKey: queryKeys.actions.detail(variables.id) })
      toast.success('Action updated successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update action')
    },
  })
}

export const useDeleteActionMutation = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: actionsMutations.deleteAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.actions.lists() })
      toast.success('Action deleted successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete action')
    },
  })
}
