import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { policiesQueries } from './queries'
import { policiesMutations } from './mutations'
import { queryKeys } from './query-keys'
import { PolicyFilters, CreatePolicyRequest, UpdatePolicyRequest } from './types'
import toast from 'react-hot-toast'

// Query hooks
export const usePoliciesQuery = (filters: PolicyFilters = {}) => {
  return useQuery({
    queryKey: queryKeys.policies.list(filters),
    queryFn: () => policiesQueries.fetchPolicies(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const usePolicyByIdQuery = (id: string) => {
  return useQuery({
    queryKey: queryKeys.policies.detail(id),
    queryFn: () => policiesQueries.fetchPolicyById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const usePoliciesByResourceQuery = (resourceId: string) => {
  return useQuery({
    queryKey: queryKeys.policies.byResource(resourceId),
    queryFn: () => policiesQueries.fetchPoliciesByResource(resourceId),
    enabled: !!resourceId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const usePoliciesByActionQuery = (actionId: string) => {
  return useQuery({
    queryKey: queryKeys.policies.byAction(actionId),
    queryFn: () => policiesQueries.fetchPoliciesByAction(actionId),
    enabled: !!actionId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Mutation hooks
export const useCreatePolicyMutation = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: policiesMutations.createPolicy,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.policies.lists() })
      toast.success('Policy created successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create policy')
    },
  })
}

export const useUpdatePolicyMutation = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePolicyRequest }) => 
      policiesMutations.updatePolicy(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.policies.lists() })
      queryClient.invalidateQueries({ queryKey: queryKeys.policies.detail(variables.id) })
      toast.success('Policy updated successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update policy')
    },
  })
}

export const useDeletePolicyMutation = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: policiesMutations.deletePolicy,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.policies.lists() })
      toast.success('Policy deleted successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete policy')
    },
  })
}
