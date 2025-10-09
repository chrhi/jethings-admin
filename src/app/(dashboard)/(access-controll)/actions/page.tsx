"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "@/components/ui/data-table"
import { Plus, Zap } from "lucide-react"
import toast from "react-hot-toast"
import { useActions } from "@/hooks/use-actions"
import { createActionColumns, ActionModal, ActionFiltersComponent } from "@/features/actions"
import { Action, ActionFilters, CreateActionRequest, UpdateActionRequest } from "@/features/actions/types"
import { useConfirmationContext } from "@/contexts/confirmation-context"

export default function ActionsPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [editingAction, setEditingAction] = useState<Action | undefined>()
  const [filters, setFilters] = useState<ActionFilters>({
    page: 1,
    limit: 10,
  })
  const [actionLoading, setActionLoading] = useState(false)

  const { openConfirmation } = useConfirmationContext()
  const { 
    actions, 
    loading, 
    error, 
    pagination, 
    fetchActions, 
    createAction, 
    updateAction, 
    deleteAction 
  } = useActions()

  useEffect(() => {
    fetchActions(filters)
  }, [filters])

  const handleCreateAction = async (data: CreateActionRequest) => {
    setActionLoading(true)
    try {
      const result = await createAction(data)
      if (result) {
        toast.success("Action created successfully")
        setModalOpen(false)
        fetchActions(filters) // Refresh the list
      }
    } catch (error) {
      toast.error("Failed to create action")
    } finally {
      setActionLoading(false)
    }
  }

  const handleUpdateAction = async (data: UpdateActionRequest) => {
    if (!editingAction) return

    setActionLoading(true)
    try {
      const result = await updateAction(editingAction.id, data)
      if (result) {
        toast.success("Action updated successfully")
        setModalOpen(false)
        setEditingAction(undefined)
        fetchActions(filters) // Refresh the list
      }
    } catch (error) {
      toast.error("Failed to update action")
    } finally {
      setActionLoading(false)
    }
  }

  const handleDeleteAction = async (action: Action) => {
    openConfirmation(
      {
        title: "Delete Action",
        description: `Are you sure you want to delete the action "${action.name}"? This action cannot be undone.`,
        variant: "destructive",
        confirmText: "Delete",
        cancelText: "Cancel",
      },
      async () => {
        try {
          const success = await deleteAction(action.id)
          if (success) {
            toast.success("Action deleted successfully")
            fetchActions(filters) // Refresh the list
          }
        } catch (error) {
          toast.error("Failed to delete action")
        }
      }
    )
  }

  const handleEditAction = (action: Action) => {
    setEditingAction(action)
    setModalOpen(true)
  }

  const handleModalClose = () => {
    setModalOpen(false)
    setEditingAction(undefined)
  }

  const handleFiltersChange = (newFilters: ActionFilters) => {
    setFilters(newFilters)
  }

  const columns = createActionColumns(handleEditAction, handleDeleteAction)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Actions Management</h1>
          <p className="text-muted-foreground">
            Manage and configure actions across all resources
          </p>
        </div>
        <Button onClick={() => setModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Action
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="h-5 w-5" />
            <span>Filters</span>
          </CardTitle>
          <CardDescription>
            Filter actions by search term, resource, and status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ActionFiltersComponent
            filters={filters}
            onFiltersChange={handleFiltersChange}
            loading={loading}
          />
        </CardContent>
      </Card>

      {/* Actions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Actions</CardTitle>
          <CardDescription>
            A list of all actions in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={actions}
            loading={loading}
          />
          
          {/* Simple pagination indicator */}
          {!loading && actions.length > 0 && (
            <div className="flex items-center justify-center pt-4">
              <p className="text-sm text-muted-foreground">
                Showing {actions.length} of {pagination.total} actions
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal */}
      <ActionModal
        open={modalOpen}
        onOpenChange={handleModalClose}
        action={editingAction}
        onSubmit={editingAction ? handleUpdateAction : handleCreateAction}
        loading={actionLoading}
      />
    </div>
  )
}
