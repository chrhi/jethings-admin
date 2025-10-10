// This file is deprecated. Use the new React Query hooks from @/features/products/hooks instead.
// 
// The new implementation:
// - Uses React Query for better caching and state management
// - Calls backend API directly via apiClient
// - Provides better error handling and loading states
// 
// Migration:
// - Replace useProducts with useProductsQuery
// - Replace useProductStats with useProductStatsQuery
// - Replace useProductActions with useCreateProductMutation, useUpdateProductMutation, useDeleteProductMutation

export { 
  useProductsQuery as useProducts,
  useProductStatsQuery as useProductStats,
  useProductActions,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation
} from '@/features/products/hooks'
