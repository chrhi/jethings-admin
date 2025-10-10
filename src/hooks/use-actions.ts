// This file provides backwards compatibility exports
// Components should be updated to import directly from @/features/actions/hooks

export { 
  useActionsQuery as useActions,
  useActionByIdQuery,
  useCreateActionMutation,
  useUpdateActionMutation,
  useDeleteActionMutation
} from '@/features/actions/hooks'
