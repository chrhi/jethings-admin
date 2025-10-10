"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import toast from "react-hot-toast"
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog"
import { Pagination } from "@/components/ui/pagination"

// Product Types Components
import { ProductTypeTable } from "@/features/products/table"
import { createColumns } from "@/features/products/columns"
import { ProductTypeModal } from "@/features/products/components/product-type-modal"
import { ProductTypeStatsComponent } from "@/features/products/components/product-type-stats"
import { ProductTypeFiltersComponent } from "@/features/products/components/product-type-filters"

// Types and Hooks
import { ProductType, ProductTypeFilters } from "@/features/products/types"
import { useProductTypes, useProductTypeStats, useProductTypeActions } from "@/hooks/use-product-types"

export default function ProductTypesPage() {
  const [filters, setFilters] = useState<ProductTypeFilters>({
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc'
  })
  const [selectedProductType, setSelectedProductType] = useState<ProductType | undefined>()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [productTypeToDelete, setProductTypeToDelete] = useState<ProductType | undefined>()

  const { data: productTypesData, isLoading: loading, refetch } = useProductTypes(filters)
  const { stats, loading: statsLoading } = useProductTypeStats()
  const { createProductType, updateProductType, deleteProductType, loading: actionLoading } = useProductTypeActions()

  // Extract product types from the response
  const productTypes = Array.isArray(productTypesData) ? productTypesData : []

  // Table columns with action handlers
  const columns = createColumns(
    (productType) => {
      setSelectedProductType(productType)
      setIsModalOpen(true)
    },
    (productType) => {
      setProductTypeToDelete(productType)
      setDeleteDialogOpen(true)
    }
  )

  const handleCreate = () => {
    setSelectedProductType(undefined)
    setIsModalOpen(true)
  }

  const handleSubmit = async (data: { name: string; description?: string; isActive: boolean }) => {
    try {
      let result
      if (selectedProductType) {
        result = await updateProductType(selectedProductType.id, data)
      } else {
        result = await createProductType(data)
      }

      if (result.success) {
        toast.success(result.message)
        setIsModalOpen(false)
        refetch()
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      toast.error("An unexpected error occurred")
    }
  }

  const handleDelete = async () => {
    if (!productTypeToDelete) return

    try {
      const result = await deleteProductType(productTypeToDelete.id)
      
      if (result.success) {
        toast.success(result.message)
        setDeleteDialogOpen(false)
        setProductTypeToDelete(undefined)
        refetch()
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      toast.error("An unexpected error occurred")
    }
  }

  const handleFiltersChange = (newFilters: ProductTypeFilters) => {
    setFilters(newFilters)
  }

  const handleClearFilters = () => {
    setFilters({
      page: 1,
      limit: 10,
      sortBy: 'createdAt',
      sortOrder: 'desc'
    })
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Product Types</h2>
          <p className="text-muted-foreground">
            Manage product types and categories for your products
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Add Product Type
        </Button>
      </div>

      {/* Stats */}
      <ProductTypeStatsComponent stats={stats} loading={statsLoading} />

      {/* Filters and Table */}
      <Card className="rounded-sm">
        <CardHeader>
          <CardTitle>Product Types</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ProductTypeFiltersComponent
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onClearFilters={handleClearFilters}
          />
          
          <ProductTypeTable
            columns={columns}
            data={productTypes}
            loading={loading}
          />

          {/* Simple pagination indicator */}
          {!loading && productTypes.length > 0 && (
            <div className="flex items-center justify-center pt-4">
              <p className="text-sm text-muted-foreground">
                Showing {productTypes.length} product types
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Modal */}
      <ProductTypeModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        productType={selectedProductType}
        onSubmit={handleSubmit}
        loading={actionLoading}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Product Type"
        description={`Are you sure you want to delete "${productTypeToDelete?.name}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        confirmText="Delete"
        cancelText="Cancel"
        loading={actionLoading}
        variant="destructive"
      />
    </div>
  )
}
