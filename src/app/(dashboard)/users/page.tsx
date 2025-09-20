"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "@/features/users/table"
import { columns } from "@/features/users/columns"
import { UserFiltersComponent } from "@/features/users/components/user-filters"
import { UserStatsComponent, RoleDistributionStats } from "@/features/users/components/user-stats"
import { PaginationComponent } from "@/features/users/components/pagination"
import { useUsers, useUserStats } from "@/hooks/use-users"
import { UserFilters } from "@/features/users/types"
import { Plus, Download, RefreshCw } from "lucide-react"

export default function UsersPage() {
  const [filters, setFilters] = useState<UserFilters>({
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc'
  })

  const { users, loading, error, pagination, refetch } = useUsers(filters)
  const { stats, loading: statsLoading } = useUserStats()

  const handleFiltersChange = (newFilters: UserFilters) => {
    setFilters(newFilters)
  }

  const handleResetFilters = () => {
    setFilters({
      page: 1,
      limit: 10,
      sortBy: 'createdAt',
      sortOrder: 'desc'
    })
  }

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }))
  }

  const handleLimitChange = (limit: number) => {
    setFilters(prev => ({ ...prev, limit, page: 1 }))
  }

  const handleRefresh = () => {
    refetch()
  }

  const handleExport = () => {
    // TODO: Implement export functionality
    console.log('Export users')
  }

  const handleCreateUser = () => {
    // TODO: Implement create user modal
    console.log('Create user')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground">
            Manage and monitor user accounts
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleRefresh} disabled={loading}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={handleCreateUser}>
            <Plus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </div>
      </div>

      {/* Stats */}
      <UserStatsComponent stats={stats} loading={statsLoading} />

      {/* Role Distribution */}
      <RoleDistributionStats stats={stats} />

      {/* Filters */}
      <UserFiltersComponent
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onReset={handleResetFilters}
      />

      {/* Error State */}
      {error && (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-destructive mb-4">{error}</p>
              <Button variant="outline" onClick={handleRefresh}>
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable 
            columns={columns} 
            data={users} 
            loading={loading}
          />
          
          {/* Pagination */}
          <div className="mt-4">
            <PaginationComponent
              pagination={pagination}
              onPageChange={handlePageChange}
              onLimitChange={handleLimitChange}
              loading={loading}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
