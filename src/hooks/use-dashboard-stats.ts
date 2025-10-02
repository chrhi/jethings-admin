"use client"

import { useState, useEffect } from 'react'
import { DashboardKpiStats } from '@/features/dashboard/components/kpi-cards'

export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardKpiStats>({
    totalUsers: 0,
    totalStores: 0,
    totalProducts: 0,
    processedMoney: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true)
      
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 800))
        
        // Mock dashboard statistics
        const dashboardStats: DashboardKpiStats = {
          totalUsers: 1295,
          totalStores: 48,
          totalProducts: 2920,
          processedMoney: 17500,
        }
        
        setStats(dashboardStats)
      } catch (error) {
        console.error('Error fetching dashboard stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  return { stats, loading }
}
