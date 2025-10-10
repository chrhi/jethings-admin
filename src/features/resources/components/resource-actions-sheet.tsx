"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Plus, Zap, Shield, Edit, Trash2, MoreHorizontal } from "lucide-react"
import toast from "react-hot-toast"
import { useActionsQuery, useCreateActionMutation, useUpdateActionMutation, useDeleteActionMutation } from "@/features/actions/hooks"
import { ActionForm } from "@/features/actions/components/action-form"
import { Action, CreateActionRequest, UpdateActionRequest } from "@/features/actions/types"
import { Resource } from "@/features/resources/types"
import { format } from "date-fns"
import { useConfirmationContext } from "@/contexts/confirmation-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface ResourceActionsSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  resource: Resource | null
}

export function ResourceActionsSheet({
  open,
  onOpenChange,
  resource,
}: ResourceActionsSheetProps) {
  const [modalOpen, setModalOpen] = useState(false)
  const [editingAction, setEditingAction] = useState<Action | undefined>()

  const { openConfirmation } = useConfirmationContext()
  
  // React Query hooks
  const { data: actionsData, isLoading, error } = useActionsQuery({ page: 1, limit: 10 })
  const createActionMutation = useCreateActionMutation()
  const updateActionMutation = useUpdateActionMutation()
  const deleteActionMutation = useDeleteActionMutation()

  const actions = actionsData?.data || []

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

  const handleAddAction = () => {
    setEditingAction(undefined)
    setModalOpen(true)
  }

  if (!resource) return null

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="w-[800px] sm:max-w-[800px]">
          <SheetHeader>
            <SheetTitle className="flex items-center space-x-3">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Shield className="h-4 w-4 text-primary" />
              </div>
              <div>
                <div className="text-lg font-semibold">{resource.name}</div>
                <div className="text-sm text-muted-foreground font-mono">{resource.code}</div>
              </div>
            </SheetTitle>
            <SheetDescription>
              Manage actions for the "{resource.name}" resource
            </SheetDescription>
          </SheetHeader>

          <div className="mt-6 space-y-6 px-4">
            {/* Header with Add Button */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
              
                <h3 className="text-lg font-semibold">Actions</h3>
              </div>
              <Button onClick={handleAddAction} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Action
              </Button>
            </div>

            {/* Error State */}
            {error && (
              <Card className="border-destructive">
                <CardHeader>
                  <CardTitle className="text-destructive">Error</CardTitle>
                  <CardDescription>{error?.message || 'An error occurred'}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button onClick={() => window.location.reload()}>
                    Try Again
                  </Button>
                </CardContent>
              </Card>
            )}

             {/* Actions List */}
             {!error && (
               <Card>
                 <CardHeader>
                   <CardTitle>Actions</CardTitle>
                   <CardDescription>
                     {actionsData?.total || 0} action{(actionsData?.total || 0) !== 1 ? 's' : ''} found
                   </CardDescription>
                 </CardHeader>
                 <CardContent>
                   {isLoading ? (
                     <div className="space-y-3">
                       {[...Array(3)].map((_, i) => (
                         <div key={i} className="flex items-center space-x-3 p-3 border rounded-lg animate-pulse">
                           <div className="h-10 w-10 bg-muted rounded"></div>
                           <div className="flex-1 space-y-2">
                             <div className="h-4 bg-muted rounded w-1/4"></div>
                             <div className="h-3 bg-muted rounded w-1/2"></div>
                           </div>
                           <div className="h-6 bg-muted rounded w-16"></div>
                         </div>
                       ))}
                     </div>
                   ) : actions.length === 0 ? (
                     <div className="text-center py-8">
                       <Zap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                       <h3 className="text-lg font-semibold mb-2">No actions found</h3>
                       <p className="text-muted-foreground mb-4">
                         Get started by creating your first action for this resource.
                       </p>
                       <Button onClick={handleAddAction} size="sm">
                         <Plus className="h-4 w-4 mr-2" />
                         Add Action
                       </Button>
                     </div>
                   ) : (
                     <div className="space-y-3">
                       {actions.map((action) => (
                         <div key={action.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                           <div className="flex items-center space-x-3 flex-1">
                             <div className="h-10 w-10 rounded-sm bg-muted flex items-center justify-center border">
                               <Zap className="h-5 w-5 text-muted-foreground" />
                             </div>
                             <div className="flex-1 min-w-0">
                               <div className="flex items-center space-x-2 mb-1">
                                 <span className="font-medium font-mono text-base">{action.code}</span>
                                 <Badge variant={action.isActive ? "default" : "secondary"} className="text-xs">
                                   {action.isActive ? "Active" : "Inactive"}
                                 </Badge>
                               </div>
                               {action.description && (
                                 <div className="text-sm text-muted-foreground mt-1 line-clamp-1">
                                   {action.description}
                                 </div>
                               )}
                               <div className="text-xs text-muted-foreground mt-1">
                                 Created {format(new Date(action.createdAt), "MMM dd, yyyy")}
                               </div>
                             </div>
                           </div>
                           <DropdownMenu>
                             <DropdownMenuTrigger asChild>
                               <Button variant="ghost" className="h-8 w-8 p-0">
                                 <span className="sr-only">Open menu</span>
                                 <MoreHorizontal className="h-4 w-4" />
                               </Button>
                             </DropdownMenuTrigger>
                             <DropdownMenuContent align="end">
                               <DropdownMenuLabel>Actions</DropdownMenuLabel>
                               <DropdownMenuItem onClick={() => handleEditAction(action)}>
                                 <Edit className="mr-2 h-4 w-4" />
                                 Edit
                               </DropdownMenuItem>
                               <DropdownMenuSeparator />
                               <DropdownMenuItem 
                                 onClick={() => handleDeleteAction(action)}
                                 className="text-red-600"
                               >
                                 <Trash2 className="mr-2 h-4 w-4" />
                                 Delete
                               </DropdownMenuItem>
                             </DropdownMenuContent>
                           </DropdownMenu>
                         </div>
                       ))}
                     </div>
                   )}
                   
                   {/* Simple pagination indicator */}
                   {!isLoading && actions.length > 0 && (
                     <div className="flex items-center justify-center pt-4">
                       <p className="text-sm text-muted-foreground">
                         Showing {actions.length} of {actionsData?.total || 0} actions
                       </p>
                     </div>
                   )}
                 </CardContent>
               </Card>
             )}
          </div>
        </SheetContent>
      </Sheet>

      {/* Action Modal */}
      <Dialog open={modalOpen} onOpenChange={handleModalClose}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingAction ? "Edit Action" : "Create Action"}
            </DialogTitle>
            <DialogDescription>
              {editingAction 
                ? "Update the action information below."
                : "Add a new action for this resource."
              }
            </DialogDescription>
          </DialogHeader>
          <ActionForm
            action={editingAction}
            onSubmit={editingAction ? handleUpdateAction : handleCreateAction}
            onCancel={handleModalClose}
            loading={createActionMutation.isPending || updateActionMutation.isPending}
          />
        </DialogContent>
      </Dialog>
    </>
  )
}
