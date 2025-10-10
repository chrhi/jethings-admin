"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "@/components/ui/data-table"
import { Plus, Shield } from "lucide-react"
import { 
  useResourcesQuery, 
  useCreateResourceMutation, 
  useUpdateResourceMutation, 
  useDeleteResourceMutation 
} from "@/features/resources/hooks"
import { createResourceColumns, ResourceModal, ResourceFiltersComponent } from "@/features/resources"
import { Resource, ResourceFilters, CreateResourceRequest, UpdateResourceRequest } from "@/features/resources/types"
import { useConfirmationContext } from "@/contexts/confirmation-context"

export default function ResourcesPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [editingResource, setEditingResource] = useState<Resource | undefined>()
  const [filters, setFilters] = useState<ResourceFilters>({
    page: 1,
    limit: 10,
  })

  const { openConfirmation } = useConfirmationContext()
  
  // React Query hooks
  const { data: resourcesData, isLoading, error, refetch } = useResourcesQuery(filters)
  const createResourceMutation = useCreateResourceMutation()
  const updateResourceMutation = useUpdateResourceMutation()
  const deleteResourceMutation = useDeleteResourceMutation()

  const resources = resourcesData?.data || []
  const pagination = resourcesData ? {
    total: resourcesData.total,
    page: resourcesData.page,
    limit: resourcesData.limit,
    totalPages: resourcesData.totalPages,
  } : null

  const handleCreateResource = async (data: CreateResourceRequest) => {
    try {
      await createResourceMutation.mutateAsync(data)
      setModalOpen(false)
    } catch (error) {
      // Error handling is done in the mutation
    }
  }

  const handleUpdateResource = async (data: UpdateResourceRequest) => {
    if (!editingResource) return

    try {
      await updateResourceMutation.mutateAsync({ id: editingResource.id, data })
      setModalOpen(false)
      setEditingResource(undefined)
    } catch (error) {
      // Error handling is done in the mutation
    }
  }

  const handleDeleteResource = async (resource: Resource) => {
    openConfirmation(
      {
        title: "Delete Resource",
        description: `Are you sure you want to delete the resource "${resource.name}"? This action cannot be undone.`,
        variant: "destructive",
        confirmText: "Delete",
        cancelText: "Cancel",
      },
      async () => {
        try {
          await deleteResourceMutation.mutateAsync(resource.id)
        } catch (error) {
          // Error handling is done in the mutation
        }
      }
    )
  }

  const handleEditResource = (resource: Resource) => {
    setEditingResource(resource)
    setModalOpen(true)
  }

  const handleModalClose = () => {
    setModalOpen(false)
    setEditingResource(undefined)
  }

  const handleFiltersChange = (newFilters: ResourceFilters) => {
    setFilters(newFilters)
  }

  const columns = createResourceColumns(handleEditResource, handleDeleteResource)

  if (error) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Card className="w-96">
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
            <CardDescription>{error?.message || 'An error occurred'}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => refetch()}>
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Shield className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Resources</h1>
            <p className="text-muted-foreground">
              Manage RBAC resource definitions
            </p>
          </div>
        </div>
        <Button onClick={() => setModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Resource
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>
            Search and filter resources by various criteria
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResourceFiltersComponent
            filters={filters}
            onFiltersChange={handleFiltersChange}
            loading={isLoading}
          />
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>Resources</CardTitle>
          <CardDescription>
            {pagination?.total || 0} resource{(pagination?.total || 0) !== 1 ? 's' : ''} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={resources}
            loading={isLoading}
          />
          
          {/* Simple pagination indicator */}
          {!isLoading && resources.length > 0 && pagination && (
            <div className="flex items-center justify-center pt-4">
              <p className="text-sm text-muted-foreground">
                Showing {resources.length} of {pagination.total} resources
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal */}
      <ResourceModal
        open={modalOpen}
        onOpenChange={handleModalClose}
        resource={editingResource}
        onSubmit={editingResource ? handleUpdateResource : handleCreateResource}
        loading={createResourceMutation.isPending || updateResourceMutation.isPending}
      />

    </div>
  )
}