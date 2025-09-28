import { useState } from 'react'
import { userService } from '@/lib/user-service'
import { User, UserUpdateData } from '@/features/users/types'
import toast from 'react-hot-toast'

export interface UserActionsState {
  loading: boolean
  actionType: string | null
}

export interface UserActionsReturn {
  state: UserActionsState
  editUser: (user: User) => void
  toggleUserStatus: (user: User) => Promise<void>
  deleteUser: (user: User) => Promise<void>
  copyUserId: (userId: string) => void
}

export function useUserActions(): UserActionsReturn {
  const [state, setState] = useState<UserActionsState>({
    loading: false,
    actionType: null
  })

  const setLoading = (loading: boolean, actionType: string | null = null) => {
    setState({ loading, actionType })
  }


  const editUser = (user: User) => {
    // For now, just show edit message
    // In a real app, this would open an edit modal or navigate to edit page
    toast(`Modifier ${user.firstName} ${user.lastName}`, {
      icon: '✏️',
      duration: 3000
    })
  }

  const toggleUserStatus = async (user: User) => {
    try {
      setLoading(true, user.isActive ? 'deactivate' : 'activate')
      
      if (user.isActive) {
        await userService.deactivateUser(user.id)
        toast.success(`${user.firstName} ${user.lastName} a été désactivé`)
      } else {
        await userService.activateUser(user.id)
        toast.success(`${user.firstName} ${user.lastName} a été activé`)
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Une erreur est survenue'
      toast.error(`Action échouée : ${errorMessage}`)
    } finally {
      setLoading(false)
    }
  }

  const deleteUser = async (user: User) => {
    try {
      setLoading(true, 'delete')
      
      await userService.deleteUser(user.id)
      toast.success(`${user.firstName} ${user.lastName} a été supprimé`)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Une erreur est survenue'
      toast.error(`Suppression échouée : ${errorMessage}`)
    } finally {
      setLoading(false)
    }
  }

  const copyUserId = (userId: string) => {
    navigator.clipboard.writeText(userId)
    toast.success('ID utilisateur copié dans le presse-papiers')
  }

  return {
    state,
    editUser,
    toggleUserStatus,
    deleteUser,
    copyUserId
  }
}
