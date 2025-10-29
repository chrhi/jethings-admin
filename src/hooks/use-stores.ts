

export { 
  useStoresQuery,
  useStoreByIdQuery,
  useUpdateStoreMutation,
  useDeleteStoreMutation
} from '@/features/stores/hooks'

// Export compatibility hooks
export function useStoreManagement(filters: any) {
  const { useStoresQuery } = require('@/features/stores/hooks')
  const query = useStoresQuery(filters)
  return {
    stores: query.data?.data || [],
    pagination: query.data ? {
      page: query.data.page,
      limit: query.data.limit,
      total: query.data.total,
      totalPages: query.data.totalPages
    } : null,
    filters,
    updateFilters: () => {},
    resetFilters: () => {},
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  }
}

export function useStoreStats() {
  return { data: null, isLoading: false }
}
