"use client"

import { useState } from "react"
import { Store } from "../types"
import { Button } from "@/components/ui/button"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, CheckCircle, XCircle, Pause, Play, Edit, Trash2, Loader2 } from "lucide-react"
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog"
import toast from "react-hot-toast"

interface StoreActionsProps {
  store: Store
  onStoreUpdate?: () => void
}

export function StoreActions({ store, onStoreUpdate }: StoreActionsProps) {
  const [loading, setLoading] = useState(false)
  const [actionType, setActionType] = useState<string | null>(null)
  const [statusDialogOpen, setStatusDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [newStatus, setNewStatus] = useState<Store['status'] | null>(null)

  const handleStatusChange = async (status: Store['status']) => {
    try {
      setLoading(true)
      setActionType(status)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const statusMessages = {
        approved: 'approuvé',
        rejected: 'rejeté',
        inactive: 'désactivé',
        pending: 'mis en attente'
      }
      
      toast.success(`Le magasin "${store.name}" a été ${statusMessages[status]}`)
      setStatusDialogOpen(false)
      onStoreUpdate?.()
    } catch (error) {
      toast.error('Erreur lors de la mise à jour du statut')
    } finally {
      setLoading(false)
      setActionType(null)
    }
  }

  const handleDelete = async () => {
    try {
      setLoading(true)
      setActionType('delete')
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast.success(`Le magasin "${store.name}" a été supprimé`)
      setDeleteDialogOpen(false)
      onStoreUpdate?.()
    } catch (error) {
      toast.error('Erreur lors de la suppression du magasin')
    } finally {
      setLoading(false)
      setActionType(null)
    }
  }

  const handleEdit = () => {
    toast(`Modifier ${store.name}`, {
      icon: '✏️',
      duration: 3000
    })
  }

  const getStatusIcon = (status: Store['status']) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="mr-2 h-4 w-4" />
      case 'rejected':
        return <XCircle className="mr-2 h-4 w-4" />
      case 'inactive':
        return <Pause className="mr-2 h-4 w-4" />
      case 'pending':
        return <Play className="mr-2 h-4 w-4" />
      default:
        return null
    }
  }

  const getStatusLabel = (status: Store['status']) => {
    switch (status) {
      case 'approved':
        return 'Approuver'
      case 'rejected':
        return 'Rejeter'
      case 'inactive':
        return 'Désactiver'
      case 'pending':
        return 'Mettre en attente'
      default:
        return status
    }
  }

  const getStatusColor = (status: Store['status']) => {
    switch (status) {
      case 'approved':
        return 'text-green-600'
      case 'rejected':
        return 'text-red-600'
      case 'inactive':
        return 'text-orange-600'
      case 'pending':
        return 'text-yellow-600'
      default:
        return 'text-gray-600'
    }
  }

  const isActionLoading = loading && actionType !== null

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Ouvrir le menu</span>
            {isActionLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <MoreHorizontal className="h-4 w-4" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          <DropdownMenuItem
            onClick={() => handleEdit()}
            disabled={loading}
          >
            <Edit className="mr-2 h-4 w-4" />
            Modifier
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          {/* Status Change Options */}
          {store.status !== 'approved' && (
            <DropdownMenuItem 
              className="text-green-600"
              onClick={() => {
                setNewStatus('approved')
                setStatusDialogOpen(true)
              }}
              disabled={loading}
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Approuver
            </DropdownMenuItem>
          )}
          
          {store.status !== 'rejected' && (
            <DropdownMenuItem 
              className="text-red-600"
              onClick={() => {
                setNewStatus('rejected')
                setStatusDialogOpen(true)
              }}
              disabled={loading}
            >
              <XCircle className="mr-2 h-4 w-4" />
              Rejeter
            </DropdownMenuItem>
          )}
          
          {store.status !== 'inactive' && (
            <DropdownMenuItem 
              className="text-orange-600"
              onClick={() => {
                setNewStatus('inactive')
                setStatusDialogOpen(true)
              }}
              disabled={loading}
            >
              <Pause className="mr-2 h-4 w-4" />
              Désactiver
            </DropdownMenuItem>
          )}
          
          {store.status !== 'pending' && (
            <DropdownMenuItem 
              className="text-yellow-600"
              onClick={() => {
                setNewStatus('pending')
                setStatusDialogOpen(true)
              }}
              disabled={loading}
            >
              <Play className="mr-2 h-4 w-4" />
              Mettre en attente
            </DropdownMenuItem>
          )}
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem 
            className="text-red-600"
            onClick={() => setDeleteDialogOpen(true)}
            disabled={loading}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Supprimer
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Status Change Confirmation Dialog */}
      <ConfirmationDialog
        open={statusDialogOpen}
        onOpenChange={setStatusDialogOpen}
        title={`Changer le statut du magasin`}
        description={`Êtes-vous sûr de vouloir ${getStatusLabel(newStatus!)} le magasin "${store.name}" ?`}
        confirmText={getStatusLabel(newStatus!)}
        onConfirm={() => newStatus && handleStatusChange(newStatus)}
        loading={loading && actionType === newStatus}
        variant={newStatus === 'rejected' || newStatus === 'inactive' ? 'destructive' : 'default'}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Supprimer le magasin"
        description={`Êtes-vous sûr de vouloir supprimer le magasin "${store.name}" ? Cette action ne peut pas être annulée.`}
        confirmText="Supprimer"
        onConfirm={handleDelete}
        loading={loading && actionType === 'delete'}
        variant="destructive"
      />
    </>
  )
}
