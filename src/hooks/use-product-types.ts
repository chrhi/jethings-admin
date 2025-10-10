// This file is deprecated. Use the new React Query hooks from @/features/products/product-types-hooks instead.
// 
// The new implementation:
// - Uses React Query for better caching and state management
// - Calls backend API directly via apiClient
// - Provides better error handling and loading states
// 
// Migration:
// - Replace useProductTypes with useProductTypesQuery
// - Replace useProductTypeActions with useCreateProductTypeMutation, useUpdateProductTypeMutation, useDeleteProductTypeMutation

export { 
  useProductTypesQuery as useProductTypes,
  useProductTypeStats,
  useProductTypeActions,
  useCreateProductTypeMutation,
  useUpdateProductTypeMutation,
  useDeleteProductTypeMutation
} from '@/features/products/product-types-hooks'