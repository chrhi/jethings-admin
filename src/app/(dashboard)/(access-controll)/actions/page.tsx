"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "@/components/ui/data-table"
import { Plus, Zap } from "lucide-react"
import { 
  useActionsQuery, 
  useCreateActionMutation, 
  useUpdateActionMutation, 
  useDeleteActionMutation 
} from "@/features/actions/hooks"
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

  const { openConfirmation } = useConfirmationContext()
  
  // React Query hooks
  const { data: actionsData, isLoading, error, refetch } = useActionsQuery(filters)
  const createActionMutation = useCreateActionMutation()
  const updateActionMutation = useUpdateActionMutation()
  const deleteActionMutation = useDeleteActionMutation()

  const actions = actionsData?.data || []
  const pagination = actionsData ? {
    total: actionsData.total,
    page: actionsData.page,
    limit: actionsData.limit,
    totalPages: actionsData.totalPages,
  } : null

  const handleCreateAction = async (data: CreateActionRequest) => {
    try {
      await createActionMutation.mutateAsync(data)
      setModalOpen(false)
    } catch (error) {
      // Error handling is done in the mutation
    }
  }

  const handleUpdateAction = async (data: UpdateActionRequest) => {
    if (!editingAction) return

    try {
      await updateActionMutation.mutateAsync({ id: editingAction.id, data })
      setModalOpen(false)
      setEditingAction(undefined)
    } catch (error) {
      // Error handling is done in the mutation
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
          await deleteActionMutation.mutateAsync(action.id)
        } catch (error) {
          // Error handling is done in the mutation
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
            loading={isLoading}
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
            loading={isLoading}
          />
          
          {/* Simple pagination indicator */}
          {!isLoading && actions.length > 0 && pagination && (
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
        loading={createActionMutation.isPending || updateActionMutation.isPending}
      />
    </div>
  )
}
