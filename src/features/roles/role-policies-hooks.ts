import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { rolePoliciesQueries } from './role-policies-queries'
import { rolePoliciesMutations } from './role-policies-mutations'
import toast from 'react-hot-toast'

// Query hooks
export const useRolePoliciesQuery = () => {
  return useQuery({
    queryKey: ['role-policies'],
    queryFn: rolePoliciesQueries.fetchRolePolicies,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useRolePoliciesByRoleQuery = (roleId: string) => {
  return useQuery({
    queryKey: ['role-policies', 'by-role', roleId],
    queryFn: () => rolePoliciesQueries.fetchRolePoliciesByRole(roleId),
    enabled: !!roleId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useRolePoliciesByPolicyQuery = (policyId: string) => {
  return useQuery({
    queryKey: ['role-policies', 'by-policy', policyId],
    queryFn: () => rolePoliciesQueries.fetchRolePoliciesByPolicy(policyId),
    enabled: !!policyId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Mutation hooks
export const useCreateRolePolicyMutation = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: rolePoliciesMutations.createRolePolicy,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['role-policies'] })
      toast.success('Role policy assigned successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to assign role policy')
    },
  })
}

export const useDeleteRolePolicyMutation = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: rolePoliciesMutations.deleteRolePolicy,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['role-policies'] })
      toast.success('Role policy removed successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to remove role policy')
    },
  })
}
