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
import { MoreHorizontal, Edit, Trash2, UserCheck, UserX, Loader2, Shield } from "lucide-react"
import { 
  useUpdateUserMutation, 
  useDeactivateUserMutation, 
  useActivateUserMutation, 
  useDeleteUserMutation 
} from "../hooks"
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog"
import { UserRoleModal } from "./user-role-modal"
import toast from "react-hot-toast"

interface UserActionsProps {
  user: User
  onUserUpdate?: () => void
}

export function UserActions({ user, onUserUpdate }: UserActionsProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [statusDialogOpen, setStatusDialogOpen] = useState(false)
  const [roleModalOpen, setRoleModalOpen] = useState(false)

  const updateUserMutation = useUpdateUserMutation()
  const deactivateUserMutation = useDeactivateUserMutation()
  const activateUserMutation = useActivateUserMutation()
  const deleteUserMutation = useDeleteUserMutation()

  const isLoading = updateUserMutation.isPending || 
                   deactivateUserMutation.isPending || 
                   activateUserMutation.isPending || 
                   deleteUserMutation.isPending

  const handleToggleStatus = async () => {
    try {
      if (user.isActive) {
        await deactivateUserMutation.mutateAsync(user.id)
      } else {
        await activateUserMutation.mutateAsync(user.id)
      }
      setStatusDialogOpen(false)
      onUserUpdate?.()
    } catch (error) {
      // Error is handled by the mutation hook
    }
  }

  const handleDelete = async () => {
    try {
      await deleteUserMutation.mutateAsync(user.id)
      setDeleteDialogOpen(false)
      onUserUpdate?.()
    } catch (error) {
      // Error is handled by the mutation hook
    }
  }

  const copyUserId = (id: string) => {
    navigator.clipboard.writeText(id)
    toast.success('User ID copied to clipboard')
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0" disabled={isLoading}>
            <span className="sr-only">Open menu</span>
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <MoreHorizontal className="h-4 w-4" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
         
          <DropdownMenuItem
            onClick={() => copyUserId(user.id)}
            disabled={isLoading}
          >
            Copier l'ID utilisateur
          </DropdownMenuItem>
          <DropdownMenuSeparator />
         
          <DropdownMenuItem
            onClick={() => setRoleModalOpen(true)}
            disabled={isLoading}
          >
            <Shield className="mr-2 h-4 w-4" />
            Gérer les rôles
          </DropdownMenuItem>
          <DropdownMenuSeparator />
         
          <DropdownMenuItem
            onClick={() => setStatusDialogOpen(true)}
            disabled={isLoading}
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
            disabled={isLoading}
            className="text-red-600"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Supprimer l'utilisateur
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* User Role Management Modal */}
      <UserRoleModal
        open={roleModalOpen}
        onOpenChange={setRoleModalOpen}
        user={user}
      />

      {/* Status Toggle Confirmation Dialog */}
      <ConfirmationDialog
        open={statusDialogOpen}
        onOpenChange={setStatusDialogOpen}
        title={user.isActive ? "Désactiver l'utilisateur" : "Activer l'utilisateur"}
        description={`Êtes-vous sûr de vouloir ${user.isActive ? 'désactiver' : 'activer'} ${user.firstName} ${user.lastName} ?`}
        confirmText={user.isActive ? "Désactiver" : "Activer"}
        onConfirm={handleToggleStatus}
        loading={user.isActive ? deactivateUserMutation.isPending : activateUserMutation.isPending}
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
        loading={deleteUserMutation.isPending}
        variant="destructive"
      />

    </>
  )
}
