"use client"

import { useState, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DataTable, createColumns, PaginationComponent } from "@/features/stores"
import { useStoresQuery, useUpdateStoreMutation, useDeleteStoreMutation } from "@/features/stores/hooks"
import { Store as Tstore, StoreFilters } from "@/features/stores/types"
import { Search, RefreshCw } from "lucide-react"
import { Input } from "@/components/ui/input"
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
  const [selectedStore, setSelectedStore] = useState<Tstore | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)

  
  // Memoize filters to ensure React Query detects changes properly
  const filters: StoreFilters = useMemo(() => ({
    search: searchQuery || undefined,
    page,
    limit,
  }), [searchQuery, page, limit])
  
  const { data: storesData, isLoading, error, refetch } = useStoresQuery(filters)

  const updateStoreMutation = useUpdateStoreMutation()
  const deleteStoreMutation = useDeleteStoreMutation()
  
  const stores = storesData?.store || []
  const pagination = storesData?.pagination || null

  

  const handleSearch = (value: string) => {
    setSearchQuery(value)
    setPage(1) 
  }

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
  }

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit)
    setPage(1) 
  }

  const handleRefresh = () => {
    refetch()
  }

  const resetFilters = () => {
    setSearchQuery("")
    setPage(1) 
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

    handleStoreDelete,
    handleStatusChange
  )

  return (
    <div className="space-y-6 px-4">
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
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
        </div>
      </div>

    
   
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
            
            {searchQuery && (
              <Button 
                variant="outline" 
                onClick={resetFilters}
                className="w-full sm:w-auto"
              >
                Réinitialiser
              </Button>
            )}
          </div>
        </CardContent>
      </Card>


     
        <Card className="border-none p-0">
          <CardContent className="p-0">
            <DataTable 
              columns={columns} 
              data={stores || []} 
              loading={isLoading}
            />
          </CardContent>
        </Card>

        {/* Pagination */}
        {pagination && (
          <div className="mt-4">
            <PaginationComponent
              pagination={pagination}
              onPageChange={handlePageChange}
              onLimitChange={handleLimitChange}
              loading={isLoading}
            />
          </div>
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
