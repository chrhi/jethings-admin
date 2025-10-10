// This file provides backwards compatibility exports
// Components should be updated to import directly from @/features/roles/role-policies-hooks

export { 
  useRolePoliciesQuery as useRolePolicies,
  useRolePoliciesByRoleQuery,
  useRolePoliciesByPolicyQuery,
  useCreateRolePolicyMutation,
  useDeleteRolePolicyMutation
} from '@/features/roles/role-policies-hooks'
