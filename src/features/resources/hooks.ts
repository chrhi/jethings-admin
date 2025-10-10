import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { resourcesQueries } from './queries'
import { resourcesMutations } from './mutations'
import { queryKeys } from './query-keys'
import { ResourceFilters, CreateResourceRequest, UpdateResourceRequest } from './types'
import toast from 'react-hot-toast'

// Query hooks
export const useResourcesQuery = (filters: ResourceFilters = {}) => {
  return useQuery({
    queryKey: queryKeys.resources.list(filters),
    queryFn: () => resourcesQueries.fetchResources(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useResourceByIdQuery = (id: string) => {
  return useQuery({
    queryKey: queryKeys.resources.detail(id),
    queryFn: () => resourcesQueries.fetchResourceById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Mutation hooks
export const useCreateResourceMutation = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: resourcesMutations.createResource,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.resources.lists() })
      toast.success('Resource created successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create resource')
    },
  })
}

export const useUpdateResourceMutation = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateResourceRequest }) => 
      resourcesMutations.updateResource(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.resources.lists() })
      queryClient.invalidateQueries({ queryKey: queryKeys.resources.detail(variables.id) })
      toast.success('Resource updated successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update resource')
    },
  })
}

export const useDeleteResourceMutation = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: resourcesMutations.deleteResource,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.resources.lists() })
      toast.success('Resource deleted successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete resource')
    },
  })
}
