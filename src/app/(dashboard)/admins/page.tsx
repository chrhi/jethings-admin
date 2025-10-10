"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { DataTable } from "@/features/users/table"
import { createColumns } from "@/features/users/columns"
import { UserStatsComponent } from "@/features/users/components/user-stats"
import { PaginationComponent } from "@/features/users/components/pagination"
import { 
  useAdminsQuery, 
  useCreateAdminMutation, 
  useDeleteAdminMutation, 
  useBlockAdminMutation, 
  useUnblockAdminMutation 
} from "@/features/users/hooks"
import { UserFilters, CreateAdminData, User } from "@/features/users/types"
import { Plus, RefreshCw, Search, Filter } from "lucide-react"

export default function AdminManagementPage() {
  const [filters, setFilters] = useState<UserFilters>({
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc',
    search: '',
    isActive: undefined,
  })
  const [createModalOpen, setCreateModalOpen] = useState(false)

  const { data: adminsData, isLoading: loading, error, refetch } = useAdminsQuery()
  const createAdminMutation = useCreateAdminMutation()
  const deleteAdminMutation = useDeleteAdminMutation()
  const blockAdminMutation = useBlockAdminMutation()
  const unblockAdminMutation = useUnblockAdminMutation()

  const admins = adminsData || []

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

  const handleCreateAdmin = async (data: CreateAdminData) => {
    try {
      await createAdminMutation.mutateAsync(data)
      setCreateModalOpen(false)
      refetch() // Refresh the admins list
    } catch (error) {
      console.error('Failed to create admin:', error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Management</h1>
          <p className="text-muted-foreground">
            Manage and monitor admin accounts
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleRefresh} disabled={loading}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={() => setCreateModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Admin
          </Button>
        </div>
      </div>

      {/* Create Admin Modal - TODO: Implement admin creation modal */}
      {createModalOpen && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Admin</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Admin creation modal will be implemented here.
            </p>
            <div className="flex justify-end space-x-2 mt-4">
              <Button variant="outline" onClick={() => setCreateModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setCreateModalOpen(false)}>
                Create Admin
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Admin Stats */}
      <UserStatsComponent stats={null} loading={false} />

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
              <Label htmlFor="search">Search Admins</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by name or email..."
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
                  variant={filters.sortBy === 'firstName' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilters(prev => ({ ...prev, sortBy: 'firstName', page: 1 }))}
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
                  variant={filters.sortBy === 'lastActivity' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilters(prev => ({ ...prev, sortBy: 'lastActivity', page: 1 }))}
                >
                  Activity
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
              <p className="text-destructive mb-4">{String(error?.message || 'An error occurred')}</p>
              <Button variant="outline" onClick={handleRefresh}>
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Admins Table */}
      <Card>
        <CardHeader>
          <CardTitle>Admins</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable 
            columns={createColumns(refetch)} 
            data={admins} 
            loading={loading}
          />
          
          {/* Admin Count */}
          <div className="mt-4">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center space-x-2">
                <p className="text-sm text-muted-foreground">
                  Showing {admins.length} admin{admins.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
