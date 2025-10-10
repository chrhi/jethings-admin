import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { productTypesQueries } from './product-types-queries'
import { productTypesMutations } from './product-types-mutations'
import toast from 'react-hot-toast'

// Query hooks
export const useProductTypesQuery = (filters: any = {}) => {
  return useQuery({
    queryKey: ['product-types', filters],
    queryFn: () => productTypesQueries.fetchProductTypes(filters),
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

// Mock stats hook for now
export const useProductTypeStats = () => {
  return {
    stats: {
      total: 0,
      active: 0,
      inactive: 0
    },
    loading: false
  }
}

// Mock actions hook for compatibility
export const useProductTypeActions = () => {
  const createMutation = useCreateProductTypeMutation()
  const updateMutation = useUpdateProductTypeMutation()
  const deleteMutation = useDeleteProductTypeMutation()
  
  return {
    createProductType: async (data: any) => {
      try {
        await createMutation.mutateAsync(data)
        return { success: true, message: 'Product type created successfully' }
      } catch (error) {
        return { success: false, message: error instanceof Error ? error.message : 'Failed to create product type' }
      }
    },
    updateProductType: async (id: string, data: any) => {
      try {
        await updateMutation.mutateAsync({ id, data })
        return { success: true, message: 'Product type updated successfully' }
      } catch (error) {
        return { success: false, message: error instanceof Error ? error.message : 'Failed to update product type' }
      }
    },
    deleteProductType: async (id: string) => {
      try {
        await deleteMutation.mutateAsync(id)
        return { success: true, message: 'Product type deleted successfully' }
      } catch (error) {
        return { success: false, message: error instanceof Error ? error.message : 'Failed to delete product type' }
      }
    },
    loading: createMutation.isPending || updateMutation.isPending || deleteMutation.isPending
  }
}

export const useProductTypeByIdQuery = (id: string) => {
  return useQuery({
    queryKey: ['product-types', id],
    queryFn: () => productTypesQueries.fetchProductTypeById(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

// Mutation hooks
export const useCreateProductTypeMutation = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: productTypesMutations.createProductType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product-types'] })
      toast.success('Product type created successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create product type')
    },
  })
}

export const useUpdateProductTypeMutation = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      productTypesMutations.updateProductType(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['product-types'] })
      queryClient.invalidateQueries({ queryKey: ['product-types', variables.id] })
      toast.success('Product type updated successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update product type')
    },
  })
}

export const useDeleteProductTypeMutation = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: productTypesMutations.deleteProductType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product-types'] })
      toast.success('Product type deleted successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete product type')
    },
  })
}
