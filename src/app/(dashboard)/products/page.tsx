"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import toast from "react-hot-toast"
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog"
import { ProductTable } from "@/features/products/product-table"
import { createProductColumns } from "@/features/products/product-columns"
import { ProductModal } from "@/features/products/components/product-modal"
import { ProductStatsComponent } from "@/features/products/components/product-stats"
import { ProductFiltersComponent } from "@/features/products/components/product-filters"
import { Product, ProductFilters } from "@/features/products/types"
import { useProducts, useProductStats, useProductActions } from "@/hooks/use-products"

export default function ProductsPage() {
  const [filters, setFilters] = useState<ProductFilters>({
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc'
  })
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState<Product | undefined>()

  const { products, loading, refetch } = useProducts(filters)
  const { stats, loading: statsLoading } = useProductStats()
  const { createProduct, updateProduct, deleteProduct, loading: actionLoading } = useProductActions()


  const columns = createProductColumns(
    (product) => {
      setSelectedProduct(product)
      setIsModalOpen(true)
    },
    (product) => {
      setProductToDelete(product)
      setDeleteDialogOpen(true)
    }
  )

  const handleCreate = () => {
    setSelectedProduct(undefined)
    setIsModalOpen(true)
  }

  const handleSubmit = async (data: {
    name: string
    description?: string
    price: number
    sku: string
    category: string
    productTypeId: string
    stock: number
    images?: string[]
    isActive: boolean
    isFeatured: boolean
  }) => {
    try {
      let result
      if (selectedProduct) {
        result = await updateProduct(selectedProduct.id, data)
      } else {
        result = await createProduct(data)
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
    if (!productToDelete) return

    try {
      const result = await deleteProduct(productToDelete.id)
      
      if (result.success) {
        toast.success(result.message)
        setDeleteDialogOpen(false)
        setProductToDelete(undefined)
        refetch()
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      toast.error("An unexpected error occurred")
    }
  }

  const handleFiltersChange = (newFilters: ProductFilters) => {
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
          <h2 className="text-3xl font-bold tracking-tight">Products</h2>
          <p className="text-muted-foreground">
            Manage your product catalog and inventory
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>

      {/* Stats */}
      <ProductStatsComponent stats={stats} loading={statsLoading} />

      {/* Filters and Table */}
      <Card className="rounded-sm">
        <CardHeader>
          <CardTitle>Products</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ProductFiltersComponent
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onClearFilters={handleClearFilters}
          />
          
          <ProductTable
            columns={columns}
            data={products}
            loading={loading}
          />

          {/* Simple pagination indicator */}
          {!loading && products.length > 0 && (
            <div className="flex items-center justify-center pt-4">
              <p className="text-sm text-muted-foreground">
                Showing {products.length} products
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Modal */}
      <ProductModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        product={selectedProduct}
        onSubmit={handleSubmit}
        loading={actionLoading}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Product"
        description={`Are you sure you want to delete "${productToDelete?.name}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        confirmText="Delete"
        cancelText="Cancel"
        loading={actionLoading}
        variant="destructive"
      />
    </div>
  )
}
