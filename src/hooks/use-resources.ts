// This file provides backwards compatibility exports
// Components should be updated to import directly from @/features/resources/hooks

export { 
  useResourcesQuery as useResources,
  useCreateResourceMutation,
  useUpdateResourceMutation,
  useDeleteResourceMutation
} from '@/features/resources/hooks'
