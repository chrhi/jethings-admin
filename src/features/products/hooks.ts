import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { productsQueries } from './queries'
import { productsMutations } from './mutations'
import { queryKeys } from './query-keys'
import { ProductFilters } from './types'
import toast from 'react-hot-toast'

// Query hooks
export const useProductsQuery = (filters: ProductFilters = {}) => {
  return useQuery({
    queryKey: queryKeys.products.list(filters),
    queryFn: () => productsQueries.fetchProducts(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useProductByIdQuery = (id: string) => {
  return useQuery({
    queryKey: queryKeys.products.detail(id),
    queryFn: () => productsQueries.fetchProductById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useProductStatsQuery = () => {
  return useQuery({
    queryKey: queryKeys.products.stats(),
    queryFn: productsQueries.fetchProductStats,
    staleTime: 10 * 60 * 1000, // 10 minutes
    // Return mock data for now
    placeholderData: {
      total: 0,
      active: 0,
      inactive: 0,
      featured: 0,
      lowStock: 0,
      outOfStock: 0
    }
  })
}

// Mutation hooks
export const useCreateProductMutation = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: productsMutations.createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.lists() })
      queryClient.invalidateQueries({ queryKey: queryKeys.products.stats() })
      toast.success('Product created successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create product')
    },
  })
}

export const useUpdateProductMutation = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      productsMutations.updateProduct(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.lists() })
      queryClient.invalidateQueries({ queryKey: queryKeys.products.stats() })
      queryClient.invalidateQueries({ queryKey: queryKeys.products.detail(variables.id) })
      toast.success('Product updated successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update product')
    },
  })
}

export const useDeleteProductMutation = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: productsMutations.deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.lists() })
      queryClient.invalidateQueries({ queryKey: queryKeys.products.stats() })
      toast.success('Product deleted successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete product')
    },
  })
}

// Compatibility hook for actions
export const useProductActions = () => {
  const createMutation = useCreateProductMutation()
  const updateMutation = useUpdateProductMutation()
  const deleteMutation = useDeleteProductMutation()
  
  return {
    createProduct: async (data: any) => {
      try {
        await createMutation.mutateAsync(data)
        return { success: true, message: 'Product created successfully' }
      } catch (error) {
        return { success: false, message: error instanceof Error ? error.message : 'Failed to create product' }
      }
    },
    updateProduct: async (id: string, data: any) => {
      try {
        await updateMutation.mutateAsync({ id, data })
        return { success: true, message: 'Product updated successfully' }
      } catch (error) {
        return { success: false, message: error instanceof Error ? error.message : 'Failed to update product' }
      }
    },
    deleteProduct: async (id: string) => {
      try {
        await deleteMutation.mutateAsync(id)
        return { success: true, message: 'Product deleted successfully' }
      } catch (error) {
        return { success: false, message: error instanceof Error ? error.message : 'Failed to delete product' }
      }
    },
    loading: createMutation.isPending || updateMutation.isPending || deleteMutation.isPending
  }
}