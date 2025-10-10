// Mock data for dashboard stats
const mockDashboardStats = {
  totalUsers: 1295,
  totalStores: 48,
  totalProducts: 2920,
  processedMoney: 17500,
}

export const dashboardQueries = {
  // Fetch dashboard stats - using mock data until API endpoint is available
  fetchDashboardStats: async (): Promise<typeof mockDashboardStats> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))
    return mockDashboardStats
  },
}
