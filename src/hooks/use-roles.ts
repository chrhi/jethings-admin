// This file provides backwards compatibility exports
// Components should be updated to import directly from @/features/roles/hooks

export { 
  useRolesQuery as useRoles,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation
} from '@/features/roles/hooks'
