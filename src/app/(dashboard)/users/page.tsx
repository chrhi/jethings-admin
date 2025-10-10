"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent} from "@/components/ui/card"
import { DataTable } from "@/features/users/table"
import { createColumns } from "@/features/users/columns"
import { UserStatsComponent} from "@/features/users/components/user-stats"
import { PaginationComponent } from "@/features/users/components/pagination"
import { useUsersQuery, useUserStatsQuery } from "@/features/users/hooks"
import { UserFilters } from "@/features/users/types"
import { Plus, Download, RefreshCw, FileSpreadsheet } from "lucide-react"
import { exportUsersToExcel, exportUsersToCSV } from "@/lib/export-utils"
import toast from "react-hot-toast"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function UsersPage() {
  const [filters, setFilters] = useState<UserFilters>({
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc'
  })

  const { data: usersData, isLoading: loading, error, refetch } = useUsersQuery(filters)
  const { data: stats, isLoading: statsLoading } = useUserStatsQuery()

  const users = usersData?.users || []
  const pagination = usersData?.pagination || null

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }))
  }

  const handleLimitChange = (limit: number) => {
    setFilters(prev => ({ ...prev, limit, page: 1 }))
  }

  const handleRefresh = () => {
    refetch()
  }

  const handleExportExcel = () => {
    try {
      exportUsersToExcel(users, {
        filename: 'users',
        sheetName: 'Users',
        includeHeaders: true
      })
      toast.success(`${users.length} utilisateurs exportés vers Excel avec succès !`)
    } catch (error) {
      console.error('Error exporting to Excel:', error)
      toast.error('Échec de l\'exportation vers Excel. Veuillez réessayer.')
    }
  }

  const handleExportCSV = () => {
    try {
      exportUsersToCSV(users, {
        filename: 'users',
        includeHeaders: true
      })
      toast.success(`${users.length} utilisateurs exportés vers CSV avec succès !`)
    } catch (error) {
      console.error('Error exporting to CSV:', error)
      toast.error('Échec de l\'exportation vers CSV. Veuillez réessayer.')
    }
  }

  const handleCreateUser = () => {
  
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
            Actualiser
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" disabled={loading || users.length === 0}>
                <Download className="h-4 w-4 mr-2" />
                Exporter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleExportExcel}>
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Exporter en Excel
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleExportCSV}>
                <Download className="h-4 w-4 mr-2" />
                Exporter en CSV
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
         
        </div>
      </div>


      {/* Stats */}
      <UserStatsComponent stats={stats || null} loading={statsLoading} />



      {/* Error State */}
      {error && (
        <Card className="border-destructive ">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-destructive mb-4">{error.message}</p>
              <Button variant="outline" onClick={handleRefresh}>
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Users Table */}
      <Card className="border-none p-0">
    
        <CardContent className="p-0">
          <DataTable 
            columns={createColumns(refetch)} 
            data={users} 
            loading={loading}
            onUserUpdate={refetch}
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
