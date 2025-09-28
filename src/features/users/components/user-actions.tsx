"use client"

import { useState } from "react"
import { User } from "../types"
import { Button } from "@/components/ui/button"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Edit, Trash2, UserCheck, UserX, Loader2 } from "lucide-react"
import { useUserActions } from "@/hooks/use-user-actions"
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog"

interface UserActionsProps {
  user: User
  onUserUpdate?: () => void
}

export function UserActions({ user, onUserUpdate }: UserActionsProps) {
  const { state, editUser, toggleUserStatus, deleteUser, copyUserId } = useUserActions()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [statusDialogOpen, setStatusDialogOpen] = useState(false)

  const handleToggleStatus = async () => {
    await toggleUserStatus(user)
    setStatusDialogOpen(false)
    onUserUpdate?.()
  }

  const handleDelete = async () => {
    await deleteUser(user)
    setDeleteDialogOpen(false)
    onUserUpdate?.()
  }

  const isActionLoading = state.loading && (
    (state.actionType === 'delete' && user.id) ||
    (state.actionType === 'activate' && user.id) ||
    (state.actionType === 'deactivate' && user.id)
  )

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0" disabled={state.loading}>
            <span className="sr-only">Open menu</span>
            {isActionLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <MoreHorizontal className="h-4 w-4" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
         
          <DropdownMenuItem
            onClick={() => copyUserId(user.id)}
            disabled={state.loading}
          >
            Copier l'ID utilisateur
          </DropdownMenuItem>
          <DropdownMenuSeparator />
         
          <DropdownMenuItem
            onClick={() => setStatusDialogOpen(true)}
            disabled={state.loading}
            className={user.isActive ? "text-orange-600" : "text-green-600"}
          >
            {user.isActive ? (
              <UserX className="mr-2 h-4 w-4" />
            ) : (
              <UserCheck className="mr-2 h-4 w-4" />
            )}
            {user.isActive ? 'Désactiver' : 'Activer'}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setDeleteDialogOpen(true)}
            disabled={state.loading}
            className="text-red-600"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Supprimer l'utilisateur
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Status Toggle Confirmation Dialog */}
      <ConfirmationDialog
        open={statusDialogOpen}
        onOpenChange={setStatusDialogOpen}
        title={user.isActive ? "Désactiver l'utilisateur" : "Activer l'utilisateur"}
        description={`Êtes-vous sûr de vouloir ${user.isActive ? 'désactiver' : 'activer'} ${user.firstName} ${user.lastName} ?`}
        confirmText={user.isActive ? "Désactiver" : "Activer"}
        onConfirm={handleToggleStatus}
        loading={state.loading && state.actionType === (user.isActive ? 'deactivate' : 'activate')}
        variant={user.isActive ? 'destructive' : 'default'}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Supprimer l'utilisateur"
        description={`Êtes-vous sûr de vouloir supprimer ${user.firstName} ${user.lastName} ? Cette action ne peut pas être annulée.`}
        confirmText="Supprimer"
        onConfirm={handleDelete}
        loading={state.loading && state.actionType === 'delete'}
        variant="destructive"
      />

    </>
  )
}
