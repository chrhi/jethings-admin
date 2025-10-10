"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DataTable, createColumns, StoreStatsComponent } from "@/features/stores"
import { useStoresQuery, useUpdateStoreMutation, useDeleteStoreMutation } from "@/features/stores/hooks"
import {  Store as Tstore } from "@/features/stores/types"
import { Plus, RefreshCw, Search, Filter, Store } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import toast from "react-hot-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function StoresPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [activeFilter, setActiveFilter] = useState<string>("all")
  const [selectedStore, setSelectedStore] = useState<Tstore | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  
  const filters = {
    search: searchQuery || undefined,
    status: statusFilter !== "all" ? [statusFilter as any] : undefined,
    isActive: activeFilter !== "all" ? activeFilter === "true" : undefined,
  }
  
  const { data: storesData, isLoading, error, refetch } = useStoresQuery(filters)
  const updateStoreMutation = useUpdateStoreMutation()
  const deleteStoreMutation = useDeleteStoreMutation()
  
  const stores = storesData?.data || []
  const pagination = storesData ? {
    page: storesData.page,
    limit: storesData.limit,
    total: storesData.total,
    totalPages: storesData.totalPages
  } : null

  const stats = null
  const statsLoading = false

  const handleSearch = (value: string) => {
    setSearchQuery(value)
  }

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value)
  }

  const handleActiveFilter = (value: string) => {
    setActiveFilter(value)
  }

  const handlePageChange = (page: number) => {
    // React Query will automatically refetch when filters change
  }

  const handleLimitChange = (limit: number) => {
    // React Query will automatically refetch when filters change
  }

  const handleRefresh = () => {
    refetch()
  }

  const resetFilters = () => {
    setSearchQuery("")
    setStatusFilter("all")
    setActiveFilter("all")
  }

  const handleCreateStore = () => {
    toast('Fonctionnalité de création de magasin à implémenter', {
      icon: '🏪',
      duration: 3000
    })
  }

  const handleStoreUpdate = (store: Tstore) => {
    toast('Fonctionnalité de modification de magasin à implémenter', {
      icon: '✏️',
      duration: 3000
    })
  }

  const handleStatusChange = async (store: Tstore, status: 'accepted' | 'rejected') => {
    try {
      await updateStoreMutation.mutateAsync({
        id: store.id,
        data: { status }
      })
      toast.success(`Magasin ${status === 'accepted' ? 'accepté' : 'rejeté'} avec succès`)
    } catch (error) {
      toast.error('Erreur lors de la mise à jour du statut')
    }
  }

  const handleStoreDelete = (store: Tstore) => {
    setSelectedStore(store)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!selectedStore) return

    try {
      await deleteStoreMutation.mutateAsync(selectedStore.id)
      toast.success('Magasin supprimé avec succès')
      setDeleteDialogOpen(false)
      setSelectedStore(null)
    } catch (error) {
      toast.error('Erreur lors de la suppression du magasin')
    }
  }

  const columns = createColumns(
    handleStoreUpdate,
    handleStoreDelete,
    handleStatusChange
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestion des magasins</h1>
          <p className="text-muted-foreground">
            Gérez tous les magasins et leurs informations
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
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
   
      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par nom ou description..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={statusFilter} onValueChange={handleStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="accepted">Accepté</SelectItem>
                <SelectItem value="rejected">Rejeté</SelectItem>
              </SelectContent>
            </Select>

            <Select value={activeFilter} onValueChange={handleActiveFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Actif" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                <SelectItem value="true">Actif</SelectItem>
                <SelectItem value="false">Inactif</SelectItem>
              </SelectContent>
            </Select>

            <Button 
              variant="outline" 
              onClick={resetFilters}
              className="w-full sm:w-auto"
            >
              <Filter className="h-4 w-4 mr-2" />
              Réinitialiser
            </Button>
          </div>
        </CardContent>
      </Card>


      {/* Stores Table */}
      {!isLoading && (!stores || stores.length === 0) ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
                <Store className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Aucun magasin trouvé</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery || statusFilter !== "all" || activeFilter !== "all" 
                  ? "Aucun magasin ne correspond à vos critères de recherche."
                  : "Il n'y a pas encore de magasins dans le système."
                }
              </p>
              <Button onClick={handleCreateStore}>
                <Plus className="h-4 w-4 mr-2" />
                Créer le premier magasin
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-none p-0">
          <CardContent className="p-0">
            <DataTable 
              columns={columns} 
              data={stores || []} 
              loading={isLoading}
              pagination={pagination}
              onPageChange={handlePageChange}
              onLimitChange={handleLimitChange}
            />
          </CardContent>
        </Card>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer le magasin</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer le magasin "{selectedStore?.name}" ? 
              Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
