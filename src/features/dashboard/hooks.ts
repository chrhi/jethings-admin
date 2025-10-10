import { useQuery } from '@tanstack/react-query'
import { dashboardQueries } from './queries'
import { queryKeys } from './query-keys'

// Query hooks
export const useDashboardStatsQuery = () => {
  return useQuery({
    queryKey: queryKeys.dashboard.stats(),
    queryFn: dashboardQueries.fetchDashboardStats,
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}
