"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DataTable, createColumns, StoreStatsComponent } from "@/features/stores"
import { useStores, useStoreStats } from "@/hooks/use-stores"
import { StoreFilters } from "@/features/stores/types"
import { Plus, RefreshCw } from "lucide-react"
import toast from "react-hot-toast"

export default function StoresPage() {
  const [filters, setFilters] = useState<StoreFilters>({
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc'
  })

  const { stores, loading, error, total, refetch } = useStores(filters)
  const { stats, loading: statsLoading } = useStoreStats()

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }))
  }

  const handleLimitChange = (limit: number) => {
    setFilters(prev => ({ ...prev, limit, page: 1 }))
  }

  const handleRefresh = () => {
    refetch()
  }

  const handleCreateStore = () => {
    toast('Fonctionnalité de création de magasin à implémenter', {
      icon: '🏪',
      duration: 3000
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestion des magasins</h1>
          <p className="text-muted-foreground">
            Gérez tous vos magasins et leurs informations
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleRefresh} disabled={loading}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualiser
          </Button>
          <Button onClick={handleCreateStore}>
            <Plus className="h-4 w-4 mr-2" />
            Ajouter un magasin
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <StoreStatsComponent stats={stats} loading={statsLoading} />

      {/* Error State */}
      {error && (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-destructive mb-4">{error}</p>
              <Button variant="outline" onClick={handleRefresh}>
                Réessayer
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stores Table */}
      <Card className="border-none p-0">
        <CardContent className="p-0">
          <DataTable 
            columns={createColumns(refetch)} 
            data={stores} 
            loading={loading}
            onStoreUpdate={refetch}
          />
        </CardContent>
      </Card>
    </div>
  )
}
