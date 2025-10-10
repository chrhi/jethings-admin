// This file is deprecated. Use the new React Query hooks from @/features/dashboard/hooks instead.
// 
// The new implementation:
// - Uses React Query for better caching and state management
// - Calls backend API directly via apiClient
// - Provides better error handling and loading states
// 
// Migration:
// - Replace useDashboardStats with useDashboardStatsQuery

export { 
  useDashboardStatsQuery as useDashboardStats
} from '@/features/dashboard/hooks'