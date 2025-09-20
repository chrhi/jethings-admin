"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { RoleTable, RoleStats, CreateRoleForm } from "@/features/roles"
import { useRoles } from "@/hooks/use-roles"
import { RoleFilters, CreateRoleData } from "@/features/roles/types"
import { Plus, RefreshCw, Search, Filter } from "lucide-react"

export default function RoleManagementPage() {
  const [filters, setFilters] = useState<RoleFilters>({
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc',
    search: '',
    isActive: undefined,
  })
  const [showCreateForm, setShowCreateForm] = useState(false)

  const { roles, loading, error, pagination, createRole, refetch } = useRoles(filters)

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }))
  }

  const handleSearchChange = (search: string) => {
    setFilters(prev => ({ ...prev, search, page: 1 }))
  }

  const handleActiveFilterChange = (isActive: boolean | undefined) => {
    setFilters(prev => ({ ...prev, isActive, page: 1 }))
  }

  const handleRefresh = () => {
    refetch()
  }

  const handleCreateRole = async (data: CreateRoleData) => {
    try {
      await createRole(data)
      setShowCreateForm(false)
    } catch (error) {
      console.error('Failed to create role:', error)
    }
  }

  const handleCancelCreate = () => {
    setShowCreateForm(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Role Management</h1>
          <p className="text-muted-foreground">
            Create and manage user roles with specific permissions
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleRefresh} disabled={loading}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={() => setShowCreateForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Role
          </Button>
        </div>
      </div>

      {/* Create Role Form */}
      {showCreateForm && (
        <CreateRoleForm
          onSubmit={handleCreateRole}
          onCancel={handleCancelCreate}
          loading={loading}
        />
      )}

      {/* Role Stats */}
      <RoleStats roles={roles} />

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="search">Search Roles</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by name or description..."
                  value={filters.search || ''}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Status Filter</Label>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="active-only"
                    checked={filters.isActive === true}
                    onCheckedChange={(checked) => 
                      handleActiveFilterChange(checked ? true : undefined)
                    }
                  />
                  <Label htmlFor="active-only">Active only</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="inactive-only"
                    checked={filters.isActive === false}
                    onCheckedChange={(checked) => 
                      handleActiveFilterChange(checked ? false : undefined)
                    }
                  />
                  <Label htmlFor="inactive-only">Inactive only</Label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Sort By</Label>
              <div className="flex space-x-2">
                <Button
                  variant={filters.sortBy === 'name' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilters(prev => ({ ...prev, sortBy: 'name', page: 1 }))}
                >
                  Name
                </Button>
                <Button
                  variant={filters.sortBy === 'createdAt' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilters(prev => ({ ...prev, sortBy: 'createdAt', page: 1 }))}
                >
                  Created
                </Button>
                <Button
                  variant={filters.sortBy === 'userCount' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilters(prev => ({ ...prev, sortBy: 'userCount', page: 1 }))}
                >
                  Users
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

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

      {/* Roles Table */}
      <Card>
        <CardHeader>
          <CardTitle>Roles</CardTitle>
        </CardHeader>
        <CardContent>
          <RoleTable 
            data={roles} 
            loading={loading}
          />
          
          {/* Pagination */}
          <div className="mt-4">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center space-x-2">
                <p className="text-sm text-muted-foreground">
                  Showing {pagination ? ((pagination.page - 1) * pagination.limit + 1) : 0} to{' '}
                  {pagination ? Math.min(pagination.page * pagination.limit, pagination.total) : 0} of{' '}
                  {pagination?.total || 0} results
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange((pagination?.page || 1) - 1)}
                  disabled={!pagination?.hasPrev || loading}
                >
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {pagination?.page || 1} of {pagination?.totalPages || 1}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange((pagination?.page || 1) + 1)}
                  disabled={!pagination?.hasNext || loading}
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
