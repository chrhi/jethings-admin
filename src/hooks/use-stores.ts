"use client"

import { useState, useEffect, useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { 
  Store, 
  StoreResponse, 
  StoreFilters, 
  CreateStoreRequest, 
  UpdateStoreRequest, 
  UpdateStoreUserRequest 
} from '@/types/store'
import { storeService } from '@/lib/store-service'

export const storeKeys = {
  all: ['stores'] as const,
  lists: () => [...storeKeys.all, 'list'] as const,
  list: (filters: StoreFilters) => [...storeKeys.lists(), filters] as const,
  details: () => [...storeKeys.all, 'detail'] as const,
  detail: (id: string) => [...storeKeys.details(), id] as const,
  my: () => [...storeKeys.all, 'my'] as const,
  myList: (filters: StoreFilters) => [...storeKeys.my(), 'list', filters] as const,
  stats: () => [...storeKeys.all, 'stats'] as const,
}

// Hook for getting all stores (Admin)
export function useStores(filters: StoreFilters = {}) {
  return useQuery({
    queryKey: storeKeys.list(filters),
    queryFn: () => storeService.getAllStores(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
    retryDelay: 1000,
  })
}

// Hook for getting user's stores
export function useMyStores(filters: StoreFilters = {}) {
  return useQuery({
    queryKey: storeKeys.myList(filters),
    queryFn: () => storeService.getMyStores(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
    retryDelay: 1000,
  })
}

// Hook for getting a single store
export function useStore(id: string) {
  return useQuery({
    queryKey: storeKeys.detail(id),
    queryFn: () => storeService.getStoreById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Hook for store statistics
export function useStoreStats() {
  return useQuery({
    queryKey: storeKeys.stats(),
    queryFn: () => storeService.getStoreStats(),
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 1,
    retryDelay: 1000,
  })
}

// Hook for creating a store
export function useCreateStore() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateStoreRequest) => storeService.createStore(data),
    onSuccess: () => {
  
      queryClient.invalidateQueries({ queryKey: storeKeys.lists() })
      queryClient.invalidateQueries({ queryKey: storeKeys.my() })
      queryClient.invalidateQueries({ queryKey: storeKeys.stats() })
    },
  })
}


export function useUpdateStore() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateStoreRequest }) =>
      storeService.updateStore(id, data),
    onSuccess: (updatedStore) => {
    
      queryClient.setQueryData(storeKeys.detail(updatedStore.id), updatedStore)
      
   
      queryClient.invalidateQueries({ queryKey: storeKeys.lists() })
      queryClient.invalidateQueries({ queryKey: storeKeys.my() })
      queryClient.invalidateQueries({ queryKey: storeKeys.stats() })
    },
  })
}


export function useUpdateStoreUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateStoreUserRequest }) =>
      storeService.updateStoreUser(id, data),
    onSuccess: (updatedStore) => {
  
      queryClient.setQueryData(storeKeys.detail(updatedStore.id), updatedStore)
      
  
      queryClient.invalidateQueries({ queryKey: storeKeys.lists() })
      queryClient.invalidateQueries({ queryKey: storeKeys.my() })
    },
  })
}

// Hook for deleting a store (Admin)
export function useDeleteStore() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => storeService.deleteStore(id),
    onSuccess: (_, deletedId) => {
      // Remove the store from cache
      queryClient.removeQueries({ queryKey: storeKeys.detail(deletedId) })
      
      // Invalidate lists to refetch
      queryClient.invalidateQueries({ queryKey: storeKeys.lists() })
      queryClient.invalidateQueries({ queryKey: storeKeys.my() })
      queryClient.invalidateQueries({ queryKey: storeKeys.stats() })
    },
  })
}

// Hook for store management with pagination
export function useStoreManagement(initialFilters: StoreFilters = {}) {
  const [filters, setFilters] = useState<StoreFilters>({
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc',
    ...initialFilters,
  })

  const { data, isLoading, error, refetch } = useStores(filters)

  const updateFilters = useCallback((newFilters: Partial<StoreFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }, [])

  const resetFilters = useCallback(() => {
    setFilters({
      page: 1,
      limit: 10,
      sortBy: 'createdAt',
      sortOrder: 'desc',
    })
  }, [])

  return {
    stores: data?.stores || [],
    pagination: data?.pagination,
    filters,
    updateFilters,
    resetFilters,
    isLoading,
    error,
    refetch,
  }
}

// Hook for user store management with pagination
export function useMyStoreManagement(initialFilters: StoreFilters = {}) {
  const [filters, setFilters] = useState<StoreFilters>({
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc',
    ...initialFilters,
  })

  const { data, isLoading, error, refetch } = useMyStores(filters)

  const updateFilters = useCallback((newFilters: Partial<StoreFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }, [])

  const resetFilters = useCallback(() => {
    setFilters({
      page: 1,
      limit: 10,
      sortBy: 'createdAt',
      sortOrder: 'desc',
    })
  }, [])

  return {
    stores: data?.stores || [],
    pagination: data?.pagination,
    filters,
    updateFilters,
    resetFilters,
    isLoading,
    error,
    refetch,
  }
}