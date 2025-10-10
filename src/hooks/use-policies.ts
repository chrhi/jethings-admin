// This file provides backwards compatibility exports
// Components should be updated to import directly from @/features/policies/hooks

export { 
  usePoliciesQuery as usePolicies,
  usePolicyByIdQuery,
  useCreatePolicyMutation,
  useUpdatePolicyMutation,
  useDeletePolicyMutation
} from '@/features/policies/hooks'
