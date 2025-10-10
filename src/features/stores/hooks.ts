import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { storesQueries } from './queries'
import { storesMutations } from './mutations'
import { queryKeys } from './query-keys'
import { StoreFilters } from './types'
import toast from 'react-hot-toast'

// Query hooks
export const useStoresQuery = (filters: StoreFilters = {}) => {
  return useQuery({
    queryKey: queryKeys.stores.list(filters),
    queryFn: () => storesQueries.fetchStores(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useMyStoresQuery = () => {
  return useQuery({
    queryKey: queryKeys.stores.my(),
    queryFn: storesQueries.fetchMyStores,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useStoreByIdQuery = (id: string) => {
  return useQuery({
    queryKey: queryKeys.stores.detail(id),
    queryFn: () => storesQueries.fetchStoreById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Mutation hooks
export const useCreateStoreMutation = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: storesMutations.createStore,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.stores.lists() })
      queryClient.invalidateQueries({ queryKey: queryKeys.stores.my() })
      toast.success('Store created successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create store')
    },
  })
}

export const useUpdateStoreMutation = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      storesMutations.updateStore(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.stores.lists() })
      queryClient.invalidateQueries({ queryKey: queryKeys.stores.my() })
      queryClient.invalidateQueries({ queryKey: queryKeys.stores.detail(variables.id) })
      toast.success('Store updated successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update store')
    },
  })
}

export const useDeleteStoreMutation = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: storesMutations.deleteStore,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.stores.lists() })
      queryClient.invalidateQueries({ queryKey: queryKeys.stores.my() })
      toast.success('Store deleted successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete store')
    },
  })
}
