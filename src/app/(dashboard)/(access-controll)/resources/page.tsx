"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "@/components/ui/data-table"
import { Plus, Shield } from "lucide-react"
import toast from "react-hot-toast"
import { useResources } from "@/hooks/use-resources"
import { createResourceColumns, ResourceModal, ResourceFiltersComponent, ResourceActionsSheet } from "@/features/resources"
import { Resource, ResourceFilters, CreateResourceRequest, UpdateResourceRequest } from "@/features/resources/types"

export default function ResourcesPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [editingResource, setEditingResource] = useState<Resource | undefined>()
  const [actionsSheetOpen, setActionsSheetOpen] = useState(false)
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null)
  const [filters, setFilters] = useState<ResourceFilters>({
    page: 1,
    limit: 10,
  })
  const [actionLoading, setActionLoading] = useState(false)

  const { 
    resources, 
    loading, 
    error, 
    pagination, 
    fetchResources, 
    createResource, 
    updateResource, 
    deleteResource 
  } = useResources()

 
  useEffect(() => {
    fetchResources(filters)
  }, [filters])

  const handleCreateResource = async (data: CreateResourceRequest) => {
    setActionLoading(true)
    try {
      const result = await createResource(data)
      if (result) {
        toast.success("Resource created successfully")
        setModalOpen(false)
        fetchResources(filters) // Refresh the list
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create resource")
    } finally {
      setActionLoading(false)
    }
  }

  const handleUpdateResource = async (data: UpdateResourceRequest) => {
    if (!editingResource) return

    setActionLoading(true)
    try {
      const result = await updateResource(editingResource.id, data)
      if (result) {
        toast.success("Resource updated successfully")
        setModalOpen(false)
        setEditingResource(undefined)
        fetchResources(filters) 
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update resource")
    } finally {
      setActionLoading(false)
    }
  }

  const handleDeleteResource = async (resource: Resource) => {
    if (!confirm(`Are you sure you want to delete the resource "${resource.name}"?`)) {
      return
    }

    try {
      const success = await deleteResource(resource.id)
      if (success) {
        toast.success("Resource deleted successfully")
        fetchResources(filters) // Refresh the list
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete resource")
    }
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

  const handleManageActions = (resource: Resource) => {
    setSelectedResource(resource)
    setActionsSheetOpen(true)
  }

  const handleActionsSheetClose = () => {
    setActionsSheetOpen(false)
    setSelectedResource(null)
  }


  const columns = createResourceColumns(handleEditResource, handleDeleteResource, handleManageActions)

  if (error) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Card className="w-96">
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => fetchResources(filters)}>
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
            loading={loading}
          />
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>Resources</CardTitle>
          <CardDescription>
            {pagination.total} resource{pagination.total !== 1 ? 's' : ''} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={resources}
            loading={loading}
          />
          
          {/* Simple pagination indicator */}
          {!loading && resources.length > 0 && (
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
        loading={actionLoading}
      />

      {/* Resource Actions Sheet */}
      <ResourceActionsSheet
        open={actionsSheetOpen}
        onOpenChange={handleActionsSheetClose}
        resource={selectedResource}
      />
    </div>
  )
}